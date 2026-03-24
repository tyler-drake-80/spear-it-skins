import { useParams } from "react-router-dom"; //lets you read the dynamic part of the url
import {weapons} from "../data/weapons"
import CategoryPicture from "../components/CategoryPicture";
import {Link} from "react-router-dom";


function CategoryPage() {
  const { type } = useParams();    // gets /category/"weapons type" in url , type = "weapon type" 

  const data = categoryData[type]; //match url paramaters to categoryData if exists
  const weaponsList = weapons[type];

  if (!data) {
    return <h2>Category not found</h2>;
  }

  return (
    <>
      <h1>{type.toUpperCase()}</h1> //display type as page title 
      <h2>Pictures will be updated soon,only cs75-auto link works for now </h2>
      <p>{data.description}</p>
      <div style = {styles.grid}>
        {weaponsList.map((weapon) => (
        <CategoryPicture
          img = "/SmgStock.png"
          title = {weapon.label}
          link = {weapon.url}
        />
        ))}  
      </div>
    </>
  );
}

export default CategoryPage;

const categoryData = {
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
  }
  
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    padding: "10px"

  }
  

}