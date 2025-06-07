import React, { useEffect, useState } from "react";

function App() {
  const [categories, setCategories] = useState({
    coming_soon: [],
    top_sellers: [],
    new_releases: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/steam/featured");
        const data = await response.json();
        console.log("Données Steam reçues :", data);
        setCategories(data);
      } catch (err) {
        console.error("Erreur API Steam :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderGames = (games) =>
    games.map((game) => (
      <div
        key={game.id}
        style={{
          backgroundColor: "#2a475e",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <img
          src={game.header_image}
          alt={game.name}
          style={{ width: "100%", borderRadius: "5px" }}
        />
        <h3>{game.name}</h3>
        <p>
          {game.final_price > 0
            ? `Prix : ${(game.final_price / 100).toFixed(2)} €`
            : "Gratuit"}
        </p>
      </div>
    ));

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#1b2838",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>🎮 Jeux Steam du moment</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <section>
            <h2>🔥 Top Sellers</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {renderGames(categories.top_sellers)}
            </div>
          </section>

          <section>
            <h2>🆕 New Releases</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {renderGames(categories.new_releases)}
            </div>
          </section>

          <section>
            <h2>⏳ Coming Soon</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {renderGames(categories.coming_soon)}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
