import { useParams } from "react-router-dom";

function GlovesPage() {


        



    return (
    <>
        <h1>Gloves Page </h1>

            <>
      
      <h3>Category: {type}: {description}</h3>
      <h3>need to fill in with skins of each respective gun </h3>
      
      <div style = {styles.grid}>
        {skinList.map((data) => (
        <CategoryPicture
          img = {data.img || "/stockGun.png"} 
          title = {data.name}
          link = {  data?.url_add_on
            ? `/category/${type}/${itemId}/${data.url_add_on}`
            : "/"  }
        />
        ))}  
      </div>
    </>


    </>    
    )


}

export default GlovesPage;