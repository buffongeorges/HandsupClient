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
  endClassSequence,
  getElevesInClasse,
  increaseClassSeanceIndex,
} from "../../auth/actions/userActions";
import { sessionService } from "redux-react-session";

const Classe = () => {
  const [user, setUser] = useState(store.getState().session.user);
  const [participationModal, setParticipationModal] = useState(false);
  const [college, setCollege] = useState(null);
  const [discipline, setDiscipline] = useState(null);
  const [currentSeance, setCurrentSeance] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [eleves, setEleves] = useState(null);
  const [elevesOrdreAlphabetique, setElevesOrdreAlphabetique] = useState(null);
  const [elevesForCsvFile, setElevesForCsvFile] = useState(null);
  const [isNewSeance, setIsNewSeance] = useState(null);

  const [counter, setCounter] = useState(null);
  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const [modalParticipationStudent, setModalParticipationStudent] =
    useState(null);

  // const {action, handlers} = useLongPress({handleModal: handleParticipationModalVisibilty}, {handleModalParticipation: handleModalParticipation});
  let { classId } = useParams();
  let navigate = useNavigate();
  let val; //DON'T REMOVE THIS VARIABLE
  const location = useLocation();
  const [classe, setClasse] = useState(null);
  const [key, setKey] = useState("participation");
  const [exportList, setExportList] = useState([]);

  const [switchStudent, setSwitchStudent] = useState(null);
  const [showEmptyStudents, setShowEmptyStudents] = useState(true);
  const [showEmptyStudentsSwitch, setShowEmptyStudentsSwitch] = useState(true);

  const [isSwitching, setIsSwitching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalNewSeance, setShowModalNewSeance] = useState(false);
  const [showModalEndSequence, setShowModalEndSequence] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  //teacher settings
  const [teacherNoteDepart, setTeacherNoteDepart] = useState(null);
  const [teacherBonusDelta, setTeacherBonusDelta] = useState(null);
  const [teacherAvertissementDelta, setTeacherAvertissementDelta] =
    useState(null);
  const [teacherParticipationDelta, setTeacherParticipationDelta] =
    useState(null);

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

    // //reorder whole list :
    // elevesCopy.sort(function (a, b) {
    //   return a.position - b.position;
    // });

    const defaultBirthday = "02/01/2010"; //february 1st
    const localeTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    //change position of 1st student in DB
    const firstStudentData = {
      eleveId: switchStudent._id,
      newPosition: tmp,
      firstname: switchStudent.firstname,
      lastname: switchStudent.lastname,
      college: college,
      classe: classId,
      dateOfBirth: new Date(defaultBirthday),
      discipline: discipline,
      markUpdateTime: new Date(localeTime),
      nbSeances: currentSeance,
      isNewSeance: isNewSeance,
    };
    editEleveNote(firstStudentData)
      .then((response) => {
        console.log("response");
        console.log(response);

        //now let's get the updated student list
        sessionService.loadUser().then((user) => {
          console.log("my user");
          console.log(user);
          console.log("la discipline....");
          console.log(user.discipline.name);
          // console.log(user.college.name);
          let userCollege;
          if (Array.isArray(user.college)) {
            userCollege = user.college[0].name;
          } else {
            userCollege = user.college;
          }
          let data = {
            classId,
            college: userCollege,
            discipline: user.discipline.name,
            currentDate: new Date(localeTime),
          };
          getElevesInClasse(data)
            .then((response) => {
              const students = response.data.data.students;
              console.log("les eleves");
              console.log(response.data.data.students);
              setClasse(response.data.data.classe.name);
              setEleves(response.data.data.students);
              setElevesOrdreAlphabetique(
                response.data.data.studentsAlphabeticalOrder
              );

              setCollege(response.data.data.classe.ecole.name);
              setCounter(students.length);
              setEleves(students);
              setExportList(students);
            })
            .catch((error) => {
              console.log("error while fetching students");
              console.log(error);
            })
            .finally(() => {
              setIsFetching(false);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });

    //change position of 2nd student in DB
    const secondStudentData = {
      eleveId: selectedStudent._id,
      newPosition: tmp2,
      college: college,
      firstname: selectedStudent.firstname,
      lastname: selectedStudent.lastname,
      classe: classId,
      dateOfBirth: new Date(defaultBirthday),
      discipline: discipline,
      markUpdateTime: new Date(localeTime),
      nbSeances: currentSeance,
      isNewSeance: isNewSeance,
    };
    editEleveNote(secondStudentData)
      .then((response) => {
        console.log("response");
        console.log(response);
        console.log(item);
        console.log(item2);
        console.log(elevesCopy);
        // setEleves(elevesCopy);
        // setCounter(counter + 1);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });

    setIsSwitching(false);
  };

  const updateSeanceAndStudentsData = (eleveData, markType, markValue) => {
    const localeTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    sessionService.loadUser().then((user) => {
      setIsFetching(true);
      let increaseSeanceData = {
        classe: classe,
        college: college,
        nbSeances: currentSeance,
        discipline: user.discipline.name,
      };
      increaseClassSeanceIndex(increaseSeanceData)
        .then((responseIncrease) => {
          console.log("responseIncrease");
          console.log(responseIncrease);
          let data = {
            classId,
            college: { name: college },
            discipline: user.discipline.name,
            currentDate: new Date(localeTime),
          };
          //increase seance index
          const updatedEleveData = {
            ...eleveData,
            nbSeances: currentSeance + 1,
          };

          if (markType == "participation") {
            updatedEleveData["newParticipation"] = markValue;
          } else if (markType == "avertissement") {
            updatedEleveData["newAvertissement"] = markValue;
          } else if (markType == "bonus") {
            updatedEleveData["newBonus"] = markValue;
          }

          editEleveNote(updatedEleveData)
            .then((response) => {
              console.log("response");
              console.log(response);
              getElevesInClasse(data)
                .then((response) => {
                  console.log("after increase....");
                  console.log(response.data.data);
                  const students = response.data.data.students;

                  setClasse(response.data.data.classe.name);
                  setEleves(response.data.data.students);
                  setElevesOrdreAlphabetique(
                    response.data.data.studentsAlphabeticalOrder
                  );

                  setCollege(response.data.data.classe.ecole.name);
                  setCounter(students.length);
                  setEleves(students);
                  setExportList(students);
                  setCurrentSeance(response.data.data.nbSeances);
                  setIsNewSeance(response.data.data.isNewSeance);
                })
                .catch((error) => {
                  console.log("error while fetching students");
                  console.log(error);
                })
                .finally(() => {
                  setIsFetching(false);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((errorIncrease) => {
          console.log(errorIncrease);
        });
    });
  };

  const handleStudentClick = (eleve, note) => {
    console.log(eleve);
    console.log("key");
    console.log(key);
    const localeTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    //client don't want spinner on markUpdate
    // if (key != "echange") {
    //   setIsFetching(true);
    // }
    if (note === "participation") {
      // setIsSwitching(true)
      console.log("on augmente");
      let participationToUpdate = eleve.participation.find(
        (matiere) => matiere.matière == discipline
      ).notes[currentSeance - 1];
      participationToUpdate = participationToUpdate + 1;
      eleve.participation.find((matiere) => {
        if (matiere.matière == discipline) {
          return (matiere.notes[currentSeance - 1] = participationToUpdate);
        }
      });

      const eleveData = {
        eleveId: eleve._id,
        newParticipation: participationToUpdate,
        markUpdateTime: new Date(localeTime),
        discipline: discipline,
        nbSeances: currentSeance,
        isNewSeance: isNewSeance,
      };

      if (isNewSeance) {
        updateSeanceAndStudentsData(eleveData, eleve, "participation", 1);
      } else {
        //same seance
        editEleveNote(eleveData)
          .then((response) => {
            console.log("response");
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      //client don't want spinner on markUpdate
      // .finally(() => {
      //   setIsFetching(false);
      // });
    }
    if (note === "bonus") {
      // setIsSwitching(true)
      console.log("on augmente");
      let bonusToUpdate = eleve.bonus.find(
        (matiere) => matiere.matière == discipline
      ).notes[currentSeance - 1];
      bonusToUpdate = bonusToUpdate + 1;
      eleve.bonus.find((matiere) => {
        if (matiere.matière == discipline) {
          return (matiere.notes[currentSeance - 1] = bonusToUpdate);
        }
      });
      const eleveData = {
        eleveId: eleve._id,
        newBonus: bonusToUpdate,
        markUpdateTime: new Date(localeTime),
        discipline: discipline,
        nbSeances: currentSeance,
        isNewSeance: isNewSeance,
      };

      if (isNewSeance) {
        updateSeanceAndStudentsData(eleveData, eleve, "bonus", 1);
      } else {
        //same seance
        editEleveNote(eleveData)
          .then((response) => {
            console.log("response");
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      //client don't want spinner on markUpdate
      // .finally(() => {
      //   setIsFetching(false);
      // });
    }
    if (note === "avertissement") {
      // setIsSwitching(true)
      console.log("on augmente");
      let avertissementToUpdate = eleve.avertissement.find(
        (matiere) => matiere.matière == discipline
      ).notes[currentSeance - 1];
      avertissementToUpdate = avertissementToUpdate + 1;
      eleve.avertissement.find((matiere) => {
        if (matiere.matière == discipline) {
          return (matiere.notes[currentSeance - 1] = avertissementToUpdate);
        }
      });
      const eleveData = {
        eleveId: eleve._id,
        newAvertissement: avertissementToUpdate,
        markUpdateTime: new Date(localeTime),
        discipline: discipline,
        nbSeances: currentSeance,
        isNewSeance: isNewSeance,
      };
      if (isNewSeance) {
        updateSeanceAndStudentsData(eleveData, eleve, "avertissement", 1);
      } else {
        //same seance
        editEleveNote(eleveData)
          .then((response) => {
            console.log("response");
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      //client don't want spinner on markUpdate
      // .finally(() => {
      //   setIsFetching(false);
      // });
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
    const localeTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    console.log("on diminue");
    console.log(eleve);
    //client don't want spinner on markUpdate
    // setIsFetching(true);
    let participationToUpdate = eleve.participation.find(
      (matiere) => matiere.matière == discipline
    ).notes[currentSeance - 1];
    console.log("participationToUpdate???");
    console.log(participationToUpdate);

    if (participationToUpdate > 0) {
      participationToUpdate = participationToUpdate - 1;
      eleve.participation.find((matiere) => {
        if (matiere.matière == discipline) {
          return (matiere.notes[currentSeance - 1] = participationToUpdate);
        }
      });
      // eleve.participation = eleve.participation - 1;

      console.log("eleve.participation");
      console.log(eleve.participation);
      console.log(eleve);
      setCounter(counter + 1);
      setSelectedStudent(eleve);

      const eleveData = {
        eleveId: eleve._id,
        newParticipation: participationToUpdate,
        markUpdateTime: new Date(localeTime),
        discipline: discipline,
        nbSeances: currentSeance,
        isNewSeance: isNewSeance,
      };
      if (isNewSeance) {
        updateSeanceAndStudentsData(eleveData, eleve, "participation", 0);
      } else {
        //same seance
        editEleveNote(eleveData)
          .then((response) => {
            console.log("response");
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      //client don't want spinner on markUpdate
      // .finally(() => {
      //   setIsFetching(false);
      // });
    } else {
      console.log("no API request is made. Mark is already at 0");
    }
  };
  const decrementBonus = (eleve) => {
    const localeTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    console.log("on diminue");
    console.log(eleve);
    //client don't want spinner on markUpdate
    // setIsFetching(true);

    let bonusToUpdate = eleve.bonus.find(
      (matiere) => matiere.matière == discipline
    ).notes[currentSeance - 1];
    console.log("bonusToUpdate???");
    console.log(bonusToUpdate);

    if (bonusToUpdate > 0) {
      bonusToUpdate = bonusToUpdate - 1;
      eleve.bonus.find((matiere) => {
        if (matiere.matière == discipline) {
          return (matiere.notes[currentSeance - 1] = bonusToUpdate);
        }
      });
      // eleve.participation = eleve.participation - 1;
      setCounter(counter + 1);
      setSelectedStudent(eleve);

      const eleveData = {
        eleveId: eleve._id,
        newBonus: bonusToUpdate,
        markUpdateTime: new Date(localeTime),
        discipline: discipline,
        isNewSeance: isNewSeance,
      };

      if (isNewSeance) {
        updateSeanceAndStudentsData(eleveData, eleve, "bonus", 0);
      } else {
        //same seance
        editEleveNote(eleveData)
          .then((response) => {
            console.log("response");
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      //client don't want spinner on markUpdate
      // .finally(() => {
      //   setIsFetching(false);
      // });
    } else {
      console.log("no API request is made. Mark is already at 0");
    }
  };
  const decrementAvertissement = (eleve) => {
    const localeTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    console.log("on diminue");
    console.log(eleve);
    //client don't want spinner on markUpdate
    // setIsFetching(true);

    let avertissementToUpdate = eleve.avertissement.find(
      (matiere) => matiere.matière == discipline
    ).notes[currentSeance - 1];
    console.log("avertissementToUpdate???");
    console.log(avertissementToUpdate);

    if (avertissementToUpdate > 0) {
      avertissementToUpdate = avertissementToUpdate - 1;
      eleve.avertissement.find((matiere) => {
        if (matiere.matière == discipline) {
          return (matiere.notes[currentSeance - 1] = avertissementToUpdate);
        }
      });
      // eleve.avertissement = eleve.avertissement - 1;
      setCounter(counter + 1);
      setSelectedStudent(eleve);

      const eleveData = {
        eleveId: eleve._id,
        newAvertissement: avertissementToUpdate,
        markUpdateTime: new Date(localeTime),
        discipline: discipline,
        nbSeances: currentSeance,
      };

      if (isNewSeance) {
        updateSeanceAndStudentsData(eleveData, eleve, "avertissement", 0);
      } else {
        //same seance
        editEleveNote(eleveData)
          .then((response) => {
            console.log("response");
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      //client don't want spinner on markUpdate
      // .finally(() => {
      //   setIsFetching(false);
      // });
    } else {
      console.log("no API request is made. Mark is already at 0");
    }
  };

  const handleKey = (key) => {
    setKey(key);
    val = key;
    if (key == "echange") {
      setShowEmptyStudentsSwitch(false);
      setShowEmptyStudents(true);
    } else {
      setShowEmptyStudentsSwitch(true);
    }
    console.log(key);
  };

  const columns = [
    {
      id: "lastname",
      displayName: "NOM de famille",
    },
    {
      id: "firstname",
      displayName: "Prénom",
    },
    {
      id: "college",
      displayName: "Collège",
    },
    // {
    //   id: "participation",
    //   displayName: "Participations",
    // },
    // {
    //   id: "bonus",
    //   displayName: "Bonus",
    // },
    // {
    //   id: "avertissement",
    //   displayName: "Avertissement",
    // },
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
    // setCurrentSeance(currentSeance + 1)
  }, [counter]);

  useEffect(() => {
    if (eleves && discipline) {
      console.log("eleves[0]");
      console.log(eleves[0].participation);
      // setCurrentSeance(
      //   eleves[0].participation.find((matiere) => matiere.matière == discipline)
      //     .nbSeances
      // );  //temporary comment!
    }
  }, [eleves]);

  useEffect(() => {
    sessionStorage.setItem("fromLogin", JSON.stringify(false));
    const localeTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    setIsFetching(true);
    sessionService.loadUser().then((user) => {
      console.log("my user");
      console.log(user);
      setTeacherAvertissementDelta(user.avertissement);
      setTeacherBonusDelta(user.bonus);
      setTeacherParticipationDelta(user.participation);
      setTeacherNoteDepart(user.noteDepart);
      // console.log(user.college.name);
      let userCollege;
      if (Array.isArray(user.college)) {
        userCollege = user.college[0].name;
      } else {
        userCollege = user.college;
      }
      let data = {
        classId,
        college: userCollege,
        discipline: user.discipline.name,
        currentDate: new Date(localeTime),
      };
      getElevesInClasse(data)
        .then((response) => {
          const students = response.data.data.students;
          console.log("les eleves");
          console.log(response.data.data.students);
          setClasse(response.data.data.classe.name);
          setEleves(response.data.data.students);
          setElevesOrdreAlphabetique(
            response.data.data.studentsAlphabeticalOrder
          );
          setCollege(response.data.data.classe.ecole.name);
          // setCurrentSeance(response.data.data.students[0].find((matiere) => matiere.matière == user.discipline.name).nbSeances)
          setDiscipline(user.discipline.name);
          setCounter(students.length);
          setEleves(students);
          setExportList(students);
          setCurrentSeance(response.data.data.nbSeances);
          setIsNewSeance(response.data.data.isNewSeance);
          if (response.data.data.isNewSeance == true) {
            setShowModalNewSeance(response.data.data.isNewSeance);
          }
          console.log("response.data.data.isNewSeance------");
          console.log(response.data.data.isNewSeance);

          if (response.data.data.isNewSeance) {
            //user is fetching class from another day so we have to increase the seance
            let increaseSeanceData = {
              classe: response.data.data.classe.name,
              college: response.data.data.classe.ecole.name,
              nbSeances: response.data.data.nbSeances,
              discipline: user.discipline.name,
            };
            increaseClassSeanceIndex(increaseSeanceData)
              .then((responseIncrease) => {
                console.log("responseIncrease");
                console.log(responseIncrease);
                let data = {
                  classId,
                  college: { name: response.data.data.classe.ecole.name },
                  discipline: user.discipline.name,
                  currentDate: new Date(localeTime),
                };
                getElevesInClasse(data)
                  .then((response) => {
                    const students = response.data.data.students;
                    console.log("les eleves");
                    console.log(response.data.data.students);
                    setClasse(response.data.data.classe.name);
                    setEleves(response.data.data.students);
                    setElevesOrdreAlphabetique(
                      response.data.data.studentsAlphabeticalOrder
                    );

                    setCollege(response.data.data.classe.ecole.name);
                    setCounter(students.length);
                    setEleves(students);
                    setExportList(students);
                    setCurrentSeance(response.data.data.nbSeances);
                    setIsNewSeance(response.data.data.isNewSeance);
                    if (response.data.data.isNewSeance == true) {
                      setShowModalNewSeance(response.data.data.isNewSeance);
                    }
                  })
                  .catch((error) => {
                    console.log("error while fetching students");
                    console.log(error);
                  })
                  .finally(() => {
                    setIsFetching(false);
                  });
              })
              .catch((errorIncrease) => {
                console.log(errorIncrease);
              });
          }
        })
        .catch((error) => {
          console.log("error while fetching students");
          console.log(error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    });
    console.log("eleves");
    console.log(eleves);
  }, []);

  const simulateEndOfSeance = () => {
    const localeTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    sessionService.loadUser().then((user) => {
      setIsFetching(true);
      let increaseSeanceData = {
        classe: classe,
        college: college,
        nbSeances: currentSeance,
        discipline: user.discipline.name,
      };
      increaseClassSeanceIndex(increaseSeanceData)
        .then((responseIncrease) => {
          console.log("responseIncrease");
          console.log(responseIncrease);
          let data = {
            classId,
            college: { name: college },
            discipline: user.discipline.name,
            currentDate: new Date(localeTime),
          };
          getElevesInClasse(data)
            .then((response) => {
              console.log("after increase....");
              console.log(response.data.data);
              const students = response.data.data.students;

              setClasse(response.data.data.classe.name);
              setEleves(response.data.data.students);
              setElevesOrdreAlphabetique(
                response.data.data.studentsAlphabeticalOrder
              );

              setCollege(response.data.data.classe.ecole.name);
              setCounter(students.length);
              setEleves(students);
              setExportList(students);
              setCurrentSeance(response.data.data.nbSeances);
            })
            .catch((error) => {
              console.log("error while fetching students");
              console.log(error);
            })
            .finally(() => {
              setIsFetching(false);
              setShowModalNewSeance(true);
            });
        })
        .catch((errorIncrease) => {
          console.log(errorIncrease);
        });
    });
  };

  const isEmptyPlace = (studentIndex) => {
    const studentInArray = eleves.find((el) => el._id == studentIndex);
    return studentInArray.empty;
  };

  const handleDownloadSequence = () => {
    setShowModalEndSequence(true);
  };

  const processEndSequence = () => {
    setShowModalEndSequence(false);
    setIsFetching(true);
    console.log("fin de sequence avant l'appel api");
    console.log(eleves);
    console.log("teacherAvertissementDelta");
    console.log(teacherAvertissementDelta);
    console.log("teacherNoteDepart");
    console.log(teacherNoteDepart);

    let csvStudents = eleves.map((csvStudent) => {
      console.log("eleve....");
      console.log(csvStudent);
      console.log(discipline);
      let sumBonusStudent = csvStudent.bonus
        .find((matiere) => matiere.matière == discipline)
        .notes.reduce((sum, x) => sum + x);

      let sumAvertissementStudent = csvStudent.avertissement
        .find((matiere) => matiere.matière == discipline)
        .notes.reduce((sum, x) => sum + x);

      let sumParticipationStudent = csvStudent.participation
        .find((matiere) => matiere.matière == discipline)
        .notes.reduce((sum, x) => sum + x);

      console.log("sumBonusStudent");
      console.log(sumBonusStudent);
      console.log("sumAvertissementStudent");
      console.log(sumAvertissementStudent);
      console.log("sumParticipationStudent");
      console.log(sumParticipationStudent);

      return {
        lastname: csvStudent.lastname,
        firstname: csvStudent.firstname,
        empty: csvStudent.empty,
        // participation: csvStudent.participation,
        // bonus: csvStudent.bonus,
        // avertissement: csvStudent.avertissement,
        college: csvStudent.college,
        note:
          teacherNoteDepart +
          teacherBonusDelta * sumBonusStudent +
          teacherAvertissementDelta * sumAvertissementStudent +
          teacherParticipationDelta * sumParticipationStudent,
        placement: csvStudent.position,
      };
    });

    console.log("csvStudents");
    console.log(csvStudents);

    csvStudents = csvStudents.filter((student) => student.empty == false);
    console.log("csvStudents after filter");
    console.log(csvStudents);

    setElevesForCsvFile(csvStudents);

    let classData = {
      classe: classe,
      college: college,
      nbSeances: currentSeance,
      discipline: discipline,
    };

    //call api :
    endClassSequence(classData)
      .then((response) => {
        console.log("response");
        console.log(response);
        const localeTime = new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
        });

        //now let's get the student list, with new sequence starting
        sessionService.loadUser().then((user) => {
          console.log("my user");
          console.log(user);
          console.log("la discipline....");
          console.log(user.discipline.name);
          // console.log(user.college.name);
          let userCollege;
          if (Array.isArray(user.college)) {
            userCollege = user.college[0].name;
          } else {
            userCollege = user.college;
          }
          let data = {
            classId,
            college: userCollege,
            discipline: user.discipline.name,
            currentDate: new Date(localeTime),
          };
          getElevesInClasse(data)
            .then((response) => {
              const students = response.data.data.students;
              console.log("les eleves");
              console.log(response.data.data.students);
              setClasse(response.data.data.classe.name);
              setEleves(response.data.data.students);

              setElevesOrdreAlphabetique(
                response.data.data.studentsAlphabeticalOrder
              );

              setCollege(response.data.data.classe.ecole.name);
              setCounter(students.length);
              setEleves(students);
              setExportList(students);
              setCurrentSeance(response.data.data.nbSeances);
              csvLink.current.click();
            })
            .catch((error) => {
              console.log("error while fetching students");
              console.log(error);
            })
            .finally(() => {
              setIsFetching(false);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
        // csvLink.current.click();
      });
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

        <Modal
          show={showModalNewSeance}
          onHide={() => {
            setShowModalNewSeance(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Nouvelle séance</Modal.Title>
          </Modal.Header>
          <Modal.Body>Vous venez de démarrer une nouvelle séance.</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setShowModalNewSeance(false);
              }}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModalEndSequence}
          onHide={() => {
            setShowModalEndSequence(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Fin de séquence</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Etes vous sur de vouloir mettre fin à la séquence ? <br />
            Cela générera la note de chaque élève en fonction de vos paramètres.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModalEndSequence(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                processEndSequence();
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
                      {Array.isArray(eleves) && currentSeance
                        ? eleves.map((eleve, index) => {
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
                                    <div
                                      style={{
                                        textAlign: "center",
                                        marginLeft: "1rem",
                                        display: "inline-block",
                                        marginTop: "0.5rem",
                                      }}
                                    >
                                      <i style={{ marginLeft: "-1rem" }}>
                                        {!eleve.empty && (
                                          <strong>
                                            {
                                              eleve?.participation?.find(
                                                (matiere) =>
                                                  matiere.matière == discipline
                                              ).notes[currentSeance - 1]
                                            }
                                          </strong>
                                        )}
                                      </i>
                                      <i
                                        className="fa-solid fa-circle-minus"
                                        style={{ marginLeft: "1rem" }}
                                        hidden={
                                          eleve.empty && !showEmptyStudents
                                            ? true
                                            : false
                                        }
                                        onClick={() => {
                                          decrementParticipation(eleve); //place is occupied decrease participation
                                        }}
                                      ></i>
                                    </div>
                                  )}
                                  {isEmptyPlace(eleve._id) && (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        marginLeft: "1rem",
                                        display: "inline-block",
                                        marginTop: "0.5rem",
                                      }}
                                    >
                                      <i style={{ marginLeft: "-1rem" }}>
                                        {!eleve.empty && (
                                          <strong>
                                            {
                                              eleve?.participation?.find(
                                                (matiere) =>
                                                  matiere.matière == discipline
                                              ).notes[currentSeance - 1]
                                            }
                                          </strong>
                                        )}
                                      </i>
                                      <i
                                        className="fa-solid fa-circle-minus"
                                        style={{
                                          marginLeft: "1rem",
                                          display: "inline-block",
                                          visibility: "hidden",
                                        }}
                                        // onClick={() => {
                                        // decrementParticipation(eleve); //don't do anything place is empty
                                        // }}
                                      ></i>
                                    </div>
                                  )}
                                </div>
                                <a
                                  style={{
                                    color: "black",
                                    textDecoration: "none",
                                  }}
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
                                          eleve.empty == true &&
                                          !showEmptyStudents
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
                                      {...(selectedStudent?._id ==
                                        eleve._id && {
                                        border: "2px solid purple",
                                      })}
                                    />
                                  </div>
                                </a>
                              </div>
                            );
                          })
                        : null}
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
                      {Array.isArray(eleves)
                        ? eleves.map((eleve) => {
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
                                    <div
                                      style={{
                                        textAlign: "center",
                                        marginLeft: "1rem",
                                        display: "inline-block",
                                        marginTop: "0.5rem",
                                      }}
                                    >
                                      <i style={{ marginLeft: "-1rem" }}>
                                        {!eleve.empty && (
                                          <strong>
                                            {
                                              eleve?.bonus?.find(
                                                (matiere) =>
                                                  matiere.matière == discipline
                                              ).notes[currentSeance - 1]
                                            }
                                          </strong>
                                        )}
                                      </i>
                                      <i
                                        className="fa-solid fa-circle-minus"
                                        hidden={
                                          eleve.empty && !showEmptyStudents
                                            ? true
                                            : false
                                        }
                                        style={{
                                          marginLeft: "1rem",
                                          // display: "inline-block",
                                        }}
                                        onClick={() => {
                                          decrementBonus(eleve); //place is occupied decrease bonus
                                        }}
                                      ></i>
                                    </div>
                                  )}
                                  {isEmptyPlace(eleve._id) && (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        marginLeft: "1rem",
                                        display: "inline-block",
                                        marginTop: "0.5rem",
                                      }}
                                    >
                                      <i style={{ marginLeft: "-1rem" }}>
                                        {!eleve.empty && (
                                          <strong>
                                            {
                                              eleve?.bonus?.find(
                                                (matiere) =>
                                                  matiere.matière == discipline
                                              ).notes[currentSeance - 1]
                                            }
                                          </strong>
                                        )}
                                      </i>
                                      <i
                                        className="fa-solid fa-circle-minus"
                                        style={{
                                          marginLeft: "1rem",
                                          visibility: "hidden",
                                        }}
                                        // onClick={() => {
                                        // decrementParticipation(eleve); //don't do anything place is empty
                                        // }}
                                      ></i>
                                    </div>
                                  )}
                                </div>
                                <a
                                  style={{
                                    color: "black",
                                    textDecoration: "none",
                                  }}
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
                                        eleve.empty == true &&
                                        !showEmptyStudents
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
                                </a>
                              </div>
                            );
                          })
                        : null}
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
                      {Array.isArray(eleves)
                        ? eleves.map((eleve) => {
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
                                    <div
                                      style={{
                                        textAlign: "center",
                                        marginLeft: "1rem",
                                        display: "inline-block",
                                        marginTop: "0.5rem",
                                      }}
                                    >
                                      <i style={{ marginLeft: "-1rem" }}>
                                        {!eleve.empty && (
                                          <strong>
                                            {
                                              eleve?.avertissement?.find(
                                                (matiere) =>
                                                  matiere.matière == discipline
                                              ).notes[currentSeance - 1]
                                            }
                                          </strong>
                                        )}
                                      </i>
                                      <i
                                        className="fa-solid fa-circle-minus"
                                        hidden={
                                          eleve.empty && !showEmptyStudents
                                            ? true
                                            : false
                                        }
                                        style={{
                                          marginLeft: "1rem",
                                        }}
                                        onClick={() => {
                                          decrementAvertissement(eleve); //place is occupied decrease avertissement
                                        }}
                                      ></i>
                                    </div>
                                  )}
                                  {isEmptyPlace(eleve._id) && (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        marginLeft: "1rem",
                                        display: "inline-block",
                                        marginTop: "0.5rem",
                                      }}
                                    >
                                      <i style={{ marginLeft: "-1rem" }}>
                                        {!eleve.empty && (
                                          <strong>
                                            {
                                              eleve?.avertissement?.find(
                                                (matiere) =>
                                                  matiere.matière == discipline
                                              ).notes[currentSeance - 1]
                                            }
                                          </strong>
                                        )}
                                      </i>
                                      <i
                                        className="fa-solid fa-circle-minus"
                                        style={{
                                          marginLeft: "1rem",
                                          visibility: "hidden",
                                        }}
                                      ></i>
                                    </div>
                                  )}
                                </div>
                                <a
                                  style={{
                                    color: "black",
                                    textDecoration: "none",
                                  }}
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
                                        handleStudentClick(
                                          eleve,
                                          "avertissement"
                                        );
                                    }}
                                    style={{
                                      opacity:
                                        eleve.empty == true &&
                                        !showEmptyStudents
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
                                </a>
                              </div>
                            );
                          })
                        : null}
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
                      {Array.isArray(eleves)
                        ? eleves.map((eleve) => {
                            return (
                              <div
                                key={eleve._id}
                                style={{
                                  marginBottom: "-0.5rem",
                                  marginRight: "0.5rem",
                                  flex: "1 0 10%",
                                }}
                              >
                                <div
                                  style={{
                                    textAlign: "center",
                                    marginLeft: "1rem",
                                    display: "inline-block",
                                    marginTop: "0.5rem",
                                    visibility: "hidden",
                                  }}
                                >
                                  <i style={{ marginLeft: "-1rem" }}>
                                    {!eleve.empty && (
                                      <strong>
                                        {
                                          eleve?.avertissement?.find(
                                            (matiere) =>
                                              matiere.matière == discipline
                                          ).notes[currentSeance - 1]
                                        }
                                      </strong>
                                    )}
                                  </i>
                                  <i
                                    className="fa-solid fa-circle-minus"
                                    style={{
                                      marginLeft: "2rem",
                                      display: "inline-block",
                                      visibility: "hidden",
                                    }}
                                    // onClick={() => {
                                    //   decrementParticipation(eleve); //place is occupied decrease participation
                                    // }}
                                  ></i>
                                </div>
                                <a
                                  style={{
                                    color: "black",
                                    textDecoration: "none",
                                  }}
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
                                        eleve.empty == true &&
                                        !showEmptyStudents
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
                                </a>
                              </div>
                            );
                          })
                        : null}
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
                      {Array.isArray(eleves)
                        ? eleves.map((eleve) => {
                            return (
                              <div
                                key={eleve._id}
                                style={{
                                  marginBottom: "-0.5rem",
                                  marginRight: "0.5rem",
                                  flex: "1 0 10%",
                                }}
                              >
                                <div
                                  style={{
                                    textAlign: "center",
                                    marginLeft: "1rem",
                                    display: "inline-block",
                                    marginTop: "0.5rem",
                                    visibility: "hidden",
                                  }}
                                >
                                  <i style={{ marginLeft: "-1rem" }}>
                                    {!eleve.empty && (
                                      <strong>
                                        {
                                          eleve?.bonus?.find(
                                            (matiere) =>
                                              matiere.matière == discipline
                                          ).notes[currentSeance - 1]
                                        }
                                      </strong>
                                    )}
                                  </i>
                                  <i
                                    className="fa-solid fa-circle-minus"
                                    style={{
                                      marginLeft: "2rem",
                                      display: "inline-block",
                                      visibility: "hidden",
                                    }}
                                    // onClick={() => {
                                    //   decrementParticipation(eleve); //place is occupied decrease participation
                                    // }}
                                  ></i>
                                </div>
                                <a
                                  style={{
                                    color: "black",
                                    textDecoration: "none",
                                  }}
                                  onClick={() => {
                                    goToStudentStats(eleve);
                                  }}
                                >
                                  <img
                                    src={eleve.photo}
                                    style={{
                                      opacity:
                                        eleve.empty == true &&
                                        !showEmptyStudents
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
                          })
                        : null}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </Col>
          <Col xs="3" md="3" lg="3">
            <div id="students-table-list" style={{}}>
              <div style={{ marginBottom: "1rem" }}>
                <div>Classe: {classe}</div>
                <div>
                  Séance n°: {currentSeance}
                  {/* {Array.isArray(eleves)
                    ? eleves[0].participation.find(
                        (matiere) => matiere.matière == discipline
                      ).nbSeances
                    : null} */}
                </div>
                {/* <div>
                  <Button onClick={() => simulateEndOfSeance()}>
                    Simuler fin séance
                  </Button>
                </div> */}
              </div>
              {showEmptyStudentsSwitch && (
                <div
                  id="hide-empty-students"
                  style={{ marginBottom: "0.5rem", marginTop: "-1rem" }}
                >
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
              )}
              <div>
                <Button onClick={handleDownloadSequence}>Fin séquence</Button>
              </div>

              <CsvDownloader
                filename={`classe_${classe}`}
                extension=".csv"
                separator=";"
                wrapColumnChar="'"
                columns={columns}
                datas={elevesForCsvFile}
                style={{ visibility: "hidden" }}
              >
                <div>
                  <Button ref={csvLink}></Button>
                </div>

                {/* <a
                    href="#"
                    style={{ color: "black" }}
                    onClick={() => downloadClassFile()}
                  >
                    <i className="fa-solid fa-download"></i>
                  </a> */}
              </CsvDownloader>
              <ListGroup>
                {Array.isArray(elevesOrdreAlphabetique)
                  ? elevesOrdreAlphabetique.map((eleve, index) => {
                      if (!eleve.empty)
                        return (
                          <ListGroup.Item
                            key={eleve._id}
                            action
                            active={eleve._id === selectedStudent?._id}
                            onClick={() => studentInTableClick(eleve)}
                          >
                            {eleve.firstname}
                            <i
                              className="fa-solid fa-pen-to-square"
                              style={{ marginLeft: "2rem" }}
                              onClick={() => {
                                goToStudentEdit(eleve);
                              }}
                            ></i>
                          </ListGroup.Item>
                        );
                    })
                  : null}
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
