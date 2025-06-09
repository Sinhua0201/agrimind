import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import Papa from "papaparse"; // 导入 papaparse 库
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SpiritModel from "../SpiritModel";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const geminiApiKey = "AIzaSyATjGvQYESzcQ7S3aHpZUEqeXrK_9hofeQ";
const months = [
  "2024-01", "2024-02", "2024-03", "2024-04", "2024-05",
  "2024-06", "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
];

const data = {
  Corn: {
    yield: [2.4, 2.5, 2.7, 2.8, 3.0, 3.1, 3.3, 3.2, 3.0, 2.9, 2.6, 2.5],
    price: [220, 225, 230, 235, 240, 245, 250, 248, 245, 240, 235, 230],
    income: [528, 562.5, 621, 658, 720, 759.5, 825, 793.6, 735, 696, 611, 575],
  },
  Rice: {
    yield: [3.0, 3.1, 3.0, 3.2, 3.3, 3.5, 3.6, 3.4, 3.3, 3.2, 3.0, 2.9],
    price: [180, 182, 185, 187, 190, 195, 200, 198, 195, 190, 185, 180],
    income: [540, 564.2, 555, 598.4, 627, 682.5, 720, 673.2, 644, 608, 555, 522],
  },
};

export default function Analyticspage() {
  const [selectedCrop, setSelectedCrop] = useState("Corn");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [modelPath, setModelPath] = useState("/models/idle.glb");

  const handleExportCSV = () => {
    const cropData = data[selectedCrop];

    // 构建 CSV 数据
    const csvData = cropData.yield.map((_, index) => ({
      Month: months[index],
      Yield: cropData.yield[index],
      Price: cropData.price[index],
      Income: cropData.income[index],
    }));

    // 使用 PapaParse 库将数据转换为 CSV
    const csv = Papa.unparse(csvData);

    // 创建并下载 CSV 文件
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedCrop}-data.csv`;
    link.click();
  };

  const cropData = data[selectedCrop];

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "transparent" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📊 Analytics & Reports
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Crop</InputLabel>
        <Select
          value={selectedCrop}
          label="Crop"
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          <MenuItem value="Corn">Corn</MenuItem>
          <MenuItem value="Rice">Rice</MenuItem>
        </Select>
      </FormControl>

      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 30,
          zIndex: 999,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportCSV}
        >
          📈 Export CSV
        </Button>
      </Box>

      <Box
        onClick={() => setAiOpen(true)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 30,
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

      <Box id="report">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">🌾 Yield Comparison</Typography>
              <Box sx={{ minWidth: 700 }}></Box>
              <Bar
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: "Yield (t/ha)",
                      data: cropData.yield,
                      backgroundColor: selectedCrop === "Corn" ? "#90caf9" : "#a5d6a7",
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">💰 Price Trend</Typography>
              <Box sx={{ minWidth: 700 }}></Box>
              <Line
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: "Price (RM/ton)",
                      data: cropData.price,
                      borderColor: "#ef6c00",
                      fill: false,
                      tension: 0.3,
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">📈 Income Simulation</Typography>
              <Box sx={{ minWidth: 700 }}></Box>
              <Line
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: "Income (RM)",
                      data: cropData.income,
                      borderColor: "#43a047",
                      fill: true,
                      backgroundColor: "rgba(67,160,71,0.2)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={aiOpen} onClose={() => setAiOpen(false)} fullWidth>
        <DialogTitle>🤖 AI Price Trend Forecast</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Based on current yield, price, and seasonality, here's what the AI predicts:
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Crop</InputLabel>
            <Select
              value={selectedCrop}
              label="Crop"
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <MenuItem value="Corn">Corn</MenuItem>
              <MenuItem value="Rice">Rice</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            disabled={!selectedCrop}
            onClick={async () => {
              setModelPath("/models/ai.glb");

              const monthsData = months.map((m, i) => `${m}: yield ${data[selectedCrop].yield[i]}t/ha, price RM${data[selectedCrop].price[i]}`);
              const prompt = `You are an agricultural economist AI. Here is crop data for ${selectedCrop}:

              ${monthsData.join("\n")}

              Based on the seasonal pattern, yield, and historical prices, predict the trend of ${selectedCrop} prices over the next 3 months in Malaysia.

              Your response must include:
              1. Estimated average price range in RM/ton (e.g. RM240–RM260).
              2. Direction: rising, falling, or stable.
              3. Main reason driving the trend.
              4. Confidence Level (percentage).

              Keep your answer under 60 words.`;

              try {
                const res = await axios.post(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
                  {
                    contents: [{ parts: [{ text: prompt }] }],
                  },
                  { headers: { "Content-Type": "application/json" } }
                );

                const reply =
                  res?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "⚠️ AI response failed.";
                setAiResult(reply);
              } catch (err) {
                console.error("AI fetch error:", err);
                setAiResult("❌ Error generating prediction.");
              }
            }}
          >
            Predict AI Trend
          </Button>

          {aiResult && (
            <Typography sx={{ mt: 2, whiteSpace: "pre-line" }}>
              🧠 <strong>AI says:</strong> {aiResult}
              <Box sx={{ height: 300, mt: 3 }}>
                <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
                  <ambientLight />
                  <directionalLight position={[2, 2, 2]} />
                  <OrbitControls enableZoom={false} />
                  <SpiritModel key={modelPath} modelPath={modelPath} />
                </Canvas>
              </Box>
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
