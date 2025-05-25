import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  FormControl,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SpiritModel from "../SpiritModel";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const weatherApiKey = "aaac0a28c51e4fce95374003251204";
const geminiApiKey = "AIzaSyATjGvQYESzcQ7S3aHpZUEqeXrK_9hofeQ";

// Location-based risk data
const farmLocations = [
  {
    name: "Cameron Highlands",
    coords: [4.4704, 101.3768],
    risk: "Low Pest Risk",
    riskLevel: "low",
  },
  {
    name: "Kedah",
    coords: [6.1210, 100.3600],
    risk: "High Flood Risk",
    riskLevel: "high",
  },
  {
    name: "Johor",
    coords: [1.4854, 103.7611],
    risk: "Moderate Heat Stress",
    riskLevel: "medium",
  },
  {
    name: "Sabah",
    coords: [5.9804, 116.0735],
    risk: "Low Humidity Stress",
    riskLevel: "low",
  },
];


// Risk icon by level
const getIconByRiskLevel = (level) =>
  new L.Icon({
    iconUrl:
      level === "high"
        ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
        : level === "medium"
        ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"
        : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

const getNotificationIcon = (level) => {
  if (level === "high") return "🔴";
  if (level === "medium") return "🟠";
  return "🟢";
};

const riskSourceChartData = {
  labels: ["Weather", "Soil", "Irrigation", "Pest", "Crop Choice"],
  datasets: [
    {
      label: "Risk Contribution %",
      data: [35, 20, 15, 20, 10],
      backgroundColor: "#3b82f6",
    },
  ],
};

const riskSourceChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Risk Source Breakdown (Mock Data)" },
  },
};

const statesData = {
  Johor: {
    temp: 32,
    humidity: 78,
    stage: "Flowering",
    risk: { weather: 30, soil: 25, irrigation: 15, pest: 20, crop: 10 },
  },
  Kedah: {
    temp: 34,
    humidity: 72,
    stage: "Vegetative",
    risk: { weather: 40, soil: 20, irrigation: 10, pest: 20, crop: 10 },
  },
  Kelantan: {
    temp: 30,
    humidity: 85,
    stage: "Reproductive",
    risk: { weather: 35, soil: 25, irrigation: 10, pest: 20, crop: 10 },
  },
  Malacca: {
    temp: 33,
    humidity: 76,
    stage: "Early Growth",
    risk: { weather: 25, soil: 20, irrigation: 20, pest: 25, crop: 10 },
  },
  NegeriSembilan: {
    temp: 31,
    humidity: 74,
    stage: "Flowering",
    risk: { weather: 20, soil: 30, irrigation: 15, pest: 20, crop: 15 },
  },
  Pahang: {
    temp: 29,
    humidity: 88,
    stage: "Vegetative",
    risk: { weather: 25, soil: 30, irrigation: 15, pest: 15, crop: 15 },
  },
  Penang: {
    temp: 32,
    humidity: 70,
    stage: "Harvest",
    risk: { weather: 30, soil: 25, irrigation: 10, pest: 25, crop: 10 },
  },
  Perak: {
    temp: 31,
    humidity: 80,
    stage: "Reproductive",
    risk: { weather: 35, soil: 20, irrigation: 15, pest: 20, crop: 10 },
  },
  Perlis: {
    temp: 33,
    humidity: 68,
    stage: "Early Growth",
    risk: { weather: 40, soil: 20, irrigation: 10, pest: 20, crop: 10 },
  },
  Sabah: {
    temp: 30,
    humidity: 90,
    stage: "Vegetative",
    risk: { weather: 30, soil: 25, irrigation: 10, pest: 20, crop: 15 },
  },
  Sarawak: {
    temp: 28,
    humidity: 92,
    stage: "Flowering",
    risk: { weather: 20, soil: 30, irrigation: 15, pest: 20, crop: 15 },
  },
  Selangor: {
    temp: 31,
    humidity: 75,
    stage: "Reproductive",
    risk: { weather: 35, soil: 20, irrigation: 15, pest: 20, crop: 10 },
  },
};

const Riskdashboardpage = () => {
  const [weather, setWeather] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [modelPath, setModelPath] = useState("/models/idle.glb");
  const [selectedState, setSelectedState] = useState("Johor");


  useEffect(() => {
    const getWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=Malaysia`
        );
        setWeather(res.data.current);
      } catch (err) {
        console.error("Weather API error", err);
      }
    };
    getWeather();
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "transparent", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ⚠️ Risk Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Monitor agricultural threats & weather across Malaysia.
      </Typography>

      {/* Weather */}
      {weather && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">🌤️ National Weather</Typography>
          <Typography>Temperature: {weather.temp_c} °C</Typography>
          <Typography>Humidity: {weather.humidity} %</Typography>
          <Typography>Wind: {weather.wind_kph} kph</Typography>
        </Paper>
      )}

      {/* Risk Level Legend */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">🧭 Risk Level Legend</Typography>
        <Stack direction="row" spacing={2} mt={1}>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 14,
                height: 14,
                bgcolor: "#ef4444",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="body2">High Risk</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 14,
                height: 14,
                bgcolor: "#facc15",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="body2">Medium Risk</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 14,
                height: 14,
                bgcolor: "#22c55e",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="body2">Low Risk</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Map */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">🗺️ Agricultural Risk Map</Typography>
        <MapContainer center={[4.2, 101]} zoom={6.2} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {farmLocations.map((loc, i) => (
            <Marker
              key={i}
              position={loc.coords}
              icon={getIconByRiskLevel(loc.riskLevel)}
            >
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                Risk: {loc.risk}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>

      {/* Notifications */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">🔔 Notification Logs</Typography>
        <List>
          {farmLocations.map((loc, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={`${getNotificationIcon(loc.riskLevel)} ${loc.name}: ${loc.risk}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Risk Source Analysis */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 Risk Source Analysis
        </Typography>
        <Box sx={{ height: 300, mb: 2 }}>
          <Bar data={riskSourceChartData} options={riskSourceChartOptions} />
        </Box>
        <Typography variant="body2">
          Based on simulated factors, the majority of risks in Malaysian agriculture stem from weather variability, 
          such as sudden droughts or floods. Soil fertility and irrigation practices also contribute significantly.
          Integrated monitoring and adaptive planning are key to risk reduction.
        </Typography>
      </Paper>

      {/* 🤖 AI Chatbot Floating Button */}
      <Box
        onClick={() => setAiOpen(true)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#fff",
          p: 2,
          borderRadius: "50%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 999,
        }}
      >
        <Typography fontSize={30}>🤖</Typography>
      </Box>

      <Dialog open={aiOpen} onClose={() => setAiOpen(false)} fullWidth>
        <DialogTitle>🧠 AI Risk Forecast</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth>
              <Typography>Select State</Typography>
              <TextField
                select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {Object.keys(statesData).map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <Button
              variant="contained"
              onClick={async () => {
                setModelPath("/models/ai.glb");

                const field = statesData[selectedState];

                const prompt = `You are an expert agricultural risk AI.

                For the Malaysian state of ${selectedState}, the conditions are:
                - Temperature: ${field.temp}°C
                - Humidity: ${field.humidity}%
                - Crop Stage: ${field.stage}
                - Risk Contributions (%): 
                  - Weather: ${field.risk.weather}
                  - Soil: ${field.risk.soil}
                  - Irrigation: ${field.risk.irrigation}
                  - Pest: ${field.risk.pest}
                  - Crop Choice: ${field.risk.crop}

                Based on these, predict:
                1. What type of agricultural risk this state may face in the next few weeks.
                2. Risk severity (High, Medium, Low).
                3. Confidence level (percentage).
                4. Brief explanation of key contributing factor.

                Limit response to 50 words.`;

                try {
                  const res = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
                    {
                      contents: [{ parts: [{ text: prompt }] }],
                    },
                    { headers: { "Content-Type": "application/json" } }
                  );

                  const reply =
                    res?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
                    "⚠️ No prediction.";

                  setAiResponse(reply);
                } catch (err) {
                  console.error("Gemini error", err);
                  setAiResponse("❌ AI request failed.");
                }
              }}
            >
              Predict Risk
            </Button>

            {aiResponse && (
              <>
                <Typography mt={2} fontWeight="bold">
                  ✅ AI Prediction:
                </Typography>
                <Typography>{aiResponse}</Typography>
                <Box sx={{ height: 280, mt: 2 }}>
                  <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
                    <ambientLight />
                    <directionalLight position={[2, 2, 2]} />
                    <OrbitControls enableZoom={false} />
                    <SpiritModel key={modelPath} modelPath={modelPath} />
                  </Canvas>
                </Box>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default Riskdashboardpage;
