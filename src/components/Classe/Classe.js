import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPath, useParams } from "react-router-dom";
import { ThreeDots, TailSpin } from "react-loader-spinner";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

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
import { ObjectID } from "bson";

// auth & redux
import { connect } from "react-redux";
import store from "../../auth/store.js";
import { colors } from "../../utils/Styles.js";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  addEleveToClasse,
  editEleveNote,
  getElevesInClasse,
} from "../../auth/actions/userActions";

let sts = [
  {
    _id: 1,
    lastname: "Eleve 1",
    firstname: "Eleve 1",
    photo: "/images/unknown.png",
    position: 1,
    participation: 2,
    bonus: 1,
    avertissement: 0,
    visible: true,
  },
  {
    _id: 2,
    lastname: "Eleve 2",
    firstname: "Eleve 2",
    photo: "/images/unknown.png",
    position: 2,
    participation: 3,
    bonus: 4,
    avertissement: 2,
    visible: true,
  },
  {
    _id: 3,
    lastname: "Eleve 3",
    firstname: "Eleve 3",
    photo: "/images/unknown.png",
    position: 3,
    participation: 0,
    bonus: 1,
    avertissement: 1,
    visible: true,
  },
  {
    _id: 4,
    lastname: "Eleve 4",
    firstname: "Eleve 4",
    photo: "/images/unknown.png",
    position: 4,
    participation: 2,
    bonus: 2,
    avertissement: 2,
    visible: true,
  },
  {
    _id: 5,
    lastname: "Eleve 5",
    firstname: "Eleve 5",
    photo: "/images/unknown.png",
    position: 5,
    participation: 0,
    bonus: 0,
    avertissement: 0,
    visible: true,
  },
  {
    _id: 6,
    lastname: "Eleve 6",
    firstname: "Eleve 6",
    photo: "/images/unknown.png",
    position: 6,
    participation: 1,
    bonus: 1,
    avertissement: 3,
    visible: true,
  },
  {
    _id: 7,
    lastname: "Eleve 7",
    firstname: "Eleve 7",
    photo: "/images/unknown.png",
    position: 7,
    participation: 1,
    bonus: 1,
    avertissement: 3,
    visible: true,
  },
  {
    _id: 8,
    lastname: "Eleve 8",
    firstname: "Eleve 8",
    photo: "/images/unknown.png",
    position: 8,
    participation: 2,
    bonus: 0,
    avertissement: 8,
    visible: true,
  },
];
const Classe = () => {
  const [user, setUser] = useState(store.getState().session.user);
  const [participationModal, setParticipationModal] = useState(false);
  const [college, setCollege] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [eleves, setEleves] = useState(null);

  const [counter, setCounter] = useState(null);

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
  let { classId } = useParams();
  let navigate = useNavigate();
  const location = useLocation();
  const [classe, setClasse] = useState(null);
  const [key, setKey] = useState("participation");
  let val = "participation";
  const [exportList, setExportList] = useState([]);

  const [switchStudent, setSwitchStudent] = useState(null);
  const [showEmptyStudents, setShowEmptyStudents] = useState(true);

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
    console.log("eleves");
    console.log(eleves);
    let firstEmptyStudentIndex = newList.findIndex((el) => el.empty == true);
    console.log("firstEmptyStudentIndex");
    console.log(firstEmptyStudentIndex);
    let updatedStudent = newList[firstEmptyStudentIndex];
    updatedStudent.empty = false;
    updatedStudent.bonus = 0;
    updatedStudent.avertissement = 0;
    updatedStudent.participation = 0;
    updatedStudent.classe = classId;
    updatedStudent.college = college;
    updatedStudent._id = new ObjectID();
    const defaultBirthday = "02/01/2010"; //february 1st
    updatedStudent.dateOfBirth = new Date(defaultBirthday);

    newList[firstEmptyStudentIndex] = updatedStudent;
    console.log("la nouvelle liste des eleves de la classe");
    console.log(newList);
    setIsFetching(true);

    addEleveToClasse(updatedStudent)
      .then((response) => {
        console.log("reponse de l'ajout");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });

    setEleves(newList);
  };

  const goToStudentStats = (eleve) => {
    console.log(location);
    let path = `../eleves/${eleve._id}/stats`;
    console.log(path);
    navigate(`${path}`);
  };

  const goToStudentEdit = (eleve) => {
    console.log(" a quoi ressemble l'eleve");
    console.log(eleve);
    console.log(eleve._id.toString());
    let path = `../eleves/${eleve._id}`;
    navigate(`${path}`);
  };

  const processSwitch = () => {
    console.log("comment sont les eleves?");
    console.log(eleves);
    setIsFetching(true);
    setShowModal(false);
    let elevesCopy = eleves;

    console.log("selectedStudent");
    console.log(selectedStudent);
    console.log("switchStudent");
    console.log(switchStudent);
    // change position of 2 students :
    const tmp = selectedStudent.position;
    const tmp2 = switchStudent.position;
    console.log("tmp1");
    console.log(tmp);
    console.log("tmp2");
    console.log(tmp2);
    let itemIndex = elevesCopy.findIndex((student) => student.position == tmp);
    let item = elevesCopy[itemIndex];
    item.position = tmp2;

    let itemIndex2 = elevesCopy.findIndex(
      (student) => student.position == tmp2
    );
    let item2 = elevesCopy[itemIndex2];
    item2.position = tmp;

    //reorder whole list :
    elevesCopy.sort(function (a, b) {
      return a.position - b.position;
    });

    const defaultBirthday = "02/01/2010"; //february 1st

    //change position of 1st student in DB
    const firstStudentData = {
      eleveId: selectedStudent._id,
      newPosition: tmp2,
      college: college,
      classe: classId,
      dateOfBirth: new Date(defaultBirthday),
    };
    editEleveNote(firstStudentData)
      .then((response) => {
        console.log("response");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    //change position of 2nd student in DB
    const secondStudentData = {
      eleveId: switchStudent._id,
      newPosition: tmp,
      college: college,
      classe: classId,
      dateOfBirth: new Date(defaultBirthday),
    };
    editEleveNote(secondStudentData)
      .then((response) => {
        console.log("response");
        console.log(response);
        console.log(item);
        console.log(item2);
        console.log(elevesCopy);
        setEleves(elevesCopy);
        setCounter(counter + 1);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });

    setIsSwitching(false);
  };

  const handleStudentClick = (eleve, note) => {
    console.log("kkkkkkkkkkkkkkkk");
    console.log(eleve);
    console.log("key");
    console.log(key);
    if (key != "echange") {
      setIsFetching(true);
    }
    if (note === "participation") {
      // setIsSwitching(true)
      console.log("on augmente");
      eleve.participation = eleve.participation + 1;
      console.log("eleve.participation");
      console.log(eleve.participation);
      console.log(eleve);

      const eleveData = {
        eleveId: eleve._id,
        newParticipation: eleve.participation,
      };
      editEleveNote(eleveData)
        .then((response) => {
          console.log("response");
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
    if (note === "bonus") {
      // setIsSwitching(true)
      console.log("on augmente");
      eleve.bonus = eleve.bonus + 1;
      const eleveData = {
        eleveId: eleve._id,
        newBonus: eleve.bonus,
      };
      editEleveNote(eleveData)
        .then((response) => {
          console.log("response");
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
    if (note === "avertissement") {
      // setIsSwitching(true)
      console.log("on augmente");
      eleve.avertissement = eleve.avertissement + 1;
      const eleveData = {
        eleveId: eleve._id,
        newAvertissement: eleve.avertissement,
      };
      editEleveNote(eleveData)
        .then((response) => {
          console.log("response");
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsFetching(false);
        });
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
    setIsFetching(true);

    if (eleve.participation > 0) eleve.participation = eleve.participation - 1;
    console.log("eleve.participation");
    console.log(eleve.participation);
    console.log(eleve);
    setCounter(counter + 1);
    setSelectedStudent(eleve);

    const eleveData = {
      eleveId: eleve._id,
      newParticipation: eleve.participation,
    };
    editEleveNote(eleveData)
      .then((response) => {
        console.log("response");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };
  const decrementBonus = (eleve) => {
    console.log("on diminue");
    console.log(eleve);
    setIsFetching(true);
    if (eleve.bonus > 0) eleve.bonus = eleve.bonus - 1;
    console.log(eleve);
    setCounter(counter + 1);
    setSelectedStudent(eleve);

    const eleveData = {
      eleveId: eleve._id,
      newBonus: eleve.bonus,
    };
    editEleveNote(eleveData)
      .then((response) => {
        console.log("response");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };
  const decrementAvertissement = (eleve) => {
    console.log("on diminue");
    console.log(eleve);
    setIsFetching(true);

    if (eleve.avertissement > 0) eleve.avertissement = eleve.avertissement - 1;
    console.log(eleve);
    setCounter(counter + 1);
    setSelectedStudent(eleve);

    const eleveData = {
      eleveId: eleve._id,
      newAvertissement: eleve.avertissement,
    };

    editEleveNote(eleveData)
      .then((response) => {
        console.log("response");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
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
    setIsFetching(true);
    getElevesInClasse(classId)
      .then((response) => {
        const students = response.data.data.students;
        console.log("les eleves");
        console.log(response.data);
        setClasse(response.data.data.classe.name);
        setEleves(response.data.data.students);
        setCollege(response.data.data.classe.ecole.name);
        setCounter(students.length);

        let studentsList = [...students];
        for (var i = 1; i <= 48 - students.length; i++) {
          studentsList.push({
            _id: new ObjectID(),
            lastname: `Eleve ${studentsList.length + 1}`,
            firstname: `Eleve ${studentsList.length + 1}`,
            classe: classId, //*the classId,
            photo: "/images/blank.png",
            position: studentsList.length + 1,
            participation: null,
            bonus: null,
            avertissement: null,
            empty: true,
          });
        }
        setEleves(studentsList);
        setExportList(students);
      })
      .catch((error) => {
        console.log("error while fetching students");
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
    console.log("eleves");
    console.log(eleves);
  }, []);

  const isEmptyPlace = (studentIndex) => {
    const studentInArray = eleves.find((el) => el._id == studentIndex);
    return studentInArray.empty;
  };

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
            Etes vous supprimer un point à {modalParticipationStudent?.lastname}
            ?
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
                      {eleves.map((eleve, index) => {
                        return (
                          <div
                            key={eleve._id}
                            style={{
                              marginBottom: "-0.5rem",
                              marginRight: "0.5rem",
                              flex: "1 0 10%",
                            }}
                          >
                            <div>
                              {!isEmptyPlace(eleve._id) && (
                                <i
                                  className="fa-solid fa-circle-minus"
                                  hidden={
                                    eleve.empty && !showEmptyStudents
                                      ? true
                                      : false
                                  }
                                  style={{
                                    marginLeft: "2rem",
                                    display: "inline-block",
                                  }}
                                  onClick={() => {
                                    decrementParticipation(eleve); //place is occupied decrease participation
                                  }}
                                ></i>
                              )}
                              {isEmptyPlace(eleve._id) && (
                                <i
                                  className="fa-solid fa-circle-minus"
                                  style={{
                                    marginLeft: "2rem",
                                    display: "inline-block",
                                    visibility: "hidden",
                                  }}
                                  // onClick={() => {
                                  // decrementParticipation(eleve); //don't do anything place is empty
                                  // }}
                                ></i>
                              )}
                            </div>
                            <a
                              style={{ color: "black", textDecoration: "none" }}
                              // href={`#${eleve._id}`}
                              //je viens d'enlever ce commentaire
                              //peut etre important, un moment que j'ai pas bossé sur le front, à voir les effets de bord...
                              onBlur={() => saveParticipation(eleve)}
                            >
                              <div>
                                <img
                                  id={eleve._id}
                                  src={eleve.photo}
                                  onClick={() => {
                                    if (!isEmptyPlace(eleve._id))
                                      handleStudentClick(
                                        eleve,
                                        "participation"
                                      );
                                  }}
                                  style={{
                                    opacity:
                                      eleve.empty == true && !showEmptyStudents
                                        ? 0
                                        : 1,
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
                                  {...(selectedStudent?._id == eleve._id && {
                                    border: "2px solid purple",
                                  })}
                                />
                              </div>

                              <p style={{ textAlign: "center" }}>
                                {!eleve.empty && (
                                  <strong>{eleve.participation} </strong>
                                )}
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
                            key={eleve._id}
                            style={{
                              marginBottom: "-0.5rem",
                              marginRight: "0.5rem",
                              flex: "1 0 10%",
                            }}
                          >
                            <div>
                              {!isEmptyPlace(eleve._id) && (
                                <i
                                  className="fa-solid fa-circle-minus"
                                  hidden={
                                    eleve.empty && !showEmptyStudents
                                      ? true
                                      : false
                                  }
                                  style={{
                                    marginLeft: "2rem",
                                    display: "inline-block",
                                  }}
                                  onClick={() => {
                                    decrementBonus(eleve); //place is occupied decrease bonus
                                  }}
                                ></i>
                              )}
                              {isEmptyPlace(eleve._id) && (
                                <i
                                  className="fa-solid fa-circle-minus"
                                  style={{
                                    marginLeft: "2rem",
                                    display: "inline-block",
                                    visibility: "hidden",
                                  }}
                                  // onClick={() => {
                                  // decrementParticipation(eleve); //don't do anything place is empty
                                  // }}
                                ></i>
                              )}
                            </div>
                            <a
                              style={{ color: "black", textDecoration: "none" }}
                              // href={`#${eleve._id}`}
                              //a remettre???
                              onBlur={() => saveBonus(eleve)}
                            >
                              <img
                                src={eleve.photo}
                                onClick={() => {
                                  if (!isEmptyPlace(eleve._id))
                                    handleStudentClick(eleve, "bonus");
                                }}
                                style={{
                                  opacity:
                                    eleve.empty == true && !showEmptyStudents
                                      ? 0
                                      : 1,
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
                                {...(selectedStudent?._id == eleve._id && {
                                  border: "2px solid purple",
                                })}
                              />
                              <p style={{ textAlign: "center" }}>
                                {!eleve.empty && (
                                  <strong>{eleve.bonus} </strong>
                                )}
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
                            key={eleve._id}
                            style={{
                              marginBottom: "-0.5rem",
                              marginRight: "0.5rem",
                              flex: "1 0 10%",
                            }}
                          >
                            <div>
                              {!isEmptyPlace(eleve._id) && (
                                <i
                                  className="fa-solid fa-circle-minus"
                                  hidden={
                                    eleve.empty && !showEmptyStudents
                                      ? true
                                      : false
                                  }
                                  style={{
                                    marginLeft: "2rem",
                                    display: "inline-block",
                                  }}
                                  onClick={() => {
                                    decrementAvertissement(eleve); //place is occupied decrease avertissement
                                  }}
                                ></i>
                              )}
                              {isEmptyPlace(eleve._id) && (
                                <i
                                  className="fa-solid fa-circle-minus"
                                  style={{
                                    marginLeft: "2rem",
                                    display: "inline-block",
                                    visibility: "hidden",
                                  }}
                                  // onClick={() => {
                                  // decrementParticipation(eleve); //don't do anything place is empty
                                  // }}
                                ></i>
                              )}
                            </div>
                            <a
                              style={{ color: "black", textDecoration: "none" }}
                              // href={`#${eleve._id}`}
                              // a remettre???
                              onBlur={() => {
                                saveAvertissement(eleve);
                              }}
                            >
                              <img
                                src={eleve.photo}
                                onClick={() => {
                                  if (!isEmptyPlace(eleve._id))
                                    handleStudentClick(eleve, "avertissement");
                                }}
                                style={{
                                  opacity:
                                    eleve.empty == true && !showEmptyStudents
                                      ? 0
                                      : 1,
                                  objectFit: "cover",
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  flex: "1 0 10%",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "block",
                                }}
                                {...(selectedStudent?._id == eleve._id && {
                                  border: "2px solid purple",
                                })}
                              />
                              <p style={{ textAlign: "center" }}>
                                {!eleve.empty && (
                                  <strong>{eleve.avertissement} </strong>
                                )}
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
                            key={eleve._id}
                            style={{
                              marginBottom: "-0.5rem",
                              marginRight: "0.5rem",
                              flex: "1 0 10%",
                            }}
                          >
                            <a
                              style={{ color: "black", textDecoration: "none" }}
                              // href={`#${eleve._id}`}
                              // a remettre???
                              onClick={() => {
                                // setIsSwitching(true);
                                // setSwitchStudent(eleve);
                                /*if (!isEmptyPlace(eleve._id))*/ handleStudentClick(
                                  eleve
                                );
                                // setShowModal(true)
                              }}
                            >
                              <img
                                src={eleve.photo}
                                style={{
                                  opacity:
                                    eleve.empty == true && !showEmptyStudents
                                      ? 0
                                      : 1,
                                  objectFit: "cover",
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  flex: "1 0 10%",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "block",
                                }}
                                {...(selectedStudent?._id == eleve._id && {
                                  border: "2px solid purple",
                                })}
                              />
                              <p style={{ textAlign: "center" }}>
                                {/* no mark for switch tab */}
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
                            key={eleve._id}
                            style={{
                              marginBottom: "-0.5rem",
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
                                  opacity:
                                    eleve.empty == true && !showEmptyStudents
                                      ? 0
                                      : 1,
                                  objectFit: "cover",
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  flex: "1 0 10%",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "block",
                                }}
                                {...(selectedStudent?._id == eleve._id && {
                                  border: "2px solid purple",
                                })}
                              />
                              <p style={{ textAlign: "center" }}>
                                {/* <strong>{eleve.participation}</strong> */}
                              </p>
                              {/* {selectedStudent?._id !== eleve._id && (
                              <p style={{ textAlign: "center" }}>
                                <strong>{eleve.participation}</strong>
                              </p>
                            )}
                            {selectedStudent?._id === eleve._id && (
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
              <div id="hide-empty-students" style={{ marginBottom: "0.5rem" }}>
                Places vides:
                <span style={{ marginLeft: "2rem" }}>
                  <BootstrapSwitchButton
                    onlabel="Oui"
                    offlabel="Non"
                    checked={true}
                    size="xs"
                    onChange={() => {
                      setShowEmptyStudents(!showEmptyStudents);
                      console.log("showEmptyStudents");
                      console.log(showEmptyStudents);
                    }}
                  />
                </span>
              </div>
              <ListGroup>
                {eleves.map((eleve, index) => {
                  if (!eleve.empty)
                    return (
                      <ListGroup.Item
                        key={eleve._id}
                        action
                        active={eleve._id === selectedStudent?._id}
                        onClick={() => studentInTableClick(eleve)}
                      >
                        {eleve.lastname}
                        <i
                          className="fa-solid fa-pen-to-square"
                          style={{ marginLeft: "2rem" }}
                          onClick={() => {
                            goToStudentEdit(eleve);
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
