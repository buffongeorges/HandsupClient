import React, { useEffect, useState } from "react";

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
    }, 5000);
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
          <img src={"/images/handsup.png"} />
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
