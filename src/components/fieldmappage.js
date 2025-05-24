import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import customMarker from "../assets/marker.png";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SpiritModel from "../SpiritModel"; // ✅ 按你的目录
import axios from "axios";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const geminiApiKey = "AIzaSyATjGvQYESzcQ7S3aHpZUEqeXrK_9hofeQ";
// ✅ Malaysia Crop States with Weather Data
const cropStates = {
  Rice: [
    { state: "Kelantan", percent: 12, temp: 31, weather: "Rainy", soil: 65 },
    { state: "Perak", percent: 11, temp: 30, weather: "Humid", soil: 68 },
    { state: "Perlis", percent: 9, temp: 32, weather: "Sunny", soil: 62 },
    { state: "Sarawak", percent: 9, temp: 29, weather: "Cloudy", soil: 66 },
    { state: "Selangor", percent: 7, temp: 30, weather: "Hot", soil: 63 },
    { state: "Penang", percent: 5, temp: 28, weather: "Humid", soil: 60 },
    { state: "Sabah", percent: 5, temp: 29, weather: "Cloudy", soil: 61 },
  ],
  Corn: [
    { state: "Selangor", percent: 26, temp: 32, weather: "Hot", soil: 55 },
    { state: "Johor", percent: 20, temp: 33, weather: "Sunny", soil: 58 },
    { state: "Sarawak", percent: 17, temp: 30, weather: "Rainy", soil: 60 },
    { state: "Perak", percent: 11, temp: 31, weather: "Humid", soil: 57 },
    { state: "Sabah", percent: 6, temp: 29, weather: "Windy", soil: 59 },
    { state: "Kedah", percent: 6, temp: 30, weather: "Dry", soil: 56 },
  ],
};

// ✅ Map Fields
const fields = [
  ...cropStates.Rice.map((s, index) => ({
    name: `${s.state} Rice Field`,
    crop: "Rice",
    coords:
      s.state === "Kelantan"
        ? [6.1254, 102.2381]
        : s.state === "Perak"
        ? [4.7, 101.1]
        : s.state === "Perlis"
        ? [6.4443, 100.1986]
        : s.state === "Sarawak"
        ? [1.5533, 110.3592]
        : s.state === "Selangor"
        ? [3.0738, 101.5183]
        : s.state === "Penang"
        ? [5.4, 100.3]
        : [5.9804, 116.0735], // Sabah
    moisture: s.soil,
    temp: s.temp,
    currentForecast: (Math.random() * 2 + 3).toFixed(1), // mock t/ha
    yieldHistory: [
      (Math.random() * 2 + 2).toFixed(1),
      (Math.random() * 2 + 2).toFixed(1),
      (Math.random() * 2 + 2).toFixed(1),
      (Math.random() * 2 + 2).toFixed(1),
    ],
    aiAdvice: `Expect ${s.weather.toLowerCase()} weather. Adjust irrigation accordingly.`,
    risk: s.soil < 60 ? "medium" : "low",
  })),
  ...cropStates.Corn.map((s, index) => ({
    name: `${s.state} Corn Field`,
    crop: "Corn",
    coords:
      s.state === "Selangor"
        ? [3.0738, 101.5183]
        : s.state === "Johor"
        ? [1.4854, 103.7611]
        : s.state === "Sarawak"
        ? [1.5533, 110.3592]
        : s.state === "Perak"
        ? [4.7, 101.1]
        : s.state === "Sabah"
        ? [5.9804, 116.0735]
        : [6.1210, 100.3600], // Kedah
    moisture: s.soil,
    temp: s.temp,
    currentForecast: (Math.random() * 2 + 3).toFixed(1),
    yieldHistory: [
      (Math.random() * 2 + 2).toFixed(1),
      (Math.random() * 2 + 2).toFixed(1),
      (Math.random() * 2 + 2).toFixed(1),
      (Math.random() * 2 + 2).toFixed(1),
    ],
    aiAdvice: `Sunny spells expected. Monitor soil closely.`,
    risk: s.soil < 58 ? "medium" : "low",
  })),
];


// ✅ Custom Marker Icon
const icon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -30],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});


const Fieldmappage = () => {
  const [cropFilter, setCropFilter] = useState("All");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [aiForecast, setAiForecast] = useState("");
  const [modelPath, setModelPath] = useState("/models/idle.glb");
  const lineColors = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6",
  "#eab308", "#f43f5e", "#8b5cf6", "#22c55e", "#ec4899", "#0ea5e9"
];


  const filteredFields =
    cropFilter === "All"
      ? fields
      : fields.filter((f) => f.crop === cropFilter);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🌾 Field Map Dashboard
      </Typography>

      {/* Crop Filter */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Crop</InputLabel>
        <Select
          value={cropFilter}
          label="Filter by Crop"
          onChange={(e) => setCropFilter(e.target.value)}
        >
          <MenuItem value="All">All Crops</MenuItem>
          <MenuItem value="Corn">Corn</MenuItem>
          <MenuItem value="Rice">Rice</MenuItem>
        </Select>
      </FormControl>

      {/* Crop Region Info */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
            🌾 Malaysia Crop Growing States with Weather
        </Typography>
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" gutterBottom>Rice Major States:</Typography>
            {cropStates.Rice.map((s, idx) => (
                <Typography key={idx} sx={{ ml: 2 }}>
                • {s.state} — {s.percent}% | Temp: {s.temp}°C | Weather: {s.weather} | Soil: {s.soil}%
                </Typography>
            ))}
            </Grid>
            <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" gutterBottom>Corn Major States:</Typography>
            {cropStates.Corn.map((s, idx) => (
                <Typography key={idx} sx={{ ml: 2 }}>
                • {s.state} — {s.percent}% | Temp: {s.temp}°C | Weather: {s.weather} | Soil: {s.soil}%
                </Typography>
            ))}
            </Grid>
        </Grid>
        </Paper>


      {/* Map */}
      <Paper sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          🗺️ Field Map View
        </Typography>
        <MapContainer
          center={[4.5, 101]}
          zoom={6}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredFields.map((field, index) => (
            <Marker key={index} position={field.coords} icon={icon}>
                <Popup>
                <strong>{field.name}</strong>
                <br />
                Crop: {field.crop}
                <br />
                Temp: {field.temp} °C<br />
                Moisture: {field.moisture} %<br />
                Forecast Yield: {field.currentForecast} t/ha<br />
                Risk:{" "}
                <span
                    style={{
                    color:
                        field.risk === "high"
                        ? "red"
                        : field.risk === "medium"
                        ? "orange"
                        : "green",
                    }}
                >
                    {field.risk}
                </span>
                <br />
                AI Tip: {field.aiAdvice}
                </Popup>
            </Marker>
            ))}

        </MapContainer>
      </Paper>
      {/* ✅ AI Floating Button */}
      <Box
        onClick={() => setShowDialog(true)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#fff",
          p: 2,
          borderRadius: "50%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        <Typography fontSize={30}>🤖</Typography>
      </Box>

      {/* ✅ AI Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth>
        <DialogTitle>📊 Yield Forecast AI</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Field</InputLabel>
            <Select
              value={selectedField}
              label="Select Field"
              onChange={(e) => setSelectedField(e.target.value)}
            >
              {fields.map((f, idx) => (
                <MenuItem key={idx} value={f.name}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={3}>
            <Button
              variant="contained"
              onClick={async () => {
                const field = fields.find((f) => f.name === selectedField);
                if (!field) return;

                setModelPath("/models/ai.glb");

                const prompt = `You are an expert agronomist AI.
                  Given the following data:
                  - Temperature: ${field.temp}°C
                  - Soil Moisture: ${field.moisture}%
                  - Weather: ${field.weather}
                  - Historical Yields (t/ha): ${field.yieldHistory.join(", ")}

                  Please provide:
                  1. A 2025 yield forecast in tons per hectare.
                  2. A confidence level (in %).
                  3. The key factors driving the prediction (e.g. "Low soil moisture may reduce yield").
                  Keep it concise, under 40 words total.`;

                const res = await axios.post(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
                  {
                    contents: [{ parts: [{ text: prompt }] }],
                  },
                  {
                    headers: { "Content-Type": "application/json" },
                  }
                );
                const data = res.data;

                const reply =
                  data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
                  "⚠️ Prediction failed.";

                setAiForecast(reply);
              }}
            >
              Predict Yield
            </Button>

            {aiForecast && (
              <Typography sx={{ mt: 3, whiteSpace: "pre-line" }}>
                ✅ <strong>Prediction:</strong> {aiForecast}
              </Typography>
            )}
          </Box>

          <Box sx={{ height: 300, mt: 3 }}>
            <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
              <ambientLight />
              <directionalLight position={[2, 2, 2]} />
              <OrbitControls enableZoom={false} />
              <SpiritModel key={modelPath} modelPath={modelPath} />
            </Canvas>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Charts */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* 第一行 Forecast Charts */}
        <Box sx={{ display: "flex", gap: 3, overflowX: "auto" }}>
            <Paper sx={{ minWidth: 800, p: 2 }}>
            <Typography variant="h6">📈🌽 Corn - Forecast Yield</Typography>
            <Bar
                data={{
                labels: fields.filter(f => f.crop === "Corn").map(f => f.name),
                datasets: [{
                    label: "2024 Forecast Yield (t/ha)",
                    data: fields.filter(f => f.crop === "Corn").map(f => f.currentForecast),
                    backgroundColor: "#60a5fa",
                }],
                }}
                options={{ responsive: true }}
            />
            </Paper>

            <Paper sx={{ minWidth: 800, p: 2 }}>
            <Typography variant="h6">📈🌾 Rice - Forecast Yield</Typography>
            <Bar
                data={{
                labels: fields.filter(f => f.crop === "Rice").map(f => f.name),
                datasets: [{
                    label: "2024 Forecast Yield (t/ha)",
                    data: fields.filter(f => f.crop === "Rice").map(f => f.currentForecast),
                    backgroundColor: "#86efac",
                }],
                }}
                options={{ responsive: true }}
            />
            </Paper>
        </Box>

        {/* 第二行 History Charts */}
        <Box sx={{ display: "flex", gap: 3, overflowX: "auto" }}>
            <Paper sx={{ minWidth: 800, p: 2 }}>
            <Typography variant="h6">📊🌽 Corn - Yield History</Typography>
            <Line
                data={{
                labels: ["2021", "2022", "2023", "2024"],
                datasets: fields
                    .filter(f => f.crop === "Corn")
                    .map((f, i) => ({
                    label: f.name,
                    data: f.yieldHistory,
                    borderColor: lineColors[i % lineColors.length],
                    fill: false,
                    tension: 0.3,
                    })),
                }}
                options={{ responsive: true }}
            />
            </Paper>

            <Paper sx={{ minWidth: 800, p: 2 }}>
            <Typography variant="h6">📊🌾 Rice - Yield History</Typography>
            <Line
                data={{
                labels: ["2021", "2022", "2023", "2024"],
                datasets: fields
                    .filter(f => f.crop === "Rice")
                    .map((f, i) => ({ 
                    label: f.name,
                    data: f.yieldHistory,
                    borderColor: lineColors[i % lineColors.length],
                    fill: false,
                    tension: 0.3,
                    })),
                }}
                options={{ responsive: true }}
            />
            </Paper>
        </Box>
        </Box>



    </Box>
  );
};

export default Fieldmappage;
