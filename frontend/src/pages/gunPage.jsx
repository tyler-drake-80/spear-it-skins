import { useParams } from "react-router-dom"; //lets you read the dynamic part of the url
import { pistolSkins } from "../data/pistolSkins";
import CategoryPicture from "../components/CategoryPicture";
function GunPage() {
  const { type, itemId } = useParams();    // for /category/pistols in url , type = pistols 


  
  const weaponsList = pistolSkins[itemId];

   return (
    <>
      <h1>Page for {itemId.toUpperCase() } skins </h1>
      <h3>Category: {type} </h3>
      <h3>fill in with skins of each respective gun, also urls do not work yet </h3>
      
      <div style = {styles.grid}>
        {weaponsList.map((data) => (
        <CategoryPicture
          img = "/SmgStock.png"
          title = {data.name}
          link = {"/"}
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