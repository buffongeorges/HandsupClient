import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css"; 

export default function Counter({ min, max, value, delta }) {
  const [count, setCount] = useState(value);

  return (

    <div className="wrapper">
        <Button variant='outline-primary' className="minus" style={{marginRight: '1rem'}} onClick={() => {if (count>min) setCount(count - delta)}}>-</Button>
        <span><strong>{count}</strong></span>
        <Button variant='outline-primary' className="plus" style={{marginLeft: '1rem'}}onClick={() => {if (count<max) setCount(count + delta)}}>+</Button>
    </div>
  );
}
