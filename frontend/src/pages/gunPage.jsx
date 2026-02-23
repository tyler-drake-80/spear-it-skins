import { useParams } from "react-router-dom"; //lets you read the dynamic part of the url


function GunPage() {
  const { type, itemId } = useParams();    // for /category/pistols in url , type = pistols 



   return (
    <>
      <h1>Page for {itemId.toUpperCase() } skins </h1>
      <h3>Category: {type} </h3>
      <h3>fill in with skins of each respective gun </h3>
    </>
  );
}

export default GunPage;