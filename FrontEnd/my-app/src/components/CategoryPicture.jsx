import {Link} from "react-router-dom"

function CategoryPicture ({img, title, link}){
    return(
    <Link to = {link} style = {styles.card} >
        
        <img src={img} alt = {title} style = {styles.image}/> 
        <h2 style ={styles.title}>{title}</h2>
      
    </Link>
    );

}

const styles = {
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textDecoration: "none",
        color: "black",
    },
    title: {
        marginTop: "5px",
        marginBottom: "0px"
    },
    image:{
        width: "200px",
    },
    
};

export default CategoryPicture; 