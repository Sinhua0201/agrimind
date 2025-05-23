import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Stack,
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Weather API key
const weatherApiKey = "aaac0a28c51e4fce95374003251204";

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

const Riskdashboardpage = () => {
  const [weather, setWeather] = useState(null);

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
    <Box sx={{ p: 4, bgcolor: "#f3f4f6", minHeight: "100vh" }}>
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
    </Box>
  );
};

export default Riskdashboardpage;
