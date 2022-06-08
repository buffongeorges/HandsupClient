import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
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
      <ListGroup variant="flush" horizontal>
        {classes.map((classe, index) => {
          return (
            <>
              <ListGroup.Item className="border-0">
                <Button onClick={() => goToClass(classe)}>{classe}</Button>{" "}
                {index % 2 == 0 ? <br /> : ""}
              </ListGroup.Item>{" "}
              <br />
            </>
          );
        })}
      </ListGroup>
    </div>
  );
}
