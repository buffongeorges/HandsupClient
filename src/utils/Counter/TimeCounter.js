import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css";

export default function TimeCounter({
  min,
  max,
  value,
  delta,
  label,
  handleCounterValue,
  ...props
}) {
  const [count, setCount] = useState(value);

  const addTimes = (time1, time2) => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    const totalMinutes = hours1 * 60 + minutes1 + (hours2 * 60 + minutes2);

    const resultHours = Math.floor(totalMinutes / 60);
    const resultMinutes = totalMinutes % 60;

    // Formater le résultat
    const formattedResult = `${String(resultHours).padStart(2, "0")}:${String(
      resultMinutes
    ).padStart(2, "0")}`;

    return formattedResult;
  };
  const substractTimes = (time1, time2) => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    const totalMinutes = hours1 * 60 + minutes1 - (hours2 * 60 + minutes2);

    const resultHours = Math.floor(totalMinutes / 60);
    const resultMinutes = totalMinutes % 60;

    // Formater le résultat
    const formattedResult = `${String(resultHours).padStart(2, "0")}:${String(
      resultMinutes
    ).padStart(2, "0")}`;

    return formattedResult;
  };

  const onClickMinus = () => {
    let callbackValue = count;
    console.log("count", count);
    
    if (count > min) {
      const newTime = substractTimes(count, delta);
      console.log("newTime", newTime);
      setCount(newTime);
    }
    // if (count > min) {
    //   callbackValue = count - delta;
    //   setCount(count - delta);
    // }
    if (typeof handleCounterValue === "function") {
      handleCounterValue({
        current: callbackValue,
        difference: -delta,

      });
    }
  };

  const onClickPlus = () => {
    let callbackValue = count;
    console.log("count", count);

    if (count < max) {
      const newTime = addTimes(count, delta);
      console.log("newTime", newTime);
      setCount(newTime);
    }
    // if (count < max) {
    //   callbackValue = count + delta;
    //   setCount(count + delta);
    // }
    if (typeof handleCounterValue === "function") {
      handleCounterValue({
        current: callbackValue,
        difference: delta,
      });
    }
  };

  return (
    <div className="wrapper" {...props}>
      <Button
        variant="outline-primary"
        className="minus"
        style={{ marginRight: "1rem" }}
        onClick={onClickMinus}
        disabled={count <= min}
      >
        -
      </Button>
      <span>
        <strong>
          {count} {label}{count >= '02:00' && 's'}
        </strong>
      </span>
      <Button
        variant="outline-primary"
        className="plus"
        style={{ marginLeft: "1rem" }}
        onClick={onClickPlus}
        disabled={count >= max}
      >
        +
      </Button>
    </div>
  );
}

TimeCounter.defaultProps = {
  delta: "00:30",
  label: "heure",
  min: '00:00',
  max: '06:00'
};
