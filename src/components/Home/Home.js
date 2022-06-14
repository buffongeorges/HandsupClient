import React, { useEffect, useState } from "react";

import "./Home.css";
export default function Home({ handleNavbar }) {
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (typeof handleNavbar === "function") {
      handleNavbar(false);
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (typeof handleNavbar === "function") {
        handleNavbar(true);
      }
    }, 1000);
  }, []);

  if (loading && typeof handleNavbar === "function")
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <img
            src={"/images/handsup.png"}
            style={{ maxWidth: "100%", maxHeight: "20%" }}
          />
          {/* <img src={'/images/icone_handsup.png'} style={{maxWidth: '100%', maxHeight: '20%'}}/> */}
          <img
            src={"/images/thumbnail_hand-finger-up.png"}
            style={{ maxWidth: "100%", maxHeight: "20%" }}
          />
        </div>
      </>
    );
  else
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
        {"Bienvenue sur Handsup"}
      </div>
    );
}
