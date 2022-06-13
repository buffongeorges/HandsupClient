import React, { useEffect, useState } from "react";
import { createPath, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CounterInput from "react-counter-input";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

let sts = [
  {
    id: 1,
    nom: "Eleve 1",
    photo: "/images/unknown.png",
    position: 1,
    participation: 2,
    bonus: 1,
    avertissement: 0,
  },
  {
    id: 2,
    nom: "Eleve 2",
    photo: "/images/unknown.png",
    position: 2,
    participation: 3,
    bonus: 4,
    avertissement: 2,
  },
  {
    id: 3,
    nom: "Eleve 3",
    photo: "/images/unknown.png",
    position: 3,
    participation: 0,
    bonus: 1,
    avertissement: 1,
  },
  {
    id: 4,
    nom: "Eleve 4",
    photo: "/images/unknown.png",
    position: 4,
    participation: 2,
    bonus: 2,
    avertissement: 2,
  },
  {
    id: 5,
    nom: "Eleve 5",
    photo: "/images/unknown.png",
    position: 5,
    participation: 0,
    bonus: 0,
    avertissement: 0,
  },
  {
    id: 6,
    nom: "Eleve 6",
    photo: "/images/unknown.png",

    position: 6,
    participation: 1,
    bonus: 1,
    avertissement: 3,
  },
  {
    id: 7,
    nom: "Eleve 7",
    photo: "/images/unknown.png",
    position: 7,
    participation: 1,
    bonus: 1,
    avertissement: 3,
  },
  {
    id: 8,
    nom: "Eleve 8",
    photo: "/images/unknown.png",
    position: 8,
    participation: 2,
    bonus: 0,
    avertissement: 8,
  },
];

export default function Classe() {
  let { id } = useParams();
  let navigate = useNavigate();
  const location = useLocation();
  const classe = location.pathname.split("/classes/")[1];
  const [key, setKey] = useState("participation");

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

  const studentInTableClick = (student) => {
    console.log(student);
    setSelectedStudent(student);
    console.log(selectedStudent);
  };

  const downloadClassFile = () => {
    alert("Vous pourrez bientot télécharger le fichier!");
  };

  const addNewStudent = () => {
    let newList = [...eleves];
    let firstEmptyStudentIndex = newList.findIndex(el => el.empty == true);
    let updatedStudent = newList[firstEmptyStudentIndex];
    updatedStudent.empty = false;
    updatedStudent.bonus = 0;
    updatedStudent.avertissement = 0;
    updatedStudent.participation = 0;

    newList[firstEmptyStudentIndex] = updatedStudent;
    setEleves(newList);

  };

  const goToStudentStats = (eleve) => {
    console.log(location);
    let path = `../student/${eleve.id}/stats`;
    console.log(path);
    navigate(`${path}`);
  };

  const goToStudentEdit = (id) => {
    let path = `../student/${id}/edit`;
    navigate(`${path}`, { replace: true });
  };

  const processSwitch = () => {
    console.log("échanger les index");
    setShowModal(false);
    console.log("selectedStudent");
    console.log(selectedStudent);
    console.log("switchStudent");
    console.log(switchStudent);

    //change position of 2 students :
    let tmp = selectedStudent;
    eleves.forEach((el) => {
      if (el.id == selectedStudent.id) {
        console.log(el);
        el.position = switchStudent.position;
      }
      return el;
    });

    eleves.forEach((el) => {
      if (el.id == switchStudent.id) {
        console.log(el);
        el.position = tmp.position;
      }
      return el;
    });

    //reorder whole list :
    eleves.sort(function (a, b) {
      return a.position - b.position;
    });

    console.log("eleves");
    console.log(eleves);
  };

  const handleStudentClick = (eleve) => {
    console.log("selectedStudent");
    console.log(selectedStudent);
    setSelectedStudent(eleve);

    if (isSwitching) {
      setShowModal(true);
      setSwitchStudent(eleve);
      setHidePopover(true);
    } else {
      setSelectedStudent(eleve);
      // setIsSwitching(false);
    }
  };

  const saveAvertissement = (student) => {
    setSelectedStudent(null);
  };

  const saveParticipation = (student) => {
    setSelectedStudent(null);
  };

  const saveBonus = (student) => {
    setSelectedStudent(null);
  };

  useEffect(() => {
    setEleves(sts);
  }, [counter]);

  useEffect(() => {
    let studentsList = [...sts];
    for (var i = 1; i <= 48 - sts.length; i++ ) {
      studentsList.push({
        id: studentsList.length+1,
        nom: `Eleve ${studentsList.length+1}`,
        photo: "/images/blank.png",
        position: studentsList.length+1,
        participation: null,
        bonus: null,
        avertissement: null,
        empty: true,
      });
    }
    setEleves(studentsList)
  }, [])

  return (
    <Container fluid style={{ marginTop: "1rem" }}>
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
              setIsSwitching(false);
              setHidePopover(false);
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
      <Row>
        <Col xs="9" md='9' lg="9">
          <div style={{ marginTop: "0.5rem" }}>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              style={{
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "stretch",
                margin: 0,
                padding: 0,
              }}
            >
              <Tab
                eventKey="participation"
                title="Participation"
                style={{ flex: 1, textAlign: "center" }}
              >
                <div id="students-cells-participation">
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {eleves.map((eleve) => {
                      return (
                        <div
                          key={eleve.id}
                          style={{
                            marginBottom: "0.5rem",
                            marginRight: "0.5rem",
                            flex: "1 0 10%",
                          }}
                        >
                          <a
                            style={{ color: "black", textDecoration: "none" }}
                            href={`#${eleve.id}`}
                            onClick={() => {
                              handleStudentClick(eleve);
                            }}
                            onBlur={() => saveParticipation(eleve)}
                          >
                            <img
                              src={eleve.photo}
                              style={{
                                objectFit: "cover",
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                flex: "1 0 10%",
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                display: 'block'
                              }}
                              {...(selectedStudent?.id == eleve.id && {
                                border: "2px solid purple",
                              })}
                            />
                            {selectedStudent?.id !== eleve.id && (
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.participation}</strong>
                              </p>
                            )}
                            {selectedStudent?.id === eleve.id && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <CounterInput
                                  count={eleve.participation}
                                  min={0}
                                  max={10}
                                  onCountChange={(count) => {
                                    console.log(count);
                                    eleve.participation = count;
                                  }}
                                />
                              </div>
                            )}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="bonus" title="Bonus">
                <div id="students-cells-bonus">
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {eleves.map((eleve) => {
                      return (
                        <div
                          key={eleve.id}
                          style={{
                            marginBottom: "0.5rem",
                            marginRight: "0.5rem",
                            flex: "1 0 10%",
                          }}
                        >
                          <a
                            style={{ color: "black", textDecoration: "none" }}
                            href={`#${eleve.id}`}
                            onClick={() => {
                              handleStudentClick(eleve);
                            }}
                            onBlur={() => saveBonus(eleve)}
                          >
                            <img
                              src={eleve.photo}
                              style={{
                                objectFit: "cover",
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                flex: "1 0 10%",
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                display: 'block'
                              }}
                              {...(selectedStudent?.id == eleve.id && {
                                border: "2px solid purple",
                              })}
                            />
                            {selectedStudent?.id !== eleve.id && (
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.bonus}</strong>
                              </p>
                            )}
                            {selectedStudent?.id === eleve.id && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <CounterInput
                                  count={eleve.bonus}
                                  min={0}
                                  max={10}
                                  onCountChange={(count) => {
                                    console.log(count);
                                    eleve.bonus = count;
                                  }}
                                />
                              </div>
                            )}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="avertissement" title="Avertissement">
                <div id="students-cells-avertissement">
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {eleves.map((eleve) => {
                      return (
                        <div
                          key={eleve.id}
                          style={{
                            marginBottom: "0.5rem",
                            marginRight: "0.5rem",
                            flex: "1 0 10%",
                          }}
                        >
                          <a
                            style={{ color: "black", textDecoration: "none" }}
                            href={`#${eleve.id}`}
                            onClick={() => {
                              handleStudentClick(eleve);
                            }}
                            onBlur={() => {
                              saveAvertissement(eleve);
                            }}
                          >
                            <img
                              src={eleve.photo}
                              style={{
                                objectFit: "cover",
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                flex: "1 0 10%",
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                display: 'block'
                              }}
                              {...(selectedStudent?.id == eleve.id && {
                                border: "2px solid purple",
                              })}
                            />
                            {selectedStudent?.id !== eleve.id && (
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.avertissement}</strong>
                              </p>
                            )}
                            {selectedStudent?.id === eleve.id && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <CounterInput
                                  count={eleve.avertissement}
                                  min={0}
                                  max={10}
                                  onCountChange={(count) => {
                                    console.log(count);
                                    eleve.avertissement = count;
                                  }}
                                />
                              </div>
                            )}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey="stats"
                title="Stats"
                style={{ flex: 1, textAlign: "center" }}
              >
                <div id="students-cells-stats">
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {eleves.map((eleve) => {
                      return (
                        <div
                          key={eleve.id}
                          style={{
                            marginBottom: "0.5rem",
                            marginRight: "0.5rem",
                            flex: "1 0 10%",
                          }}
                        >
                          <a
                            style={{ color: "black", textDecoration: "none" }}
                            onClick={() => {
                              goToStudentStats(eleve);
                            }}
                          >
                            <img
                              src={eleve.photo}
                              style={{
                                objectFit: "cover",
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                flex: "1 0 10%",
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                display: 'block'
                              }}
                              {...(selectedStudent?.id == eleve.id && {
                                border: "2px solid purple",
                              })}
                            />
                            {selectedStudent?.id !== eleve.id && (
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.participation}</strong>
                              </p>
                            )}
                            {selectedStudent?.id === eleve.id && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              ></div>
                            )}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Col>
        <Col xs='3' md='3' lg='3'>
          <div
            id="students-table-list"
            style={{}}
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
                if (!eleve.empty)
                return (
                  <ListGroup.Item
                    key={eleve.id}
                    action
                    active={eleve.id === selectedStudent?.id}
                    onClick={() => studentInTableClick(eleve)}
                  >
                    {eleve.nom}
                    <i
                      className="fa-solid fa-pen-to-square"
                      style={{ marginLeft: "2rem" }}
                      onClick={() => {
                        goToStudentEdit(eleve.id);
                      }}
                    ></i>
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
                <i className="fa fa-circle-plus fa-xl"></i>
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
