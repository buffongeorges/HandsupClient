import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CounterInput from "react-counter-input";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

let eleves = [
  {
    id: 1,
    nom: "Eleve 1",
    photo: "../",
  },
  {
    id: 2,
    nom: "Eleve 2",
    photo: "../",
  },
  {
    id: 3,
    nom: "Eleve 3",
    photo: "../",
  },
  {
    id: 4,
    nom: "Eleve 4",
    photo: "../",
  },
  {
    id: 5,
    nom: "Eleve 5",
    photo: "../",
  },
  {
    id: 6,
    nom: "Eleve 6",
    photo: "../",
  },
];

export default function Classe() {
  let { id } = useParams();
  let navigate = useNavigate();
  const location = useLocation();

  const [selectedStudent, setSelectedStudent] = useState(null);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{selectedStudent?.nom}</Popover.Header>
      <Popover.Body>
        Nom: <strong>{selectedStudent?.nom}</strong> <br />
        Age: <strong>{"12"}</strong> <br />
        Classe: <strong>{"6EME 1"}</strong> <br />
        Collège: <strong>{"Soualiga"}</strong> <br />
        Participation: <CounterInput
        min={0}
        max={10}
        onCountChange={(count) => console.log(count)}
      />
        Bonus: <CounterInput
        min={0}
        max={10}
        onCountChange={(count) => console.log(count)}
      />
        Avertissement: <CounterInput
        min={0}
        max={10}
        onCountChange={(count) => console.log(count)}
      />
        <Button onClick={() => goToStudent()}>Voir stats</Button>
      </Popover.Body>
    </Popover>
  );

  const studentInTableClick = (student) => {
    console.log(student);
    setSelectedStudent(student);
    console.log(selectedStudent);
  };

  const goToStudent = () => {
    let path = `${location.pathname}/${selectedStudent.id}`;
    navigate(`${path}`, { replace: true });
  };
  return (
    <Container fluid>
      <div id="students-cells">
        <ul style={{ listStyle: "none" }}>
          {eleves.map((eleve) => {
            return (
              <OverlayTrigger
                trigger="click"
                placement="auto"
                overlay={popover}
                rootClose
              >
                <li
                  key={eleve.id}
                  style={{
                    float: "left",
                    marginBottom: "5rem",
                    marginRight: "5rem",
                  }}
                >
                  <a
                    style={{ color: "purple" }}
                    href={`#${eleve.id}`}
                    onClick={() => {
                      setSelectedStudent(eleve);
                    }}
                  >
                    <Image
                      src="https://imagizer.imageshack.com/img924/9084/H33H0z.jpg"
                      roundedCircle
                      {...(selectedStudent?.id == eleve.id && {
                        border: "2px solid purple",
                      })}
                    />
                  </a>
                  <p style={{ textAlign: "center" }}>{eleve.nom}</p>
                </li>
              </OverlayTrigger>
            );
          })}
        </ul>
      </div>
      <div id="students-table-list">
        <ListGroup>
          {eleves.map((eleve, index) => {
            return (
              <ListGroup.Item
                key={eleve.id}
                action
                active={eleve.id === selectedStudent?.id}
                href={`#/${eleve.id}`}
                onClick={() => studentInTableClick(eleve)}
              >
                {eleve.nom}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </Container>
  );
}
