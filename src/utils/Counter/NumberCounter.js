import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css";

export default function NumberCounter({
  min,
  max,
  value,
  delta,
  handleCounterValue,
  ...props
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
        current: callbackValue,
        difference: -delta,
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
        current: callbackValue,
        difference: delta,
      });
    }
  }

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
        <strong>{count}</strong>
      </span>
      <Button
        variant="outline-primary"
        className="plus"
        style={{ marginLeft: "1rem" }}
        disabled={count >= max}
        onClick={onClickPlus}
      >
        +
      </Button>
    </div>
  );
};
