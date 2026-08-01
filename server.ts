import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use express json parser with large limit for base64 images
  app.use(express.json({ limit: "50mb" }));

  // AI Verification route
  app.post("/api/verify-subscription", async (req, res) => {
    try {
      const { imageBase64, channelName } = req.body;
      if (!imageBase64 || !channelName) {
        return res.status(400).json({ error: "Image and channel name are required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not set. Bypassing verification in dev.");
        return res.json({ verified: true, note: "auto-verified (no API key)" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Extract base64 data and mime type
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let mimeType = 'image/jpeg';
      let data = imageBase64;
      
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        data = matches[2];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: `You are a strict verification assistant. Look at this screenshot. Does it clearly show the YouTube channel named "${channelName}" AND does it show that the user is currently subscribed? Look for indicators like "Subscribed", "Abone olundu", "Abone", a filled bell icon, or similar subscription status indicators in any language (especially Turkish and English). Answer ONLY with "YES" if there is clear proof of subscription to this exact channel, or "NO" if they are not subscribed or the channel doesn't match.` },
              { inlineData: { mimeType, data } }
            ]
          }
        ]
      });

      const resultText = (response.text || "").trim().toUpperCase();
      const verified = resultText.includes("YES");

      res.json({ verified, raw: resultText });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ error: "Verification failed", details: error.message, stack: error.stack });
    }
  });

  // API route to proxy URL shortening
  app.post("/api/shorten", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const response = await fetch('https://clck.ru/--', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'url=' + encodeURIComponent(url)
      });
      
      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }
      
      const shortUrl = await response.text();
      res.json({ shortUrl });
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
