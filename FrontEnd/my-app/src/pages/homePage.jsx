
import CategoryPicture from "../components/CategoryPicture";
function HomePage() {
  return (
    <>


      <h1>Home Page </h1>
      <h3>will add more gun pcitures w/ links to seperate categories</h3>
      <h3>also will add a home button</h3>
      <h3> pictures are clickable</h3>

    
      <CategoryPicture
        img = "/DesertEagle.jpg"
        title = "Pistols"
        link = "/category/pistols"
      />
    
      <CategoryPicture 
        img = "/SmgStock.png"
        title = "SMGs"
        link = "/category/pistols"
    
      />  
      
    </>
  );
}

export default HomePage;