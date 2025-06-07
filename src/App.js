import React, { useEffect, useState } from "react";

function App() {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const appid = 1903340; // Farming Simulator 22

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/steam/appdetails/${appid}?lang=french`);
        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Erreur côté client :", error);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, []);

  if (loading) return <div style={styles.container}>Chargement...</div>;
  if (!game) return <div style={styles.container}>Aucun jeu trouvé</div>;

  // Traduction de l'évaluation qualitative
  const reviewDescEN = game.review_score_desc || "Aucune évaluation";
  const reviewDescFR = {
    "Overwhelmingly Positive": "Écrasante majorité positive",
    "Very Positive": "Très positif",
    "Positive": "Positif",
    "Mostly Positive": "Plutôt positif",
    "Mixed": "Mitigé",
    "Mostly Negative": "Plutôt négatif",
    "Negative": "Négatif",
    "Very Negative": "Très négatif",
  }[reviewDescEN] || reviewDescEN;

  // Fonction pour afficher proprement objets / tableaux / primitives
  const renderValue = (value) => {
    if (typeof value === "string" && value.length > 300) {
      // Trop long, on coupe
      return <pre style={styles.pre}>{value.slice(0, 300)} ...</pre>;
    }
    if (typeof value === "object" && value !== null) {
      return <pre style={styles.pre}>{JSON.stringify(value, null, 2)}</pre>;
    }
    return <span>{String(value)}</span>;
  };

  // PEGI
  

  return (
    <div style={styles.container}>
      <h1>{game.name}</h1>
      <img src={game.header_image} alt={game.name} style={styles.image} />

      <p dangerouslySetInnerHTML={{ __html: game.short_description }} />
      <p dangerouslySetInnerHTML={{ __html: game.detailed_description }} />

      <p><strong>Date de sortie :</strong> {game.release_date?.date}</p>

      {game.is_free ? (
  <p><strong>Prix :</strong> Gratuit</p>
) : game.price_overview ? (
  <div>
    <p><strong>Prix :</strong></p>
    <ul>
      <li>Prix d'origine : {(game.price_overview.initial / 100).toFixed(2)} €</li>
      <li>Prix actuel : {(game.price_overview.final / 100).toFixed(2)} €</li>
      <li>Réduction : {game.price_overview.discount_percent}%</li>
      <li>Devise : {game.price_overview.currency}</li>
    </ul>
  </div>
) : (
  <p><strong>Prix :</strong> Non disponible</p>
)}


      {game.developers && (
        <p><strong>Développeur{game.developers.length > 1 ? "s" : ""} :</strong> {game.developers.join(", ")}</p>
      )}

      {game.publishers && (
        <p><strong>Éditeur{game.publishers.length > 1 ? "s" : ""} :</strong> {game.publishers.join(", ")}</p>
      )}

      {game.genres && (
        <p><strong>Genres :</strong> {game.genres.map(g => g.description).join(", ")}</p>
      )}

      {game.platforms && (
        <p>
          <strong>Plateformes :</strong>{" "}
          {game.platforms.windows && "🪟 Windows "}
          {game.platforms.mac && "🍏 Mac "}
          {game.platforms.linux && "🐧 Linux"}
        </p>
      )}

      {game.metacritic && (
        <p><strong>Score Metacritic :</strong> {game.metacritic.score} / 100</p>
      )}

      {game.recommendations && (
        <p><strong>Évaluations :</strong> {game.recommendations.total.toLocaleString()} joueurs ont donné leur avis</p>
      )}

      {game.review_score && (
        <p><strong>Score global :</strong> {reviewDescFR}</p>
      )}

       {/* ✅ Configuration requise */}
       {game.pc_requirements && (
        <>
          <h2>Configuration requise</h2>
          {game.pc_requirements.minimum && (
            <div>
              <strong>Configuration minimale :</strong>
              <p dangerouslySetInnerHTML={{ __html: game.pc_requirements.minimum }} />
            </div>
          )}
          {game.pc_requirements.recommended && (
            <div>
              <strong>Configuration recommandée :</strong>
              <p dangerouslySetInnerHTML={{ __html: game.pc_requirements.recommended }} />
            </div>
          )}
        </>
      )}

 {/* Ajout du champ Categories */}
 {game.categories && (
        <p>
          <strong>Catégories :</strong>{" "}
          {game.categories.map(cat => cat.description).join(", ")}
        </p>
      )}

{game.genres && game.genres.length > 0 && (
  <p><strong>Genre :</strong> {game.genres[0].description}</p>
)}


{game.support_info && (
  <div>
    <h2>Informations Support</h2>
    {game.support_info.url && (
      <p>
        <strong>Site de support : </strong>
        <a href={game.support_info.url} target="_blank" rel="noreferrer" style={{ color: "#66c0f4" }}>
          {game.support_info.url}
        </a>
      </p>
    )}
    {game.support_info.email && (
      <p><strong>Email support :</strong> {game.support_info.email}</p>
    )}
  </div>
)}



{game.background && (
  <div>
    <h2>Background</h2>
    <img src={game.background} alt="Background" style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "20px" }} />
  </div>
)}

{game.background_raw && (
  <div>
    <h2>Background Raw</h2>
    <img src={game.background_raw} alt="Background Raw" style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "20px" }} />
  </div>
)}

{game.content_descriptors && (
  <div>
    <h2>Descripteurs de contenu</h2>
    {game.content_descriptors.notes && <p>{game.content_descriptors.notes}</p>}
    {game.content_descriptors.ids && game.content_descriptors.ids.length > 0 && (
      <ul>
        {game.content_descriptors.ids.map((id) => (
          <li key={id}>ID : {id}</li>
        ))}
      </ul>
    )}
  </div>
)}


{game.ratings && (
  <div style={styles.section}>
    <h2>Ratings</h2>
    <ul style={styles.list}>
      {Object.entries(game.ratings).map(([key, value]) => (
        <li key={key} style={styles.listItem}>
          <strong>{key.replace(/_/g, " ")} :</strong> {typeof value === 'boolean' ? (value ? "Oui" : "Non") : value.toString()}
        </li>
      ))}
    </ul>
  </div>
)}


      {game.package_groups && game.package_groups.length > 0 && (
  <div>
    <h2>🎁 Offres disponibles</h2>
    {game.package_groups.map((group, idx) => (
      <div
        key={idx}
        style={{
          marginBottom: "20px",
          backgroundColor: "#2a475e",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <h3>{group.title}</h3>
        <ul>
          {group.subs.map((sub, subIdx) => {
            const finalPrice = sub.price_in_cents_with_discount / 100;
            const originalPrice = sub.price_in_cents / 100;
            const discountPct =
              originalPrice > 0
                ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
                : 0;
            const steamCartUrl = `https://store.steampowered.com/cart/addtowishlist/${sub.packageid}`;

            return (
              <li
                key={subIdx}
                style={{
                  marginBottom: "12px",
                  padding: "10px",
                  backgroundColor: "#1b2838",
                  borderRadius: "6px",
                }}
              >
                <p>
                  {sub.option_text.includes("Inclut") ? (
                    <strong>📦 {sub.option_text}</strong>
                  ) : (
                    sub.option_text
                  )}
                </p>
                <p>
                  {originalPrice > finalPrice ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#ccc",
                          marginRight: "8px",
                        }}
                      >
                        {originalPrice.toFixed(2)} €
                      </span>
                      <span style={{ color: "#66c0f4", fontWeight: "bold" }}>
                        {finalPrice.toFixed(2)} €
                      </span>
                      <span style={{ color: "#aaffaa", marginLeft: "8px" }}>
                        (-{discountPct}%)
                      </span>
                    </>
                  ) : (
                    <span>{finalPrice.toFixed(2)} €</span>
                  )}
                </p>
                <a
  href={`https://store.steampowered.com/sub/${sub.packageid}`}
  target="_blank"
  rel="noreferrer"
  style={{
    display: "inline-block",
    marginTop: "8px",
    padding: "6px 12px",
    backgroundColor: "#66c0f4",
    color: "#1b2838",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "bold",
  }}
>
  🛒 Voir sur Steam
</a>

              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
)}


      {game.screenshots && game.screenshots.length > 0 && (
        <>
          <h2>Captures d'écran</h2>
          <div style={styles.mediaGrid}>
            {game.screenshots.map(screenshot => (
              <img
                key={screenshot.id}
                src={screenshot.path_full}
                alt={`Screenshot ${screenshot.id}`}
                style={styles.screenshot}
              />
            ))}
          </div>
        </>
      )}

      {game.movies && game.movies.length > 0 && (
        <>
          <h2>Vidéos</h2>
          <div style={styles.mediaGrid}>
            {game.movies.map(movie => (
              <video
                key={movie.id}
                src={movie.webm?.max || movie.mp4?.max}
                controls
                style={styles.video}
              />
            ))}
          </div>
        </>
      )}

      {game.website && (
        <p>
          <strong>Site officiel : </strong>
          <a href={game.website} target="_blank" rel="noreferrer" style={{ color: "#66c0f4" }}>
            {game.website}
          </a>
        </p>
      )}

      <h2>Données complètes du jeu (JSON brut)</h2>
      <div style={{ maxHeight: 400, overflowY: "scroll", background: "#121b27", padding: 10, borderRadius: 5 }}>
        {Object.entries(game).map(([key, value]) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <strong>{key} :</strong> {renderValue(value)}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
    backgroundColor: "#1b2838",
    color: "white",
    minHeight: "100vh",
    maxWidth: "900px",
    margin: "0 auto",
  },
  image: {
    width: "100%",
    maxWidth: "600px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  mediaGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  screenshot: {
    width: "calc(33% - 10px)",
    borderRadius: "5px",
  },
  video: {
    width: "calc(50% - 10px)",
    borderRadius: "5px",
  },
  pre: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "12px",
    color: "#a0c4ff",
  },
  section: {
    marginBottom: "30px",
    backgroundColor: "#2a475e",
    padding: "15px",
    borderRadius: "8px",
  },
  
  list: {
    listStyleType: "none",
    paddingLeft: 0,
  },
  
  listItem: {
    padding: "8px 0",
    borderBottom: "1px solid #41729f",
    color: "#d0e6ff",
    fontSize: "14px",
  },
};
// g

export default App;
