import React, { useEffect, useState } from "react";
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

let sts = [
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
  const [eleves, setEleves] = useState(sts);
  const [counter, setCounter] = useState(eleves.length + 1);

  const popover = (
    <Popover id="popover-students">
      <Popover.Header as="h3">
        {selectedStudent?.nom}
        <a
          href="#"
          style={{ color: "black" }}
          onClick={() => goToStudentEdit()}
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </a>
      </Popover.Header>
      <Popover.Body>
        Nom: <strong>{selectedStudent?.nom}</strong> <br />
        Age: <strong>{"12"}</strong> <br />
        Classe: <strong>{"6EME 1"}</strong> <br />
        Collège: <strong>{"Soualiga"}</strong> <br />
        Participation:{" "}
        <CounterInput
          min={0}
          max={10}
          onCountChange={(count) => console.log(count)}
        />
        Bonus:{" "}
        <CounterInput
          min={0}
          max={10}
          count={2}
          onCountChange={(count) => console.log(count)}
        />
        Avertissement:{" "}
        <CounterInput
          min={0}
          max={10}
          count={4}
          onCountChange={(count) => console.log(count)}
        />
        <Button onClick={() => goToStudentStats()}>Voir stats</Button>
      </Popover.Body>
    </Popover>
  );

  const studentInTableClick = (student) => {
    console.log(student);
    setSelectedStudent(student);
    console.log(selectedStudent);
  };

  const addNewStudent = () => {
    console.log('nouveau');
    eleves.push({
      id: counter + 1,
      nom: `Eleve ${counter}`,
      photo: "../",
    });
    setCounter(counter + 1);
  }

  const goToStudentStats = () => {
    console.log(location);
    let path = `../student/${selectedStudent.id}/stats`;
    navigate(`${path}`);
  };

  const goToStudentEdit = () => {
    let path = `../student/${selectedStudent.id}/edit`;
    navigate(`${path}`, { replace: true });
  };

  useEffect(() => {
    setEleves(sts)
  }, [counter])
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
      <div
        id="students-table-list"
        style={{ position: "fixed", right: "2rem" }}
      >
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
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
          
          <button class="btn" onClick={() => {addNewStudent()}}>
            <i class="fa fa-circle-plus fa-xl"></i></button>

        </div>
      </div>
    </Container>
  );
}
