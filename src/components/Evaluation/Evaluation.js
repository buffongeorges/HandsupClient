import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Nav from "react-bootstrap/Nav";
import ListGroup from "react-bootstrap/ListGroup";
import { MultiSelect } from "react-multi-select-component";
import { FaPlusCircle } from "react-icons/fa";

import Counter from "../../utils/Counter/Counter";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import store from "../../auth/store";
import { AuthContext, useAuth } from "../../auth/context/AuthContext";

// auth & redux
import { connect } from "react-redux";
import {
  editProfesseur,
  getProfesseurData,
  getProfesseurDataForEvaluation,
  getS3SecureURL,
  importStudentsFromFile,
  logoutUser,
  signupUser,
  uploadImageToS3,
  uploadTeacherPicture,
} from "../../auth/actions/userActions";
import { colors } from "../../utils/Styles";
import { ThreeDots, TailSpin } from "react-loader-spinner";
import { sessionService } from "redux-react-session";
import Switch from "../../utils/Switch/Switch";

const allowedExtensions = ["csv", "xls"];

const Evaluation = () => {
  const [multiselectOptions, setMultiselectOptions] = useState([]);
  const [endOfTrimestre, setEndOfTrimestre] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [key, setKey] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isQCM, setIsQCM] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [evaluationName, setEvaluationName] = useState(null);
  const [evaluations, setEvaluations] = useState(null);
  const [counter, setCounter] = useState(0);

  const [showCamera, setShowCamera] = useState(false);
  const [college, setCollege] = useState("Choisir collège");
  const [ecoles, setEcoles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState(null);

  const [teacherUploadedFile, setTeacherUploadedFile] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);

  const [file, setFile] = useState("");
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    setShowCamera(false);
    // setPhoto(imageSrc);
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "File name", { type: "image/png" });
        setSelectedPicture(file);
      });
  }, [webcamRef]);

  const [noteDepart, setNoteDepart] = useState(null);
  const [participation, setParticipation] = useState(null);
  const [avertissement, setAvertissement] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [disciplines, setDisciplines] = useState(null);
  const [discipline, setDiscipline] = useState(null);
  const [checkedDiscipline, setCheckedDiscipline] = useState(null);
  const [showDisciplineAlert, setShowDisciplineAlert] = useState(false);
  const [showSuccessfulImport, setShowSuccessfulImport] = useState(false);
  const [showFailureImport, setShowFailureImport] = useState(false);

  // const [importedStudentsSchool, setImportedStudentsSchool] = useState(null);
  const [importedStudentsSchool, setImportedStudentsSchool] =
    useState("Mont des Accords"); // for importing purpose

  const [showModalImportedStudentsSchool, setShowModalImportedStudentsSchool] =
    useState(false);

  const [showModalUploadStudentFile, setShowModalUploadStudentFile] =
    useState(false);

  let navigate = useNavigate();

  let questionsExample = [
    {
      index: 0,
      title: "Titre question 1",
      possibleAnswers: "Reponse1, Reponse2, Réponse 3",
      files: [
        {
          index: 0,
          title: "Image1.jpg",
        },
        {
          index: 1,
          title: "Image2.png",
        },
      ],
    },
  ];

  useEffect(() => {
    sessionStorage.setItem("fromLogin", JSON.stringify(false));
    setIsFetching(true);
    sessionService.loadUser().then((user) => {
      console.log("user");
      console.log(user);
      console.log(user._id);
      setUserId(user._id);
      setUser(user);
      getProfesseurDataForEvaluation(user._id)
        .then((response) => {
          console.log("les infos prof");
          console.log(response.data);
          console.log("les ecoles");
          console.log(response.data.data.ecoles);
          const professeur = response.data.data;
          setFirstname(professeur.firstname);
          setLastname(professeur.lastname);
          setCollege(professeur?.college[0].name);
          setClasses(professeur?.classes);
          setPhoto(professeur.photo);
          setDiscipline(response.data.data.discipline.name);
          setSelectedSchool(professeur?.college[0]);

          setForm({
            evaluationName: evaluationName,
          });
          if (professeur.college.length > 0) {
            // const initialSchoolId = professeur.college[0]._id;
            // const initialClasses = professeur?.ecoles.find(
            //   (ecole) => ecole._id === initialSchoolId
            // ).classes;
            // const newOptions = multiselectOptions;
            // initialClasses.forEach((classe) => {
            //   const option = {
            //     label: classe.name,
            //     value: classe.name,
            //     _id: classe._id,
            //   };
            //   newOptions.push(option);
            // });
            // console.log("les options")
            // console.log(newOptions);
            setMultiselectOptions(professeur?.classes);
          }
        })
        .finally(() => {
          setIsFetching(false);
        });
    });
  }, []);

  //   useEffect(() => {
  //     // console.log(selectedSchool.classes.length)
  //     if (selectedSchool && selectedSchool.classes) {
  //       console.log(selectedSchool);
  //       const newOptions = [];
  //       selectedSchool.classes?.forEach((classe) => {
  //         const option = {
  //           label: classe.name,
  //           value: classe.name,
  //           _id: classe._id,
  //         };
  //         newOptions.push(option);
  //       });

  //       newOptions.sort((classeA, classeB) => {
  //         return classeB.label.localeCompare(classeA.label); //sort classes alphabetically
  //       });

  //       setMultiselectOptions(newOptions);
  //       // setClasses([]);
  //     } else if (selectedSchool && !selectedSchool.classes) {
  //       console.log("pas de classes!");
  //       setMultiselectOptions([]);
  //       setClasses([]);
  //     }
  //   }, [selectedSchool]);

  const addNewQuestion = () => {
    if (questions?.length <= 0) {
      setSelectedQuestionIndex(1); // first question added
    }
    let newQuestion = {
      id: counter,
      name: "",
      possibleAnswers: [
        {
          id: 0,
          answer: "",
        },
        {
          id: 1,
          answer: "",
        },
      ],
      points: 0,
    };
    console.log('questions')
    console.log(questions)
    let questionsData = [...questions];
    questionsData.push(newQuestion);
    setQuestions(questionsData);
    setCounter(counter + 1);
  };

  const addNewAnswerToQCM = (questionIndex) => {
    let questionsData = [...questions];
    let possibleAnswers = questionsData[questionIndex]?.possibleAnswers;
    console.log("ici??");
    console.log(possibleAnswers.length);
    possibleAnswers.push({
      id: possibleAnswers.length,
      answer: "",
    });
    console.log("possibleAnswers");
    console.log(possibleAnswers);
    console.log("questionsData");
    console.log(questionsData);
    setQuestions(questionsData);
    setCounter(counter + 1);
  };

  const findFormErrors = () => {
    const {
      firstname,
      lastname,
      endOfTrimestre,
      teacherUploadedFile,
      pictureFile,
    } = form;

    var regName = /^[a-z ,.'-]+$/i;

    const newErrors = {};
    console.log("a t on une date deja?");
    console.log(endOfTrimestre);

    // name errors
    if (!lastname || lastname === "")
      newErrors.lastname = "Veuillez saisir un nom";

    console.log(firstname);
    console.log(lastname);
    if (!regName.test(lastname) && lastname !== "")
      newErrors.lastname = "Veuillez saisir un nom correct";
    if (!regName.test(firstname) && firstname !== "")
      newErrors.firstname = "Veuillez saisir un prénom correct";
    if (!firstname || firstname === "")
      newErrors.firstname = "Veuillez saisir un prénom";
    else if (firstname.length > 30) newErrors.name = "name is too long!";
    // food errors
    if (!college || college === "") newErrors.food = "select a college!";

    console.log("newErrors");
    console.log(newErrors);

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/pending");

    //TODO......
    //check if discipline is checked
    // if (!checkedDiscipline) {
    //   setShowDisciplineAlert(true);
    //   return;
    // }
    // if (teacherUploadedFile) {
    //   if (!isValidFileUploadForEvaluation(teacherUploadedFile)) {
    //     return;
    //   }
    // }

    // // get our new errors
    // const newErrors = findFormErrors();
    // // Conditional logic:
    // if (Object.keys(newErrors).length > 0) {
    //   // We got errors!
    //   setErrors(newErrors);
    //   console.log("errors");
    //   console.log(errors);
    // } else {
    //   // No errors! Put any logic here for the form submission!
    //   setIsSubmitting(true);
    //   console.log("avertissement");
    //   console.log(avertissement);
    //   saveProfesseur();
    // }
  };

  const saveProfesseur = () => {
    // setCurrentUser({firstname: firstname, lastname: lastname, ...professeur} );
    console.log("les classes sont");
    console.log(classes);

    let updatedCollegeDetails = { ...college, endOfTrimestre: endOfTrimestre };

    let credentials = {
      professeurId: userId,
      newFirstname: firstname,
      newLastname: lastname,
      newCollege: updatedCollegeDetails,
      newPhoto: photo,
      newNoteDepart: noteDepart,
      newParticipation: participation,
      newAvertissement: avertissement,
      newBonus: bonus,
      newClasses: classes,
      newDiscipline: checkedDiscipline,
      newEndOfTrimestre: endOfTrimestre,
    };

    let sessionStorageValues = {
      firstname: firstname,
      lastname: lastname,
      college: updatedCollegeDetails,
      classes: classes,
      photo: photo,
      noteDepart: noteDepart,
      participation: participation,
      avertissement: avertissement,
      bonus: bonus,
      admin: isAdmin,
      discipline: checkedDiscipline,
      endOfTrimestre: endOfTrimestre,
    };

    let newUserFields = {
      ...user,
      ...sessionStorageValues,
      //Point cours : What if both the object has same key, it simply merge the last objects value and have only one key value.
    };

    sessionService.saveUser(newUserFields).then(() => {
      console.log("user has been saved in session successfully");
    });
    sessionStorage.setItem("professeur", JSON.stringify(sessionStorageValues));
    editProfesseur(credentials, navigate).then(async (response) => {
      console.log("réponse de edit");
      console.log(response);
      console.log("url de la photo du prof");
      console.log(photo);
      if (response.status === 200 && response.data.status === "SUCCESS") {
        setShowModal(true);
      }
    });
  };

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
    // Check and see if errors exist, and remove them from the error object:
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const handleNoteDepart = (value) => {
    setNoteDepart(value.current);
  };
  const handleParticipation = (value) => {
    setParticipation(value.current);
  };
  const handleAvertissement = (value) => {
    setAvertissement(value.current);
  };
  const handleBonus = (value) => {
    setBonus(value.current);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/classes");
  };

  const hideModalUploadStudentFile = () => {
    setShowModalUploadStudentFile(false);
  };

  const hideModalImportedStudentsSchool = () => {
    setShowModalImportedStudentsSchool(false);
  };

  useEffect(() => {
    //methode 1 : passer par le serveur pour appeler S3
    // const formData = new FormData();
    // if (selectedPicture) {
    //   formData.append("image", selectedPicture);
    //   setIsFetching(true)
    //   uploadTeacherPicture(formData)
    //     .then((response) => {
    //       console.log("response");
    //       console.log(response.data.imagePath);
    //       console.log('url formé:')
    //       console.log(backendUrl+response.data.imagePath)
    //       setPhoto(backendUrl+response.data.imagePath)
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    //     .finally(() => {
    //       setIsFetching(false);
    //     });
    // }

    //methode 2 : appeler directement s3 depuis le front
    if (
      selectedPicture ||
      (pictureFile && isValidFileUploadForPicture(pictureFile))
    ) {
      setIsFetching(true);
      getS3SecureURL()
        .then((response) => {
          console.log("secure url:");
          console.log(response);

          uploadImageToS3(response.data.url, selectedPicture)
            .then((s3Response) => {
              console.log("after s3 upload");
              console.log(s3Response);
              if (s3Response.status === 200 && s3Response.statusText === "OK") {
                const imageUrl = response.data.url.split("?")[0];
                console.log(imageUrl);
                setPhoto(imageUrl);
              }
            })
            .catch((err) => {
              console.log("error uploading image to S3");
              console.log(err);
            })
            .finally(() => {
              setIsFetching(false);
            });
        })
        .catch((error) => {
          console.log("error getting secure url from server");
          console.log(error);
        });
    }
  }, [selectedPicture]);

  const isValidFileUploadForEvaluation = (file) => {
    console.log("le fichier");
    console.log(file);
    const validExtensions = [
      "csv",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "vnd.ms-excel",
    ];
    const fileExtension = file?.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const isValidFileUploadForPicture = (file) => {
    console.log("la photo par webcam");
    console.log(selectedPicture);
    console.log("photo uploadée ");
    console.log(pictureFile);
    const validExtensions = ["png", "jpeg", "gif", "jpg"];
    const fileExtension = file?.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const handleUploadQuestionFile = (file, index) => {
    let newAttachedFiles = [];
    const uploadedFile = {
      index,
      type: file.type,
      title: file.name,
    };
    console.log("uploadedFile");
    console.log(uploadedFile);
    const indexOfFileInQuestion = attachedFiles.findIndex(
      (item) => item.index == index
    );
    if (indexOfFileInQuestion <= -1) {
      // does not exist yet
      newAttachedFiles = [...attachedFiles, uploadedFile];
    } else {
      // already exists
      newAttachedFiles = [...attachedFiles];
      newAttachedFiles[indexOfFileInQuestion].title = file.name;
    }

    console.log("newAttachedFiles");
    console.log(newAttachedFiles);
    setAttachedFiles(newAttachedFiles);
    const fileUrl = URL.createObjectURL(file);
    console.log("fileUrl");
    console.log(fileUrl);
    const fileData = { ...uploadedFile, fileUrl };
    console.log("fileData");
    console.log(fileData);
    setSelectedFile(fileData);
    if (isValidFileUploadForEvaluation(file)) {
      // display preview of file in the area
    }
  };

  const importNewStudents = () => {
    let formData = new FormData();
    console.log("teacherUploadedFile");
    console.log(teacherUploadedFile);
    formData.append("students", teacherUploadedFile);
    formData.append("studentsCollege", importedStudentsSchool);

    console.log("début de l'import");
    console.log("formData");
    console.log(formData);

    console.log("le college renseigne");
    console.log(importedStudentsSchool);
    setIsFetching(true);
    importStudentsFromFile(formData)
      .then((response) => {
        console.log("response");
        console.log(response);
        setShowModalUploadStudentFile(false);
        if (response.status === 200 && response.data.status === "SUCCESS") {
          //the import went well
          setTimeout(() => {
            setShowSuccessfulImport(true);
            setIsFetching(false);
          }, 30000);
        } else {
          //something went wrong while importing
          setShowFailureImport(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImportedStudentsSchool = () => {
    if (importedStudentsSchool) {
      setShowModalImportedStudentsSchool(false);
      setShowModalUploadStudentFile(true);
    } else {
      alert("Veuillez choisir un collège");
    }
  };

  const competences = [
    {
      name: "Ecouter, Comparer, Analyser",
      id: "uzrcuy6_uçuoij",
    },
    {
      name: "Se repérer dans l'espace",
      id: "uzrcuy6_uçuaze",
    },
  ];

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
      <div style={{ margin: "2rem" }}>
        <Form onSubmit={handleSubmit}>
          <h1>Nouvelle évaluation</h1>
          <Row>
            <Col>
              <Form.Group className="mb-3 mt-4" controlId="formFirstname">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer le nom de l'évaluation"
                  value={evaluationName}
                  onChange={(e) => {
                    setEvaluationName(e.target.value);
                    setField("lastname", e.target.value);
                  }}
                  isInvalid={!!errors.evaluationName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastname}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMatiere">
                <Form.Label>Matière concernée</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer la matière que vous enseignez"
                  value={discipline}
                  disabled={true}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstname}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCollège">
                <Form.Label>Collège</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer le collège dans lequel vous enseignez"
                  value={college}
                  disabled={true}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="formCollege"
                style={{ marginBottom: "2rem" }}
              >
                <Form.Label>Classes concernées</Form.Label>
                <MultiSelect
                  options={multiselectOptions}
                  {...(classes && { value: classes })}
                  //setSelectedSchool.classes
                  onChange={(selectedItems) => {
                    selectedItems.sort((classeA, classeB) => {
                      const numA =
                        classeA.value[0] +
                        classeA.value[classeA.value.length - 1];
                      const numB =
                        classeB.value[0] +
                        classeB.value[classeB.value.length - 1];
                      return numB - numA;
                    });
                    setClasses(selectedItems);
                  }}
                  labelledBy="Select"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="formCollege"
                style={{ marginBottom: "2rem" }}
              >
                <Form.Label>Durée</Form.Label>
                <div>
                  <Counter value="01:00" type="time" delta="00:15" />
                </div>
              </Form.Group>
            </Col>
            <Col className="mb-3 mt-4">
              <Form.Group controlId="formDiscipline">
                <Form.Label style={{ fontSize: "1.4rem" }}>
                  Compétence(s) évaluée(s)
                </Form.Label>
                {Array.isArray(competences)
                  ? competences.map((competence) => (
                      <div key={`default-${competence.name}`}>
                        <Form.Check
                          type="checkbox"
                          id={`default-${competence.name}`}
                          label={`${competence.name}`}
                          //   checked={
                          //     checkedDiscipline &&
                          //     checkedDiscipline._id == discipline._id
                          //   }
                          onClick={() => {
                            setShowDisciplineAlert(false);
                            setCheckedDiscipline(discipline);
                          }}
                        />
                      </div>
                    ))
                  : null}
                {/* <Alert
                  variant="danger"
                  onClose={() => setShowDisciplineAlert(false)}
                  dismissible
                  show={showDisciplineAlert}
                >
                  <Alert.Heading style={{ fontSize: "1.3rem" }}>
                    Aucune matière choisie
                  </Alert.Heading>
                  <p style={{ marginBottom: "0rem" }}>
                    Veuillez choisir une discipline
                  </p>
                </Alert> */}
              </Form.Group>
              <Form.Group controlId="formDiscipline">
                <Form.Label className="mt-4" style={{ fontSize: "1.4rem" }}>
                  Options
                </Form.Label>
                <Row>
                  <Col className="mb-4">
                    <span>Correction automatique&nbsp;</span>
                  </Col>
                  <Col className="d-inline-flex">
                    <Switch />
                  </Col>
                </Row>
                <Row>
                  <Col className="mb-4">
                    <span>Revue anonyme des copies&nbsp;</span>
                  </Col>
                  <Col className="d-inline-flex">
                    <Switch />
                  </Col>
                </Row>
                <Row>
                  <Col className="mb-4 d-inline-flex align-items-center">
                    <span>Autoriser marge d'erreur&nbsp;</span>
                  </Col>
                  <Col>
                    <Switch />
                  </Col>
                </Row>
                <Row>
                  <Col className="mb-4  d-inline-flex align-items-center">
                    <span>
                      Les élèves peuvent revenir sur une question&nbsp;
                    </span>
                  </Col>
                  <Col>
                    <Switch />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="formQuestions">
              <Form.Label style={{ fontSize: "1.5rem", marginTop: "1.5rem" }}>
                Les questions
              </Form.Label>
              <div>
                <Button
                  type="button"
                  variant={"outline-primary"}
                  onClick={() => {
                    addNewQuestion();
                  }}
                >
                  <FaPlusCircle size={"1.5rem"} />
                </Button>
              </div>

              {Array.isArray(questions) && questions?.length > 0 && (
                <div>
                  <div>
                    <Form.Group
                      className="mb-3"
                      controlId="text"
                      style={{ marginTop: "1rem" }}
                    >
                      <Card>
                        <>
                          <Card.Header>
                            <Nav
                              variant="pills"
                              defaultActiveKey="question-card-1"
                              onSelect={(selectedKey) => {
                                console.log(selectedKey);
                                setKey(selectedKey);
                                const indexValue = parseInt(
                                  selectedKey[selectedKey.length - 1]
                                );
                                console.log("indexValue", indexValue);
                                setSelectedQuestionIndex(indexValue);
                              }}
                            >
                              {questions.map((question, index) => (
                                <Nav.Item>
                                  <Nav.Link
                                    id={`question-card-${index + 1}`}
                                    eventKey={`question-card-${index + 1}`}
                                  >
                                    Q° {index + 1}
                                  </Nav.Link>
                                </Nav.Item>
                              ))}
                            </Nav>
                          </Card.Header>
                          <ListGroup className="list-group-flush">
                            <ListGroup.Item>
                              <Card.Body>
                                <Card.Title>
                                  Question n°{selectedQuestionIndex}
                                </Card.Title>
                                <Card.Text>
                                  <Form.Group
                                    className="mb-2 mt-2"
                                    controlId="text"
                                  >
                                    <Form.Control
                                      as="textarea"
                                      required
                                      type="text"
                                      placeholder={`Composez votre question n° ${selectedQuestionIndex}`}
                                    />
                                  </Form.Group>
                                  <div
                                    lg="3"
                                    className="mt-3 d-flex align-items-center"
                                  >
                                    <span>QCM&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <span>
                                      <Switch
                                        onSwitchClick={(e) => {
                                          console.log(e);
                                          setIsQCM(e.current);
                                        }}
                                      />
                                    </span>
                                  </div>
                                </Card.Text>
                              </Card.Body>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <Card.Body>
                                <Card.Title className="mb-4">
                                  Réponse(s) possible(s)
                                </Card.Title>
                                <Card.Text>
                                  {!isQCM && (
                                    <Form.Group
                                      className="mb-2 mt-2"
                                      controlId="text"
                                    >
                                      <Form.Control
                                        as="textarea"
                                        required
                                        type="text"
                                        placeholder={`Entrez la/les réponse(s) possible(s) dans la question n° ${
                                          selectedQuestionIndex
                                        }`}
                                      />
                                      <Form.Text
                                        id="possible-answers-helper"
                                        muted
                                      >
                                        ATTENTION :{" "}
                                        <b>
                                          Indiquez les réponses possibles
                                          séparées par des virgules
                                        </b>
                                        <br />
                                        Ex: flute,flûte,flûte à bec <br />
                                        Le personnage principal est Joker,Joker
                                        est le personnage principal,Joker
                                      </Form.Text>
                                    </Form.Group>
                                  )}
                                  {isQCM && (
                                    <>
                                      {Array.isArray(questions) &&
                                      Array.isArray(
                                        questions[0]?.possibleAnswers
                                      ) ? (
                                        questions[0]?.possibleAnswers.map(
                                          (answer, answerIndex) => (
                                            <Form.Check
                                              type="checkbox"
                                              id={`qcm-checkbox-${answerIndex}`}
                                              label={
                                                <Form.Control
                                                  type="text"
                                                  placeholder={
                                                    answer.name
                                                      ? answer.name
                                                      : `Proposition ${
                                                          answerIndex + 1
                                                        }`
                                                  }
                                                  className="mb-3"
                                                  style={{
                                                    marginTop: "-0.5rem",
                                                  }}
                                                />
                                              }
                                            />
                                          )
                                        )
                                      ) : (
                                        <span>???Allo</span>
                                      )}

                                      {/* <Form.Check
                                        type="checkbox"
                                        id={`disabled-default-checkbox`}
                                        label={
                                          <Form.Control
                                            type="text"
                                            placeholder="Proposition 2"
                                            className="mb-3"
                                            style={{ marginTop: "-0.5rem" }}
                                          />
                                        }
                                      /> */}
                                      <Button
                                        variant="primary"
                                        onClick={() => addNewAnswerToQCM(0)}
                                      >
                                        Ajouter proposition
                                      </Button>
                                    </>
                                  )}
                                </Card.Text>
                              </Card.Body>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <Card.Body>
                                <Card.Title>Pièce jointe</Card.Title>
                                <Card.Text>
                                  <Form.Group controlId="formAttachedFile">
                                    <Form.Control
                                      type="file"
                                      accept="image/jpeg, image/png, image/jpg, video/mp4, audio/mp3"
                                      onChange={(e) => {
                                        console.log("nouveau csv");
                                        handleUploadQuestionFile(
                                          e.target.files[0],
                                          0
                                        );
                                      }}
                                      isInvalid={
                                        questions[selectedQuestionIndex]
                                          ?.files &&
                                        questions[selectedQuestionIndex]
                                          ?.files[0] &&
                                        !isValidFileUploadForEvaluation(
                                          teacherUploadedFile
                                        )
                                      }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {
                                        "Le format du fichier choisi est incorrect"
                                      }
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Card.Text>
                                {attachedFiles && (
                                  <div
                                    style={{
                                      marginTop: "2rem",
                                      width: "400rem",
                                    }}
                                  >
                                    {selectedFile?.type.includes("image") && (
                                      <img
                                        alt="preview image"
                                        src={selectedFile?.fileUrl}
                                      />
                                    )}
                                    {selectedFile?.type.includes("video") && (
                                      <video
                                        style={{
                                          width: "50rem",
                                          height: "30rem",
                                        }}
                                        controls
                                      >
                                        <source
                                          src={selectedFile?.fileUrl}
                                          type="video/mp4"
                                        />
                                        Votre navigateur ne prend pas en charge
                                        la balise vidéo.
                                      </video>
                                    )}
                                    {selectedFile?.type.includes("audio") && (
                                      <audio controls>
                                        <source
                                          src={selectedFile?.fileUrl}
                                          type="audio/mp3"
                                        />
                                        Votre navigateur ne prend pas en charge
                                        la balise vidéo.
                                      </audio>
                                    )}
                                  </div>
                                )}
                              </Card.Body>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <Card.Body>
                                <Card.Title>
                                  Points question {selectedQuestionIndex + 1}
                                </Card.Title>
                                <Card.Text>
                                  <div
                                    className="mt-3"
                                    style={{
                                      display: "inline-block",
                                      marginBottom: "1rem",
                                    }}
                                  >
                                    <Counter
                                      min={0}
                                      max={100}
                                      value={questions[selectedQuestionIndex-1]?.points}
                                      delta={0.25}
                                      handleCounterValue={(e) => {
                                        console.log(e);
                                        setTotalPoints(
                                          totalPoints + e.difference
                                        );
                                        let newArray = [...questions];
                                        const indexValue = newArray.findIndex((item) => item.id === selectedQuestionIndex);
                                        newArray[indexValue].points = newArray[indexValue].points + e.difference; 
                                        console.log('newArray')
                                        console.log(newArray)
                                        setQuestions(newArray);
                                      }}
                                    ></Counter>
                                  </div>
                                </Card.Text>
                              </Card.Body>
                            </ListGroup.Item>
                          </ListGroup>
                        </>
                      </Card>
                      <div className="mt-2">
                        <p className="lead" style={{ fontWeight: "bold" }}>
                          Total : {totalPoints} point(s)
                        </p>
                      </div>
                    </Form.Group>
                  </div>
                </div>
              )}
            </Form.Group>
          </Row>
          {!isSubmitting && (
            <Button
              variant="primary"
              type="submit"
              style={{ margin: "0 auto", display: "block" }}
            >
              Créer
            </Button>
          )}
          {isSubmitting && (
            <div style={{ margin: "0 auto", width: "10%" }}>
              <ThreeDots color={colors.theme} height={49} width={100} />
            </div>
          )}
        </Form>
        {/* <Modal
          show={showModalImportedStudentsSchool}
          onHide={hideModalImportedStudentsSchool}
        >
          <Modal.Header closeButton>
            <Modal.Title>Ecole des élèves</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Collège : </Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrer votre college"
                value={college}
                disabled={true}
              />
              <Form.Text className="text-muted">
                ATTENTION : Vous ne pourrez plus changer le collège par la
                suite.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModalImportedStudentsSchool(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={handleImportedStudentsSchool}
            >
              Continuer
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Informations mises à jour</Modal.Title>
          </Modal.Header>
          <Modal.Body>Vos modifications ont été bien sauvegardées.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Continuer
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSuccessfulImport}>
          <Modal.Header>
            <Modal.Title>Mise à jour réussie</Modal.Title>
          </Modal.Header>
          <Modal.Body>L'import s'est terminé avec succès.</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setShowSuccessfulImport(false);
                window.location.reload();
              }}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal> */}

        {/* <Modal 
        show={showModalCreateTest}
        onHide={() => setShowModalCreateTest(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Récap évaluations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Est-ce que tout est correct ?. <br />
            Veuillez vérifier votre fichier ou réessayer plus tard
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                showModalCreateTest(false);
              }}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>  */}
      </div>
    );
  }
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(Evaluation);
