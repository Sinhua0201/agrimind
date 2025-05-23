import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material";
import axios from "axios";

const geminiApiKey = "AIzaSyATjGvQYESzcQ7S3aHpZUEqeXrK_9hofeQ";

const presetQuestions = [
  "What is the best time to plant corn?",
  "Any fertilizer suggestions?",
  "Should I pause irrigation this week due to rain?",
  "What crop suits this season in Malaysia?",
];

const Chatbotpage = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("chat_history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(history));
  }, [history]);

  const sendToGemini = async (text) => {
    setLoading(true);
    try {
      const prompt = `${text}\n\nOnly answer based on agriculture conditions in Malaysia. Do not reference other countries. Be short, specific, and practical.`;

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );

      const answer =
        res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No valid response";

      const newEntry = { question: text, answer };
      setHistory((prev) => [...prev, newEntry]);
    } catch (err) {
      console.error(err);
      const failEntry = {
        question: text,
        answer: "❌ Request failed. Please try again later.",
      };
      setHistory((prev) => [...prev, failEntry]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleAsk = () => {
    if (!input.trim()) return;
    sendToGemini(input);
  };

  const handlePreset = (preset) => {
    sendToGemini(preset);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: "#00695c", mb: 1 }}
        >
          🌾 AgriMind AI Assistant
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#455a64" }}>
          Practical farming advice tailored for Malaysia 🇲🇾
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
        <Grid container spacing={1} justifyContent="center">
          {presetQuestions.map((q, i) => (
            <Grid item key={i}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePreset(q)}
                sx={{
                  borderRadius: 20,
                  textTransform: "none",
                  backgroundColor: "#ffffff",
                  borderColor: "#aed581",
                  color: "#33691e",
                  "&:hover": {
                    backgroundColor: "#f1f8e9",
                    borderColor: "#689f38",
                  },
                }}
              >
                {q}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ maxWidth: 800, mx: "auto", mb: 3 }}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
          <TextField
            fullWidth
            label="Ask something about Malaysian agriculture..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            disabled={loading}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={handleAsk}
            disabled={loading}
            sx={{ height: 48 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Ask AI"}
          </Button>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {history.map((entry, index) => (
          <Card
            key={index}
            sx={{
              mb: 2,
              backgroundColor: "#ffffff",
              borderLeft: "6px solid #81c784",
              borderRadius: 3,
            }}
            elevation={2}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                👤 You:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {entry.question}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                🤖 AI:
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", color: "#2e7d32" }}
              >
                {entry.answer}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Chatbotpage;
