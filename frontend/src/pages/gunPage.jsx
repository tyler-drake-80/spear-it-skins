import { useParams } from "react-router-dom"; //lets you read the dynamic part of the url
import { pistolSkins } from "../data/pistolSkins";

import CategoryPicture from "../components/CategoryPicture";
import { Link } from "react-router-dom";

import {weapons} from "../data/weapons"; 
import {smgSkins} from "../data/smgSkins";
import {rifleSkins} from "../data/rilfeSkins";
import {knifeSkins} from "../data/knifeSkins"
import {heavySkins} from "../data/heavySkins"


function GunPage() {
  const { type, itemId } = useParams();    // for /category/pistols in url , type = gun class, itemId = specific gun  

  const skinData = {
    pistols: pistolSkins,
    smgs: smgSkins,
    rifles: rifleSkins,
    knives: knifeSkins,
    heavy: heavySkins,
  };

  const gunList = skinData[type];
  const gunName = gunList?.[itemId];

  if (!gunName) {
    return <h2>Gun not found</h2>;
  }

  const skinList = Object.values(gunName);

  const weaponData = weapons[type]?.[itemId];
  const description = weaponData?.description;
  const weaponsList = Object.values( weapons[type] || {});
  
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
            ? `/category/${type}/${itemId}/${data.url_add_on}`
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