import React from "react";
import { useParams } from "react-router-dom";


export default function EleveStats() {
    let { studentId } = useParams();
    console.log('studentId')
    console.log(studentId)

  return (
    <div
      className="container"
      style={{
        textAlign: "center",
        position: "relative",
        justifyContent: "center",
        paddingTop: "2rem",
        paddingLeft: "2rem",
      }}
    >
      {"Statistiques de l'élève ici"}
    </div>
  );
}
