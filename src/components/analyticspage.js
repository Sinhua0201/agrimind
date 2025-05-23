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
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

  const handleExportPDF = () => {
    const input = document.getElementById("report");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("analytics-report.pdf");
    });
  };

  const cropData = data[selectedCrop];

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
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

      <Box id="report">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" >🌾 Yield Comparison</Typography>
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

      <Button
        variant="contained"
        color="secondary"
        onClick={handleExportPDF}
        sx={{ mt: 3 }}
      >
        📄 Export PDF Report
      </Button>
    </Box>
  );
}
