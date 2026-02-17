function NavBar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Spear It Skins</h2>

      <div style={styles.links}>
        <span>Pistols </span>
        <span>ARs</span>
        <span>SMGs </span>
        <span>heavy </span>
        <span>Snipers</span>
        <span>knives</span>

      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
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