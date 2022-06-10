import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
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
  const classe = location.pathname.split("/classes/")[1];

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [switchStudent, setSwitchStudent] = useState(null);
  const [eleves, setEleves] = useState(sts);
  const [counter, setCounter] = useState(eleves.length + 1);
  const [isSwitching, setIsSwitching] = useState(false);
  const [hidePopover, setHidePopover] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const switchStudents = () => {
    console.log("selectedStudent");
    console.log(selectedStudent);
    alert("Sélectionnez le 2ème élève");
    setIsSwitching(true);

    setHidePopover(true);
  };

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
        <Button variant="info" onClick={() => switchStudents()}>
          Echanger
        </Button>
      </Popover.Body>
    </Popover>
  );

  const studentInTableClick = (student) => {
    console.log(student);
    setSelectedStudent(student);
    console.log(selectedStudent);
  };

  const downloadClassFile = () => {
    alert("Vous pourrez bientot télécharger le fichier!");
  };

  const addNewStudent = () => {
    console.log("nouveau");
    eleves.push({
      id: counter + 1,
      nom: `Eleve ${counter}`,
      photo: "../",
    });
    setCounter(counter + 1);
  };

  const goToStudentStats = () => {
    console.log(location);
    let path = `../student/${selectedStudent.id}/stats`;
    navigate(`${path}`);
  };

  const goToStudentEdit = () => {
    let path = `../student/${selectedStudent.id}/edit`;
    navigate(`${path}`, { replace: true });
  };

  const processSwitch = () => {
    console.log("échanger les index");
    setShowModal(false);
    console.log("selectedStudent");
    console.log(selectedStudent);
    console.log("switchStudent");
    console.log(switchStudent);
  };

  const handleStudentClick = (eleve) => {
    if (isSwitching) {
      setShowModal(true);
      setSwitchStudent(eleve);

    } else {
      setSelectedStudent(eleve);
    }
    setIsSwitching(false);
    setHidePopover(false);
  };

  useEffect(() => {
    setEleves(sts);
  }, [counter]);

  return (
    <Container fluid>
      <Modal show={showModal}>
        <Modal.Header closeButton>
          <Modal.Title>Echange de places</Modal.Title>
        </Modal.Header>
        <Modal.Body>Etes vous sur de vouloir faire l'échange ?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              processSwitch();
            }}
          >
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
      <div id="students-cells">
        <ul style={{ listStyle: "none" }}>
          {eleves.map((eleve) => {
            return (
              <OverlayTrigger
                trigger="click"
                placement="auto"
                overlay={popover}
                {...(hidePopover === true && { show: false })}
              >
                <li
                  key={eleve.id}
                  style={{
                    float: "left",
                    marginBottom: "2rem",
                    marginRight: "5rem",
                  }}
                >
                  <a
                    style={{ color: "purple" }}
                    href={`#${eleve.id}`}
                    onClick={() => {
                      handleStudentClick(eleve);
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
        <div style={{ marginBottom: "1rem" }}>
          Classe: {classe}
          <a
            href="#"
            style={{ color: "black" }}
            onClick={() => downloadClassFile()}
          >
            <i className="fa-solid fa-download"></i>
          </a>
        </div>
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <button
            class="btn"
            onClick={() => {
              addNewStudent();
            }}
          >
            <i class="fa fa-circle-plus fa-xl"></i>
          </button>
        </div>
      </div>
    </Container>
  );
}
