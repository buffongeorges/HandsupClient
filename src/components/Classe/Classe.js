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
    position: 1,
    participation: 2,
    bonus: 1,
    avertissement: 0,
  },
  {
    id: 2,
    nom: "Eleve 2",
    photo: "../",
    position: 2,
    participation: 3,
    bonus: 4,
    avertissement: 2,
  },
  {
    id: 3,
    nom: "Eleve 3",
    photo: "../",
    position: 3,
    participation: 0,
    bonus: 1,
    avertissement: 1,
  },
  {
    id: 4,
    nom: "Eleve 4",
    photo: "../",
    position: 4,
    participation: 2,
    bonus: 2,
    avertissement: 2,
  },
  {
    id: 5,
    nom: "Eleve 5",
    photo: "../",
    position: 5,
    participation: 0,
    bonus: 0,
    avertissement: 0,
  },
  {
    id: 6,
    nom: "Eleve 6",
    photo: "../",
    position: 6,
    participation: 1,
    bonus: 1,
    avertissement: 3,
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
    console.log("nouveau");
    eleves.push({
      id: counter,
      nom: `Eleve ${counter}`,
      photo: "../",
      position: counter,
      participation: 0,
      bonus: 0,
      avertissement: 0,
    });
    setCounter(counter + 1);
  };

  const goToStudentStats = (eleve) => {
    console.log(location);
    let path = `../student/${eleve.id}/stats`;
    console.log(path)
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
  }

  const saveParticipation = (student) => {
    setSelectedStudent(null);
  }

  const saveBonus = (student) => {
    setSelectedStudent(null);
  }

  useEffect(() => {
    setEleves(sts);
  }, [counter]);

  return (
    <Container fluid style={{marginTop: '1rem'}}>
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
        <Col lg='11'>  <div style={{ marginTop: "0.5rem" }}>
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
              {/* <ul style={{ listStyle: "none", display: 'flex', flexWrap: 'wrap' }}> */}
              <div style={{display: 'flex', flexWrap: 'wrap'}}>

                {eleves.map((eleve) => {
                  return (
                    <div
                      key={eleve.id}
                      style={{
                        // float: "left",
                        marginBottom: "2rem",
                        marginRight: "5rem",
                        
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
                        src={'/images/unknown.png'}
                          // src="https://imagizer.imageshack.com/img924/9084/H33H0z.jpg"
                          
                          // style={{flex: '1 0 16%', borderRadius: '50%', display: 'block', width: 'auto', height: 'auto', maxWidth: '150px', maxHeight: '150px'}}
                          style={{objectFit: 'cover',
                            width: '100%',
                            height: '200px',
                            borderRadius: '50%',
                            flex: '1 0 21%'
                          }}
                          {...(selectedStudent?.id == eleve.id && {
                            border: "2px solid purple",
                          })}
                        />
                        {selectedStudent?.id !== eleve.id &&
                        (<p style={{ textAlign: "center" }}>
                          <strong>{eleve.participation}</strong>
                        </p>)}
                        {selectedStudent?.id === eleve.id && (<div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <CounterInput
                            count={eleve.participation}
                            min={0}
                            max={10}
                            onCountChange={(count) => {console.log(count); eleve.participation=count}}
                          />
                        </div>)}
                      </a>
                    </div>
                  );
                })}
                </div>
              {/* </ul> */}
            </div>
          </Tab>
          <Tab eventKey="bonus" title="Bonus">
            <div id="students-cells-bonus">
              <ul style={{ listStyle: "none" }}>
                {eleves.map((eleve) => {
                  return (
                    <li
                      key={eleve.id}
                      style={{
                        float: "left",
                        marginBottom: "2rem",
                        marginRight: "5rem",
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
                        <Image
                          src="https://imagizer.imageshack.com/img924/9084/H33H0z.jpg"
                          roundedCircle
                          {...(selectedStudent?.id == eleve.id && {
                            border: "2px solid purple",
                          })}
                        />
                        {selectedStudent?.id !== eleve.id &&
                        (<p style={{ textAlign: "center" }}>
                          <strong>{eleve.bonus}</strong>
                        </p>)}
                        {selectedStudent?.id === eleve.id && (<div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <CounterInput
                            count={eleve.bonus}
                            min={0}
                            max={10}
                            onCountChange={(count) => {console.log(count); eleve.bonus=count}}
                          />
                        </div>)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Tab>
          <Tab eventKey="avertissement" title="Avertissement">
            <div id="students-cells-avertissement">
              <ul style={{ listStyle: "none" }}>
                {eleves.map((eleve) => {
                  return (
                    <li
                      key={eleve.id}
                      style={{
                        float: "left",
                        marginBottom: "2rem",
                        marginRight: "5rem",
                      }}
                    >
                      <a
                        style={{ color: "black", textDecoration: "none" }}
                        href={`#${eleve.id}`}
                        onClick={() => {
                          handleStudentClick(eleve);
                        }}
                        onBlur={() => {saveAvertissement(eleve)}}
                      >
                        <Image
                          src="https://imagizer.imageshack.com/img924/9084/H33H0z.jpg"
                          roundedCircle
                          {...(selectedStudent?.id == eleve.id && {
                            border: "2px solid purple",
                          })}
                        />
                        {selectedStudent?.id !== eleve.id &&
                        (<p style={{ textAlign: "center" }}>
                          <strong>{eleve.avertissement}</strong>
                        </p>)}
                        {selectedStudent?.id === eleve.id && (<div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <CounterInput
                            count={eleve.avertissement}
                            min={0}
                            max={10}
                            onCountChange={(count) => {console.log(count); eleve.avertissement=count}}
                          />
                        </div>)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Tab>
          <Tab
            eventKey="stats"
            title="Stats"
            style={{ flex: 1, textAlign: "center" }}
          >
            <div id="students-cells-stats">
              <ul style={{ listStyle: "none" }}>
                {eleves.map((eleve) => {
                  return (
                    <li
                      key={eleve.id}
                      style={{
                        float: "left",
                        marginBottom: "2rem",
                        marginRight: "5rem",
                      }}
                    >
                      <a
                        style={{ color: "black", textDecoration: "none" }}
                        // href={`#${eleve.id}`}
                        onClick={() => {
                          goToStudentStats(eleve);
                        }}
                      >
                        <Image
                          src="https://imagizer.imageshack.com/img924/9084/H33H0z.jpg"
                          roundedCircle
                          {...(selectedStudent?.id == eleve.id && {
                            border: "2px solid purple",
                          })}
                        />
                        {selectedStudent?.id !== eleve.id &&
                        (<p style={{ textAlign: "center" }}>
                          <strong>{eleve.participation}</strong>
                        </p>)}
                        {selectedStudent?.id === eleve.id && (<div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                        </div>)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Tab>
        </Tabs>
      </div> </Col>
        <Col> <div
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
                // href={`#/${eleve.id}`}
                onClick={() => studentInTableClick(eleve)}
              >
                {eleve.nom}
                <i className="fa-solid fa-pen-to-square" style={{marginLeft:'2rem'}} onClick={() => {goToStudentEdit(eleve.id)}}></i>

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
      </div></Col>

      </Row>
     

      
    </Container>
  );
}
