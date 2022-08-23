import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css";

export default function Counter({
  min,
  max,
  value,
  delta,
  handleCounterValue,
}) {
  const [count, setCount] = useState(value);

  const onClickMinus = () => {
    let callbackValue = count;
    if (count > min) {
      callbackValue = count - delta; 
      setCount(count - delta);
    }
    if (typeof handleCounterValue === "function") {
      handleCounterValue({
        current: callbackValue
      });
    }
  };

  const onClickPlus = () => {
    let callbackValue = count;
    if (count < max) {
      callbackValue = count + delta;
      setCount(count + delta);
    }
    if (typeof handleCounterValue === "function") {
      handleCounterValue({
        current: callbackValue
      });
    }
  }

  return (
    <div className="wrapper">
      <Button
        variant="outline-primary"
        className="minus"
        style={{ marginRight: "1rem" }}
        onClick={onClickMinus}
      >
        -
      </Button>
      <span>
        <strong>{count}</strong>
      </span>
      <Button
        variant="outline-primary"
        className="plus"
        style={{ marginLeft: "1rem" }}
        onClick={onClickPlus}
      >
        +
      </Button>
    </div>
  );
}
