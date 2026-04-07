import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DropDown1 from "./DropDown1.jsx";
import {weapons} from "../data/weapons";


function NavBar() {


    const home = []
    const gloves=[]
    ;
        

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>
        <Link to="/" style={{ textDecoration: 'none', color: '#690000' }}>
          Spear It Skins
        </Link>
      </h2>

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
          items = {gloves}
        />

        
        <DropDown1
          title="Home"
          categoryUrl="/"
          items= {home}
        />
        
      </div>

      <div style={styles.authLinks}>
        {isAuthenticated ? (
          <>
            <Link 
              to="/profile"
              style={styles.username}
            >
              👤 {user.username}
            </Link>
            <button 
              onClick={handleLogout}
              style={styles.authButton}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={styles.authButton}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={styles.registerButton}
            >
              Register
            </Link>
          </>
        )}
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
    flexWrap: "wrap",
    gap: "15px",
  },
  links: {
    display: "flex",
    gap: "30px",
    fontWeight: "bold",
  },
  logo: {
    margin: 0,
  },
  authLinks: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  authButton: {
    padding: "8px 16px",
    backgroundColor: "#690000",
    color: "white",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  registerButton: {
    padding: "8px 16px",
    backgroundColor: "#008700",
    color: "white",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  username: {
    fontWeight: "bold",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
};

export default NavBar;