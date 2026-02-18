import DropDown1 from "./DropDown1.jsx";
import BasicButtonExample from "./dropdown.jsx";


function NavBar() {
    const pistols = [
    { label: "CZ75-Auto", url: "/category/pistols/CZ75-Auto" },
    { label: "DesertEagle", url: "/tba" },
    { label: "Dual Berettas", url: "/tba" }
  ];

    const smgs = [
      {label: "Smg1", url: "/smg1"}
    ]

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Spear It Skins</h2>

      <div style={styles.links}>
        <span>Weapons</span>
        <DropDown1 
          title="Pistols" 
          categoryUrl="/category/pistols"
          items= {pistols} 
        />    
        <DropDown1 
          title="Smgs" 
          categoryUrl="/category/smgs"
          items= {smgs} 
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
    padding: "15px 25px",
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