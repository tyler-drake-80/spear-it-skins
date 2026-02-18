import { useParams } from "react-router-dom"; //lets you read the dynamic part of the url


function GunPage() {
  const { type, itemId } = useParams();    // for /category/pistols in url , type = pistols 



   return (
    <>
      <h1>Page for Gun {itemId.toUpperCase()} </h1>
      <h3>Category: {type} </h3>
    </>
  );
}

export default GunPage;