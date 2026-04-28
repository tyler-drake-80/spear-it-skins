import { useParams } from "react-router-dom"; //lets you read the dynamic part of the url
import {weapons} from "../data/weapons"
import CategoryPicture from "../components/CategoryPicture";
import {Link} from "react-router-dom";


function CategoryPage() {
  const { type } = useParams();    // gets /category/"weapons type" in url , type = "weapon type" 

  const data = categoryInfo[type]; //match url paramaters to categoryData if exists
  const weaponsList = Object.values( weapons[type] || {}); //gets the list of weapons for a corresponding gun category based on {type}

  if (!data) {                  //error checking if there is not valid page for a url consisting of /category/pistols/(something not valid)
    return <h2>Category not found</h2>;
  }

  return (
    <>
      <h1>{type.toUpperCase()}</h1>  
      <h2>Pictures will be updated soon,only cs75-auto link works for now </h2>
      <p>{data.description}</p>
      <div style = {styles.grid}>
        {weaponsList.map((weapon) => (
        <CategoryPicture
          key = {weapon.name}
          img = {weapon.img || "/stockGun.png"}
          title = {weapon.name}
          link = {weapon.url}
        />
        ))}  
      </div>
    </>
  );
}

export default CategoryPage;

const categoryInfo = {
  pistols: {
    title: "Pistols",
    description: "pistols are good as a secondary weapon sometimes"
  },

  smgs: {
    title: "SMGs",
    description: "smgs are good for short range use "
  },

  rifles: {
    title: "Rifles",
    description: "good for longer range fights" 
  },

  heavy: {
    title: "Heavy",
    description: "Shotguns / Light Machine Guns"
  },

  knives: {
    title: "Knives",
    description: "great for close combat"
  },

  gloves: {
    title: "Gloves",
    description: "Cosmetic gloves for your hands"
  },

};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    padding: "10px"

  }
  

}