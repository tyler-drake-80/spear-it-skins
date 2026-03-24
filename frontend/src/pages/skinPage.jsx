

function SkinPage () {
  return (
    <>
      <h1>{type.toUpperCase()}</h1> //display type as page title 
      <h2>Pictures will be updated soon,but individual links are working </h2>
      <p>{data.description}</p>

    </>
  );
}

export default SkinPage;









const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    padding: "10px"

  }
  

}