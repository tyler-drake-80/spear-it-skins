import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoryPicture from "../components/CategoryPicture";
import { weapons } from "../data/weapons";

function GunPage() {
  const { type, itemId } = useParams();
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);

  const weaponData = weapons[type]?.[itemId];
  const weaponName = weaponData?.name || itemId;

  useEffect(() => {
    if (!weaponName) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/v1/skins?weapon=${encodeURIComponent(weaponName)}`)
      .then((res) => res.ok ? res.json() : { skins: [] })
      .then((data) => {
        setSkins(data.skins || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [weaponName]);

  if (loading) return <p style={{ padding: "24px" }}>Loading skins...</p>;

  return (
    <>
      <h1>Page for {itemId.toUpperCase()} skins</h1>
      <h3>Category: {type} — {weaponData?.description}</h3>

      <div style={styles.grid}>
        {skins.map((skin) => (
          <CategoryPicture
            key={skin.name}
            img={skin.image_url || "/stockGun.png"}
            title={skin.name}
            link={`/category/${type}/${itemId}/${skin.name.replace(/ /g, "-")}`}
          />
        ))}
      </div>
    </>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    padding: "10px",
  },
};

export default GunPage;
