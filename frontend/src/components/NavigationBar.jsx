import DropDown1 from "./DropDown1.jsx";



function NavBar() {
    const pistols = [
    { label: "CZ75-Auto",     url: "/category/pistols/CZ75-Auto" },
    { label: "DesertEagle",   url: "/category/pistols/Desert-Eagle" },
    { label: "Dual Berettas", url: "/category/pistols/Dual-Berettas" },
    { label: "Five-SeveN",    url: "/category/pistols/Five-Seven"},
    { label: "Glock-18",      url: "/category/pistols/Glock-18 "},
    { label: "P2000",         url: "/category/pistols/p2000 "},
    { label: "P250",          url: "/category/pistols/P250 "},
    { label: "R8-Revolver",   url: "/category/pistols/R8-Revolver "},
    { label: "Tech-9",        url: "/category/pistols/Tech-9 "},
    { label: "USP-S",         url: "/category/pistols/Usp-S"},
    { label: "Zeus-x27",      url: "/category/pistols/Zues-x27"},
  ];

    const smgs = [
      {label: "Mac-10",      url: "/category/smgs/Mac-10"},
      {label: "MP5-SD",      url: "/category/smgs/MP5-SD"},
      {label: "MP7",         url: "/category/smgs/MP7"},
      {label: "MP9",         url: "/category/smgs/MP9"},
      {label: "PP-Bizon",    url: "/category/smgs/PP-Bizon"},
      {label: "UMP-45",      url: "/category/smgs/UMP-45"},
    ]

    const rifles = [
      {label: "AK-47",       url:"/category/rifles/AK-47"}, 
      {label: "AUG",         url:"/category/rifles/AUG"}, 
      {label: "FAMAS",       url:"/category/rifles/FAMAS"}, 
      {label: "Galil-AR",    url:"/category/rifles/Galil-AR"}, 
      {label: "M4A1-S",      url:"/category/rifles/M4A1-S"}, 
      {label: "M4A4",        url:"/category/rifles/M4A4"}, 
      {label: "SG 553",      url:"/category/rifles/SG-553"}, 
      {label: "AWP",         url:"/category/rifles/AWP"}, 
      {label: "G3SG1",       url:"/category/rifles/G3SG1"}, 
      {label: "AWP",         url:"/category/rifles/AWP"}, 
      {label: "SCAR-20",     url:"/category/rifles/SCAR-20"}, 
      {label: "SSG-08",      url:"/category/rifles/SSG-08"}
    ]

    const knives = [
      { label: "Bayonet",         url: "/category/knives/Bayonet" },
      { label: "Bowie-Knife",     url: "/category/knives/Bowie-Knife" },
      { label: "Butterfly-Knife", url: "/category/knives/Butterfly-Knife" },
      { label: "Classic-Knife",   url: "/category/knives/Classic-Knife" },
      { label: "Falchion-Knife",  url: "/category/knives/Falchion-Knife" },
      { label: "Flip-Knife",      url: "/category/knives/Flip-Knife" },
      { label: "Gut-Knife",       url: "/category/knives/Gut-Knife" },
      { label: "Huntsman-Knife",  url: "/category/knives/Huntsman-Knife" },
      { label: "Karambit",        url: "/category/knives/Karambit" },
      { label: "Kukri-Knife",     url: "/category/knives/Kukri-Knife" },
      { label: "M9-Bayonet",      url: "/category/knives/M9-Bayonet" },
      { label: "Navaja-Knife",    url: "/category/knives/Navaja-Knife" },
      { label: "Nomad-Knife",     url: "/category/knives/Nomad-Knife" },
      { label: "Paracord-Knife",  url: "/category/knives/Paracord-Knife" },
      { label: "Shadow-Daggers",  url: "/category/knives/Shadow-Daggers" },
      { label: "Skeleton-Knife",  url: "/category/knives/Skeleton-Knife" },
      { label: "Stiletto-Knife",  url: "/category/knives/Stiletto-Knife" },
      { label: "Survival-Knife",  url: "/category/knives/Survival-Knife" },
      { label: "Talon-Knife",     url: "/category/knives/Talon-Knife" },
      { label: "Ursus-Knife",     url: "/category/knives/Ursus-Knife" },
    ];
    const heavy = [
      { label: "MAG-7",     url: "/category/heavy/MAG-7" },
      { label: "Nova",      url: "/category/heavy/Nova" },
      { label: "Sawed-Off", url: "/category/heavy/Sawed-Off" },
      { label: "XM1014",    url: "/category/heavy/XM1014" },
      { label: "M249",      url: "/category/heavy/M249" },
      { label: "Negev",     url: "/category/heavy/Negev" },
    ]
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
          items= {pistols} 
        />    
        <DropDown1 
          title="Smgs" 
          categoryUrl="/category/smgs"
          items= {smgs} 
        />
        
        <DropDown1 
          title="rifles" 
          categoryUrl="/category/rifles"
          items= {rifles} 
        />

        <DropDown1 
          title="knives" 
          categoryUrl="/category/knives"
          items= {knives} 
        />           

        <DropDown1 
          title="heavy" 
          categoryUrl="/category/heavy"
          items= {heavy} 
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