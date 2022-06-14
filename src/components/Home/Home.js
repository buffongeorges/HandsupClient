import React, { useEffect, useState } from "react";
import { useLongPress, LongPressDetectEvents } from "use-long-press";
import Button from "react-bootstrap/Button";

import "./Home.css";
export default function Home({ handleNavbar }) {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = React.useState(true);

  const handleLongClick = () => {
    alert('click long')
  }

  const handleShortClick = () => {
    alert('click court')
  }
  const callback = React.useCallback(() => {
    handleLongClick();
  }, []);
  const bind = useLongPress(enabled ? callback : null, {
    onStart: () => console.log("Press started"),
    onFinish: () => console.log("Long press finished"),
    onCancel: () => console.log("Press cancelled"),
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: false,
    detect: LongPressDetectEvents.BOTH,
  });

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
    // if (true)
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

        <p id="demo">Test d'appui court et long: </p>
        <Button onClick={() => {handleShortClick()}} {...bind} style={{ width: 400, height: 200, fontSize: 50 }}>
          Press and hold
        </Button>
        {/* <div style={{ marginTop: 30, fontSize: 30 }}>
          <label htmlFor="enabled">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={() => setEnabled((current) => !current)}
            />
            Hook enabled
          </label>
        </div> */}
      </div>
    );
}
