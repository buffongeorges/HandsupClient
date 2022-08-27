import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPath, useParams } from "react-router-dom";
import { ThreeDots, TailSpin } from "react-loader-spinner";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CsvDownloader from "react-csv-downloader";

// auth & redux
import { connect } from "react-redux";
import store from "../../auth/store.js";
import { colors } from "../../utils/Styles.js";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { addEleveToClasse } from "../../auth/actions/userActions";

var ObjectID = require('bson').ObjectID;

let sts = [
  {
    id: 1,
    lastname: "Eleve 1",
    firstname: "Eleve 1",
    photo: "/images/unknown.png",
    position: 1,
    participation: 2,
    bonus: 1,
    avertissement: 0,
  },
  {
    id: 2,
    lastname: "Eleve 2",
    firstname: "Eleve 2",
    photo: "/images/unknown.png",
    position: 2,
    participation: 3,
    bonus: 4,
    avertissement: 2,
  },
  {
    id: 3,
    lastname: "Eleve 3",
    firstname: "Eleve 3",
    photo: "/images/unknown.png",
    position: 3,
    participation: 0,
    bonus: 1,
    avertissement: 1,
  },
  {
    id: 4,
    lastname: "Eleve 4",
    firstname: "Eleve 4",
    photo: "/images/unknown.png",
    position: 4,
    participation: 2,
    bonus: 2,
    avertissement: 2,
  },
  {
    id: 5,
    lastname: "Eleve 5",
    firstname: "Eleve 5",
    photo: "/images/unknown.png",
    position: 5,
    participation: 0,
    bonus: 0,
    avertissement: 0,
  },
  {
    id: 6,
    lastname: "Eleve 6",
    firstname: "Eleve 6",
    photo: "/images/unknown.png",

    position: 6,
    participation: 1,
    bonus: 1,
    avertissement: 3,
  },
  {
    id: 7,
    lastname: "Eleve 7",
    firstname: "Eleve 7",
    photo: "/images/unknown.png",
    position: 7,
    participation: 1,
    bonus: 1,
    avertissement: 3,
  },
  {
    id: 8,
    lastname: "Eleve 8",
    firstname: "Eleve 8",
    photo: "/images/unknown.png",
    position: 8,
    participation: 2,
    bonus: 0,
    avertissement: 8,
  },
];
const Classe = () => {
  const [participationModal, setParticipationModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [eleves, setEleves] = useState(sts);

  const [counter, setCounter] = useState(eleves.length + 1);

  const [modalParticipationStudent, setModalParticipationStudent] =
    useState(null);

  const handleModalParticipation = useCallback((newValue) => {
    setSelectedStudent(newValue);
    setModalParticipationStudent(newValue);
  });

  const handleParticipationModalVisibilty = useCallback((newValue) => {
    setParticipationModal(newValue);
  });

  // const {action, handlers} = useLongPress({handleModal: handleParticipationModalVisibilty}, {handleModalParticipation: handleModalParticipation});
  let { id } = useParams();
  let navigate = useNavigate();
  const location = useLocation();
  const classe = location.pathname.split("/classes/")[1];
  const [key, setKey] = useState("participation");
  let val = "participation";
  const [exportList, setExportList] = useState([]);

  const [switchStudent, setSwitchStudent] = useState(null);

  const [isSwitching, setIsSwitching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const switchStudents = (el) => {
    console.log(el);
    alert("Sélectionnez le 2ème élève");
    setIsSwitching(true);
    setCounter(counter + 1);
    setSwitchStudent(el);
    console.log(switchStudent);
  };

  const studentInTableClick = (student) => {
    setSelectedStudent(student);
  };

  const downloadClassFile = () => {
    // alert("Vous pourrez bientot télécharger le fichier!");
    //  let liste = eleves.filter(el => el.empty != true)
    //   console.log(liste)
    //   console.log(counter == eleves.length + 2)
    //   setExportList(liste);
  };

  const addNewStudent = () => {
    let newList = [...eleves];
    let firstEmptyStudentIndex = newList.findIndex((el) => el.empty == true);
    let updatedStudent = newList[firstEmptyStudentIndex];
    updatedStudent.empty = false;
    updatedStudent.bonus = 0;
    updatedStudent.avertissement = 0;
    updatedStudent.participation = 0;
    updatedStudent.classe = JSON.parse(sessionStorage.selectedClasse);
    updatedStudent._id = new ObjectID();

    newList[firstEmptyStudentIndex] = updatedStudent;
    console.log("la nouvelle liste des eleves de la classe")
    console.log(newList);
    setIsFetching(true);

    addEleveToClasse(updatedStudent).then((response) => {
      console.log("reponse de l'ajout");
      console.log(response);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setIsFetching(false);
    });

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
    setShowModal(false);

    console.log("selectedStudent");
    console.log(selectedStudent);
    console.log("switchStudent");
    console.log(switchStudent);
    // change position of 2 students :
    const tmp = selectedStudent.position;
    const tmp2 = switchStudent.position;
    let itemIndex = eleves.findIndex((x) => x.id == tmp);
    let item = eleves[itemIndex];
    item.position = tmp2;

    let itemIndex2 = eleves.findIndex((x) => x.id == tmp2);
    let item2 = eleves[itemIndex2];
    item2.position = tmp;

    //reorder whole list :
    eleves.sort(function (a, b) {
      return a.position - b.position;
    });

    setIsSwitching(false);
  };

  const handleStudentClick = (eleve, note) => {
    if (note === "participation") {
      // setIsSwitching(true)
      console.log("on augmente");
      eleve.participation = eleve.participation + 1;
    }
    if (note === "bonus") {
      // setIsSwitching(true)
      console.log("on augmente");
      eleve.bonus = eleve.bonus + 1;
    }
    if (note === "avertissement") {
      // setIsSwitching(true)
      console.log("on augmente");
      eleve.avertissement = eleve.avertissement + 1;
    }
    if (isSwitching && key === "echange") {
      setShowModal(true);
      setSelectedStudent(eleve);
    } else {
      if (key === "echange") {
        switchStudents(eleve);
      }
    }

    setSelectedStudent(eleve);
    setCounter(counter + 1);
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

  const decrementParticipation = (eleve) => {
    console.log("on diminue");
    console.log(eleve);
    if (eleve.participation > 0) eleve.participation = eleve.participation - 1;
    console.log(eleve);
    setCounter(counter + 1);
    setSelectedStudent(eleve);
  };
  const decrementBonus = (eleve) => {
    console.log("on diminue");
    console.log(eleve);
    if (eleve.bonus > 0) eleve.bonus = eleve.bonus - 1;
    console.log(eleve);
    setCounter(counter + 1);
    setSelectedStudent(eleve);
  };
  const decrementAvertissement = (eleve) => {
    console.log("on diminue");
    console.log(eleve);
    if (eleve.avertissement > 0) eleve.avertissement = eleve.avertissement - 1;
    console.log(eleve);
    setCounter(counter + 1);
    setSelectedStudent(eleve);
  };

  const handleKey = (key) => {
    setKey(key);
    val = key;
    console.log(key);
  };

  const columns = [
    {
      id: "lastname",
      displayName: "lastname",
    },
    {
      id: "firstname",
      displayName: "Prélastname",
    },
    {
      id: "college",
      displayName: "Collège",
    },
    {
      id: "participation",
      displayName: "Participations",
    },
    {
      id: "bonus",
      displayName: "Bonus",
    },
    {
      id: "avertissement",
      displayName: "Avertissement",
    },
    {
      id: "note",
      displayName: "Note",
    },
    {
      id: "placement",
      displayName: "Placement",
    },
  ];

  const datas = exportList.map((el) => {
    return {
      lastname: el.lastname,
      firstname: el.firstname,
      participation: el.participation,
      bonus: el.bonus,
      avertissement: el.avertissement,
      note: 10,
      placement: el.position,
    };
  });

  useEffect(() => {
    setEleves(eleves);
  }, [counter]);

  useEffect(() => {
    console.log("sessionStorage.selectedClasse")
    console.log(sessionStorage.selectedClasse)
    let studentsList = [...sts];
    for (var i = 1; i <= 48 - sts.length; i++) {
      studentsList.push({
        id: studentsList.length + 1,
        lastname: `Eleve ${studentsList.length + 1}`,
        firstname: `Eleve ${studentsList.length + 1}`,
        classe: JSON.parse(sessionStorage.selectedClasse),
        photo: "/images/blank.png",
        position: studentsList.length + 1,
        participation: null,
        bonus: null,
        avertissement: null,
        empty: true,
      });
    }
    setEleves(studentsList);
    setExportList(sts);
    setIsFetching(false);
  }, []);

  if (isFetching) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TailSpin width="20rem" height="20rem" color={colors.theme} />
      </div>
    );
  } else if (!isFetching) {
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
        <Modal show={participationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Suppression participation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Etes vous supprimer un point à {modalParticipationStudent?.lastname}?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setParticipationModal(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setParticipationModal(false);
                decrementParticipation();
              }}
            >
              Confirmer
            </Button>
          </Modal.Footer>
        </Modal>
        <Row>
          <Col xs="9" md="9" lg="9">
            <div style={{ marginTop: "0.5rem" }}>
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => {
                  handleKey(k);
                }}
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
                            <div>
                              <i
                                className="fa-solid fa-circle-minus"
                                style={{
                                  marginLeft: "2rem",
                                  display: "inline-block",
                                }}
                                onClick={() => {
                                  decrementParticipation(eleve);
                                }}
                              ></i>
                            </div>
                            <a
                              style={{ color: "black", textDecoration: "none" }}
                              // href={`#${eleve.id}`} 
                              //je viens d'enlever ce commentaire 
                              //peut etre important, un moment que j'ai pas bossé sur le front, à voir les effets de bord...
                              onBlur={() => saveParticipation(eleve)}
                            >
                              <div>
                                <img
                                  id={eleve.id}
                                  src={eleve.photo}
                                  onClick={() => {
                                    handleStudentClick(eleve, "participation");
                                  }}
                                  style={{
                                    objectFit: "cover",
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    flex: "1 0 10%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                  }}
                                  {...(selectedStudent?.id == eleve.id && {
                                    border: "2px solid purple",
                                  })}
                                />
                              </div>

                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.participation}</strong>
                              </p>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="bonus"
                  title="Bonus"
                  style={{ flex: 1, textAlign: "center" }}
                >
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
                            <div>
                              <i
                                className="fa-solid fa-circle-minus"
                                style={{
                                  marginLeft: "2rem",
                                  display: "inline-block",
                                }}
                                onClick={() => {
                                  decrementBonus(eleve);
                                }}
                              ></i>
                            </div>
                            <a
                              style={{ color: "black", textDecoration: "none" }}
                              // href={`#${eleve.id}`} 
                              //a remettre???
                              onBlur={() => saveBonus(eleve)}
                            >
                              <img
                                src={eleve.photo}
                                onClick={() => {
                                  handleStudentClick(eleve, "bonus");
                                }}
                                style={{
                                  objectFit: "cover",
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  flex: "1 0 10%",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "inline-block",
                                  verticalAlign: "middle",
                                }}
                                {...(selectedStudent?.id == eleve.id && {
                                  border: "2px solid purple",
                                })}
                              />
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.bonus}</strong>
                              </p>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="avertissement"
                  title="Avertissement"
                  style={{ flex: 1, textAlign: "center" }}
                >
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
                            <div>
                              <i
                                className="fa-solid fa-circle-minus"
                                style={{
                                  marginLeft: "2rem",
                                  display: "inline-block",
                                }}
                                onClick={() => {
                                  decrementAvertissement(eleve);
                                }}
                              ></i>
                            </div>
                            <a
                              style={{ color: "black", textDecoration: "none" }}
                              // href={`#${eleve.id}`} 
                              // a remettre???
                              onBlur={() => {
                                saveAvertissement(eleve);
                              }}
                            >
                              <img
                                src={eleve.photo}
                                onClick={() => {
                                  handleStudentClick(eleve, "avertissement");
                                }}
                                style={{
                                  objectFit: "cover",
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  flex: "1 0 10%",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "block",
                                }}
                                {...(selectedStudent?.id == eleve.id && {
                                  border: "2px solid purple",
                                })}
                              />
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.avertissement}</strong>
                              </p>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="echange"
                  title="Echanger"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <div id="students-cells-exchange">
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
                              // href={`#${eleve.id}`} 
                              // a remettre??? 
                              onClick={() => {
                                // setIsSwitching(true);
                                // setSwitchStudent(eleve);
                                handleStudentClick(eleve);
                                // setShowModal(true)
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
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "block",
                                }}
                                {...(selectedStudent?.id == eleve.id && {
                                  border: "2px solid purple",
                                })}
                              />
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.participation}</strong>
                              </p>
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
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "block",
                                }}
                                {...(selectedStudent?.id == eleve.id && {
                                  border: "2px solid purple",
                                })}
                              />
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.participation}</strong>
                              </p>
                              {/* {selectedStudent?.id !== eleve.id && (
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
                            )} */}
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
          <Col xs="3" md="3" lg="3">
            <div id="students-table-list" style={{}}>
              <div style={{ marginBottom: "1rem" }}>
                Classe: {classe}
                {/* <div> */}
                <CsvDownloader
                  filename={`classe_${classe}`}
                  extension=".csv"
                  separator=";"
                  wrapColumnChar="'"
                  columns={columns}
                  datas={datas}
                  style={{ float: "right", width: "4rem" }}
                >
                  <a
                    href="#"
                    style={{ color: "black" }}
                    onClick={() => downloadClassFile()}
                  >
                    <i className="fa-solid fa-download"></i>
                  </a>
                </CsvDownloader>
                {/* </div> */}
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
                        {eleve.lastname}
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
                  className="btn"
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
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(Classe);
