import { useParams } from "react-router-dom"; //lets you read the dynamic part of the url

function CategoryPage() {
  const { type } = useParams();    // for /category/pistols in url , type = pistols 

  const data = categoryData[type]; //match url paramaters to categoryData if exists

  if (!data) {
    return <h2>Category not found</h2>;
  }

  return (
    <>
      <h1>{type.toUpperCase()}</h1> //display type as page title 
      <p>{data.description}</p>
    </>
  );
}

export default CategoryPage;

const categoryData = {
  pistols: {
    title: "Pistols",
    description: "pistols are good as a secondary weapon sometimes"
  },
  smgs: {
    title: "SMGs",
    description: "smgs are good for short range use "
  }
};