import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "./AnimatedCountup.css";

export default function AnimatedCountup({
  min,
  max,
  countUp,
  icon,
  label,
  handleAnimatedCountupValue,
}) {
  //   const [count, setCount] = useState(value);
  const [currentValue, setCurrentValue] = useState(0);

  //   const onClickMinus = () => {
  //     let callbackValue = count;
  //     if (count > min) {
  //       callbackValue = count - delta;
  //       setCount(count - delta);
  //     }
  //     if (typeof handleAnimatedCountupValue === "function") {
  //       handleAnimatedCountupValue({
  //         current: callbackValue
  //       });
  //     }
  //   };

  //   const onClickPlus = () => {
  //     let callbackValue = count;
  //     if (count < max) {
  //       callbackValue = count + delta;
  //       setCount(count + delta);
  //     }
  //     if (typeof handleAnimatedCountupValue === "function") {
  //       handleAnimatedCountupValue({
  //         current: callbackValue
  //       });
  //     }
  //   }

  //   let interval = 5000;

  //   useEffect(() => {
  //     let startValue = 0;
  //     let endValue = parseInt(countUp);
  //     let duration = Math.floor(interval / endValue);
  //     let counter = setInterval(() => {
  //         startValue +=1;
  //         setCurrentValue(startValue);
  //         console.log("currentValue", currentValue)
  //         if (startValue == endValue) {
  //             clearInterval(counter);
  //         }
  //     }, duration)
  //   }, []);

  const [counter, setCounter] = useState(0);

  const animateCounter = () => {
    const difference = countUp - counter;

    // Ajustez cette valeur pour contrôler l'effet d'interpolation logarithmique
    const easingFactor = 0.2;

    setCounter(counter + difference * easingFactor);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      animateCounter();
    }, 100); // Ajustez la durée de l'incrément selon vos besoins

    return () => {
      clearInterval(interval);
    };
  }, [counter, countUp]);

  return (
    // <div className="animated-counter-wrapper">
    <>
      <div className="animated-counter-container">
        <i className={`${icon}`}></i>
        {/* <span className="num" data-val={countUp}>
          {currentValue}
        </span> */}
        <div className="text-number">
          <p>{Math.round(counter)}</p>
        </div>
        <span className="text">{label}</span>
      </div>
    </>
    // </div>
  );
}

AnimatedCountup.defaultProps = {
  countUp: 100,
  label: "Count up label",
  icon: "fas fa-utensils",
};
