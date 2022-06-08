import React from "react";
import { useParams } from "react-router-dom";


export default function Classe() {
    let { id } = useParams();
    console.log('id')
    console.log(id)
 

  return (
    <div className="Login" style={{
        textAlign: "center",
        position: "relative",
        justifyContent: "center",
        paddingTop: "2rem",
        paddingLeft: "2rem",
      }}>
     {"Mettre ici les élèves de la " } {id}
    </div>
  );
}
