import { useState } from "react";
import { Link } from "react-router-dom";

function DropDown1({title = "Menu", categoryUrl = "/", items = []}) {
  const [open, setOpen] = useState(false); 

  return (
    <div style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => setOpen(true)}  //display dropdown on hover
        onMouseLeave={() => setOpen(false)} //stop showing dropdown when not hoving 
        >
      <Link
        to ={categoryUrl}
        style={{
          padding: "10px 20px",
          backgroundColor: "#e0e0e0",
          color: "#690000",
          border: "none",
          cursor: "pointer"
        }}
      >
        {title} 
      </Link>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            background: "#f1f1f1",
            minWidth: "160px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 0px 16px rgb(173, 7, 7)",
            zIndex: 9999,
          }}
        >
          {items.map((item, index) => (
            <Link
              key= {item.url}
              to = {item.url} 
              style ={{
                padding: "10px",
                textDecoration: "none",
                color: "black"
              }}
            >
              {item.label}
            </Link>    
          ))}

        </div>
      )}

      </div>
  );
}

export default DropDown1;
