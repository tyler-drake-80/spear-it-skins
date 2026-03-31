import { pistolSkins } from "../data/pistolSkins";
import { useParams } from "react-router-dom"; 
import {smgSkins} from "../data/smgSkins"; 
import {rifleSkins} from "../data/rilfeSkins"; 

function SkinPage () {
   const { type, itemId, gunId } = useParams();  

   const skinData = {
    pistols: pistolSkins,
    smgs: smgSkins,
    rifles: rifleSkins
   };

   const gunList = skinData[type];
   


   const weaponData = gunList?.[itemId]?.[gunId];
   const description = weaponData?.description;
   
   console.log("type:", type);
console.log("itemId:", itemId);
console.log("gunId:", gunId);
console.log("gunList:", gunList);
console.log("weaponData:", weaponData);
  return (
    <>
      <h1>{type}:{itemId}:{gunId} ----  </h1> 
      <h2>Description: {description} </h2>
      <h2>connect to back end and display info like 
        min/max prices, cost, and so on , 
        will also need seperate file to display images with name/ rarity </h2>
      <p></p>

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


export default SkinPage;

