import { useParams } from "react-router-dom"; //lets you read the dynamic part of the url
import { pistolSkins } from "../data/pistolSkins";
import CategoryPicture from "../components/CategoryPicture";
import { Link } from "react-router-dom";
import {weapons} from "../data/weapons" 
function GunPage() {
  const { type, itemId } = useParams();    // for /category/pistols in url , type = gun class, itemId = specific gun  

  const gunName = pistolSkins[itemId]; //match url paramaters to categoryData if exists
  
  const skinList = pistolSkins[itemId];

    if (!gunName) {
    return <h2>page not complete yet</h2>;
  }
  const weaponData = weapons[type]?.[itemId];
  const description = weaponData?.description;
  
  
   return (
    <>
      <h1>Page for {itemId.toUpperCase() } skins </h1>
      <h3>Category: {type}: {description}</h3>
      <h3>need to fill in with skins of each respective gun </h3>
      
      <div style = {styles.grid}>
        {skinList.map((data) => (
        <CategoryPicture
          img = {data.img || "/stockGun.png"} 
          title = {data.name}
          link = {  data?.url_add_on
            ? `/category/pistols/${itemId}/${data.url_add_on}`
            : "/"  }
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
    padding: "10px"

  }
}
export default GunPage;