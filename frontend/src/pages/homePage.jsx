
import CategoryPicture from "../components/CategoryPicture";
function HomePage() {
  return (
    <>


      <h1>Home Page </h1>
      <h3> pictures are linked to respective category page</h3>

      <div style ={styles.grid}> 
      <CategoryPicture
        img = "/DesertEagle.jpg"
        title = "Pistols"
        link = "/category/pistols"
      />
    
      <CategoryPicture 
        img = "/SmgStock.png"
        title = "SMGs"
        link = "/category/smgs"
      />  

            <CategoryPicture 
        img = "/Rifle.png"
        title = "Rifles"
        link = "/category/rifles"
      />  

            <CategoryPicture 
        img = "/Knife.png"
        title = "Knives"
        link = "/category/knives"
      />  

            <CategoryPicture 
        img = "/Heavy.png"
        title = "Heavy"
        link = "/category/heavy"
      />  
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

export default HomePage;