import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "☁️",
    title: "Real-time Weather",
    path: "/weatherpage",
    description: "Monitor live weather tailored for your crops.",
  },
  {
    icon: "🗺️",
    title: "Field Map",
    path: "/fieldmappage",
    description: "Visualize your farm and soil data on map.",
  },
  {
    icon: "⚠️",
    title: "Risk Alerts",
    path: "/riskdashboard",
    description: "Get alerts for droughts and pest outbreaks.",
  },
  {
    icon: "🤖",
    title: "AI Advisor",
    path: "/chatbotpage",
    description: "Ask AI for smart farming decisions.",
  },
];

export default function Homepage() {
  return (
    <Box sx={{ p: 0 }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: "60vh",
          backgroundImage: "url('https://images.unsplash.com/photo-1600431521340-491eca880813')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          🌱 Predict Your Next Harvest with AI
        </Typography>
        <Typography variant="h6">
          Smart insights for Malaysian agriculture – from fields to future.
        </Typography>
      </Box>

      {/* Features */}
      <Box sx={{ py: 6, px: { xs: 2, md: 6 }, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          🌟 Explore AgriMind Features
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Link to={feature.path} style={{ textDecoration: "none" }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Typography variant="h2">{feature.icon}</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={1}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" mt={1} color="textSecondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
