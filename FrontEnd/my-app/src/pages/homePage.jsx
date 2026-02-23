import {Link} from "react-router-dom";
import DesertEagle from "../DesertEagle.jpg"
function HomePage() {
  return (
    <>


      <h1>Home Page </h1>
      <h3>will add more gun pcitures w/ links to seperate categories</h3>
      <h3>also will add a home button</h3>

      <Link to = {"/category/pistols"}>
        
          <img src={DesertEagle} alt = "Pistols" style = {{width: "200px"}}/> 
          <h2>pistols</h2>
      
      </Link>
    </>
  );
}

export default HomePage;