import React from "react";
import { useParams } from "react-router-dom";


export default function Eleve() {
    let { id } = useParams();

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
      {"Fiche élève et ses statistiques ici"}
    </div>
  );
}
