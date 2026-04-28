import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { weapons } from "../data/weapons";

const WEAR_ORDER = [
  "Factory New",
  "Minimal Wear",
  "Field-Tested",
  "Well-Worn",
  "Battle-Scarred",
];

function SkinPage() {
  const { type, itemId, gunId } = useParams();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // gunId uses hyphens for spaces in skin names (e.g. "Yellow-Jacket" → "Yellow Jacket")
  const skinName = gunId.replace(/-/g, " ");
  const weaponName = weapons[type]?.[itemId]?.name || itemId;

  useEffect(() => {
    const params = new URLSearchParams({
      weapon: weaponName,
      q: skinName,
      status: "all",
      limit: "20",
    });

    fetch(`http://localhost:4000/api/v1/items?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setVariants(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [weaponName, skinName]);

  // Sort by wear order; StatTrak items go after normal items
  const normalVariants = variants
    .filter((v) => !v.market_hash_name.startsWith("StatTrak™"))
    .sort((a, b) => {
      const ai = WEAR_ORDER.indexOf(a.exterior);
      const bi = WEAR_ORDER.indexOf(b.exterior);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  const statTrakVariants = variants
    .filter((v) => v.market_hash_name.startsWith("StatTrak™"))
    .sort((a, b) => {
      const ai = WEAR_ORDER.indexOf(a.exterior);
      const bi = WEAR_ORDER.indexOf(b.exterior);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  const skinImage =
    (normalVariants[0] || statTrakVariants[0])?.image_url || null;

  if (loading) return <p style={styles.status}>Loading...</p>;
  if (error) return <p style={styles.status}>Error: {error}</p>;
  if (variants.length === 0)
    return (
      <p style={styles.status}>
        No listings found for {weaponName} | {skinName}.
      </p>
    );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        {weaponName} | {skinName}
      </h1>

      {skinImage && (
        <img src={skinImage} alt={`${itemId} | ${skinName}`} style={styles.skinImage} />
      )}

      {normalVariants.length > 0 && (
        <section>
          <h2 style={styles.sectionHeader}>Normal</h2>
          <div style={styles.grid}>
            {normalVariants.map((v) => (
              <WearCard key={v.market_hash_name} item={v} />
            ))}
          </div>
        </section>
      )}

      {statTrakVariants.length > 0 && (
        <section>
          <h2 style={{ ...styles.sectionHeader, color: "#cf6a00" }}>
            StatTrak™
          </h2>
          <div style={styles.grid}>
            {statTrakVariants.map((v) => (
              <WearCard key={v.market_hash_name} item={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function WearCard({ item }) {
  const wear = item.exterior || "No Exterior";
  const minPrice =
    item.min_price !== null ? `$${item.min_price.toFixed(2)}` : "N/A";
  const suggestedPrice =
    item.suggested_price !== null
      ? `$${item.suggested_price.toFixed(2)}`
      : "N/A";

  return (
    <div style={styles.card}>
      <h3 style={styles.wearName}>{wear}</h3>
      <div style={styles.priceRow}>
        <span style={styles.label}>Min Price</span>
        <span style={styles.price}>{minPrice}</span>
      </div>
      <div style={styles.priceRow}>
        <span style={styles.label}>Suggested</span>
        <span style={styles.price}>{suggestedPrice}</span>
      </div>
      <div style={styles.priceRow}>
        <span style={styles.label}>Listings</span>
        <span style={styles.price}>{item.quantity ?? "N/A"}</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  status: {
    padding: "24px",
    fontSize: "18px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "16px",
  },
  skinImage: {
    width: "300px",
    display: "block",
    marginBottom: "24px",
  },
  sectionHeader: {
    fontSize: "20px",
    marginBottom: "12px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "4px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "32px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    minWidth: "160px",
    background: "#f9f9f9",
  },
  wearName: {
    fontSize: "15px",
    marginBottom: "12px",
    fontWeight: "bold",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "6px",
    fontSize: "14px",
  },
  label: {
    color: "#555",
  },
  price: {
    fontWeight: "600",
  },
};

export default SkinPage;
