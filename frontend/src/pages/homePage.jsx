
import CategoryPicture from "../components/CategoryPicture";
function HomePage() {
  return (
    <>


      <h1>Home Page </h1>
      <h3>will update pics to match category</h3>
      <h3> pictures are clickable</h3>

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
        img = "/SmgStock.png"
        title = "Rifles"
        link = "/category/rifles"
      />  

            <CategoryPicture 
        img = "/SmgStock.png"
        title = "Knives"
        link = "/category/knives"
      />  

            <CategoryPicture 
        img = "/SmgStock.png"
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