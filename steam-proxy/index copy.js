import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 4000;

// Remplace par ta vraie clé API Steam ici
const STEAM_API_KEY = "1CE5E87855387C28A16C0E1EB63903C5";

// Exemple de SteamID public
const EXAMPLE_STEAM_ID = "76561197960434622";

app.use(cors());

app.get("/steam/games/:steamid", async (req, res) => {
  const steamid = req.params.steamid || EXAMPLE_STEAM_ID;

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${}&steamid=${steamid}&include_appinfo=true&include_played_free_games=true`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.response && data.response.games) {
      res.json(data.response.games);
    } else {
      res.status(404).json({ error: "Aucun jeu trouvé pour ce SteamID" });
    }
  } catch (error) {
    console.error("Erreur API Steam :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération" });
  }
});

app.listen(PORT, () => {
  console.log(`Server en écoute sur http://localhost:${PORT}`);
});
