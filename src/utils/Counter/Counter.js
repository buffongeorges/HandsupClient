import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css";
import NumberCounter from "./NumberCounter";
import TimeCounter from "./TimeCounter";

export default function Counter(props) {
  if (props.type === 'number') {
    return <NumberCounter {...props}/>
  }
  else {
    return <TimeCounter {...props}/>
  }
};

Counter.defaultProps = {
  type: 'number'
}
