// server/index.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/steam/appdetails/:appid", async (req, res) => {
    const { appid } = req.params;
  
    try {
      const response = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appid}&l=french`
      );
      const json = await response.json();
      res.json(json[appid].data);
    } catch (error) {
      console.error("Erreur côté serveur :", error);
      res.status(500).json({ error: "Erreur de récupération depuis Steam" });
    }
  });
  
  

app.listen(PORT, () => {
  console.log(`✅ Serveur Steam proxy en ligne sur http://localhost:${PORT}`);
});
