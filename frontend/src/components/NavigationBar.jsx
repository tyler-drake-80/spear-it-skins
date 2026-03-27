import DropDown1 from "./DropDown1.jsx";
import {weapons} from "../data/weapons";


function NavBar() {


    const home = []
    ;
        

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Spear It Skins</h2>

      <div style={styles.links}>
        <span>Weapons</span>
        <DropDown1 
          title="Pistols" 
          categoryUrl="/category/pistols"
          items= {weapons["pistols"]} 
        />    
        <DropDown1 
          title="Smgs" 
          categoryUrl="/category/smgs"
          items= {weapons["smgs"]} 
        />
        
        <DropDown1 
          title="rifles" 
          categoryUrl="/category/rifles"
          items= {weapons["rifles"]} 
        />

        <DropDown1 
          title="knives" 
          categoryUrl="/category/knives"
          items= {weapons["knives"]} 
        />           

        <DropDown1 
          title="heavy" 
          categoryUrl="/category/heavy"
          items= {weapons["heavy"]} 
        />

        <DropDown1
          title = "Gloves"
          categoryUrl="/category/gloves"
          items = {weapons["gloves"]}
        />

        
        <DropDown1
          title="Home"
          categoryUrl="/"
          items= {home}
        />
        
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 35px",
    backgroundColor: "#b1b1b1",
    color: "#690000",
  },
  links: {
    display: "flex",
    gap: "30px",
    fontWeight: "bold",
  },
  logo: {
    margin: 0,
  },
};

export default NavBar;