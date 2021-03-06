import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

let classes = [
  "6EME 1",
  "6EME 2",
  "6EME 3",
  "6EME 4",
  "6EME 5",
  "6EME 6",
  "5EME 1",
  "5EME 2",
  "5EME 3",
  "5EME 4",
  "5EME 5",
  "5EME 6",
  "4EME 1",
  "4EME 2",
  "4EME 3",
  "4EME 4",
  "4EME 5",
  "4EME 6",
  "3EME 1",
  "3EME 2",
  "3EME 3",
  "3EME 4",
  "3EME 5",
  "3EME 6",
];

export default function Classes() {
  let navigate = useNavigate();
  const location = useLocation();

  const Input = () => {
    return <input placeholder="Your input here" />;
  };

  const [inputList, setInputList] = useState([]);

  const goToClass = (selectedClass) => {
    selectedClass = selectedClass.replace(/\s/g, "");

    let path = `${location.pathname}/${selectedClass}`;

    navigate(`${path}`, { replace: true });
  };
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

      {/* <Container fluid> */}
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {classes.map((classe, index) => {
            return (
              <div style={{ marginBottom: '2rem', marginRight: '2rem', flex: '1 0 21%'}}>
                <Button  onClick={() => goToClass(classe)}>{classe}</Button>
              </div>
            );
          })}
          </div>
      {/* </Container> */}
    </div>
  );
}
