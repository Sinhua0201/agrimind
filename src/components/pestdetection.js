import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "axios";

const geminiApiKey = "AIzaSyATjGvQYESzcQ7S3aHpZUEqeXrK_9hofeQ";

export default function PestDetectionPage() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setResult("");

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResult("");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1];

      const payload = {
        contents: [
          {
            parts: [
              {
                text:
                  "You are an agriculture pest expert. Identify the pest species in the image and describe its impact on crops. Give scientific and common name. Be concise.",
              },
              {
                inlineData: {
                  mimeType: imageFile.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };

      try {
        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          payload
        );

        const reply =
          res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "❌ Unable to identify the pest.";
        setResult(reply);
      } catch (err) {
        console.error(err);
        setResult("❌ Error processing image.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(imageFile);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "transparent", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🐛 Pest Detection from Image
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Upload a photo of a pest to identify the species and impact on crops.
      </Typography>

      <Paper sx={{ p: 3, mt: 2, mb: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {previewUrl && (
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              maxHeight: 300,
              objectFit: "contain",
              borderRadius: 2,
              mt: 1,
              border: "1px solid #ddd",
            }}
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !imageFile}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "🔍 Detect Pest"}
        </Button>
      </Paper>

      {result && (
        <Paper sx={{ p: 3, bgcolor: "#fffde7", borderLeft: "5px solid #facc15" }}>
          <Typography variant="h6" gutterBottom>
            ✅ Detection Result:
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Typography sx={{ whiteSpace: "pre-line", fontSize: "1rem" }}>
            {result}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
