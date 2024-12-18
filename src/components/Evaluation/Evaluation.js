import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import CounterInput from "react-counter-input";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

const allowedExtensions = ["csv", "xls"];

const Evaluation = () => {
  const [multiselectOptions, setMultiselectOptions] = useState([]);
  const [endOfTrimestre, setEndOfTrimestre] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

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

  const [studentsFile, setStudentsFile] = useState(null);
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
            console.log("yooohooooo");
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
    let newQuestion = { id: counter, name: null, lives: 5 };
    let questionsData = [...questions];
    questionsData.push(newQuestion);
    setQuestions(questionsData);
    setCounter(counter + 1);
  };

  const findFormErrors = () => {
    const { firstname, lastname, endOfTrimestre, studentsFile, pictureFile } =
      form;

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
    // if (studentsFile) {
    //   if (!isValidFileUploadForStudentDB(studentsFile)) {
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

  const isValidFileUploadForStudentDB = (file) => {
    console.log("le fichier");
    console.log(file);
    const validExtensions = [
      "csv",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "vnd.ms-excel",
    ];
    const fileExtension = file.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const isValidFileUploadForPicture = (file) => {
    console.log("la photo par webcam");
    console.log(selectedPicture);
    console.log("photo uploadée ");
    console.log(pictureFile);
    const validExtensions = ["png", "jpeg", "gif", "jpg"];
    const fileExtension = file.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const handleUploadStudentFile = (file) => {
    setStudentsFile(file);
    if (isValidFileUploadForStudentDB(file)) {
      // setShowModalUploadStudentFile(true);
      setShowModalImportedStudentsSchool(true);
    }
  };

  const importNewStudents = () => {
    let formData = new FormData();
    console.log("studentsFile");
    console.log(studentsFile);
    formData.append("students", studentsFile);
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
    },
    {
      name: "Se repérer dans l'espace",
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
          <Row>
            <Col>
              <h2> Nouvelle évaluation</h2>
              <Form.Group
                className="mb-3"
                controlId="formFirstname"
                style={{ marginTop: "2rem" }}
              >
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
              <Form.Group className="mb-3" controlId="formDiscipline">
                <Form.Label>Compétence(s) evaluée(s)</Form.Label>
                {Array.isArray(competences)
                  ? competences.map((competence) => (
                      <div key={`default-${competence.name}`} className="mb-3">
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
              <Form.Group className="mb-3" controlId="formQuestions">
                <Form.Label style={{ fontSize: "1.5rem", marginTop: "1.5rem" }}>
                  Les questions
                </Form.Label>
                <div>
                  {questions.map((question, index) => {
                    return (
                      <div>
                        <Form.Group
                          className="mb-3"
                          controlId="text"
                          style={{ marginTop: "1rem" }}
                        >
                          <div>
                            <strong>Question n° {index + 1} : </strong>
                          </div>
                          <Form.Control
                            as="textarea"
                            required
                            type="text"
                            placeholder={`Composez votre question n° ${
                              index + 1
                            }`}
                          />
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="text"
                          style={{ marginTop: "1rem" }}
                        >
                          <div>
                            <strong>Réponse(s) possible(s) : </strong>
                          </div>
                          <Form.Control
                            as="textarea"
                            required
                            type="text"
                            placeholder={`Entrez la/les Réponse(s) possible(s) dans la question n° ${
                              index + 1
                            }`}
                          />
                          <div>
                            <strong>
                              <p>Point(s) :</p>
                            </strong>
                            <div
                              style={{
                                display: "inline-block",
                                marginBottom: "1rem",
                              }}
                            >
                              <Counter
                                min={-20}
                                max={20}
                                value={0}
                                delta={0.25}
                              ></Counter>
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant={"outline-primary"}
                  onClick={() => {
                    addNewQuestion();
                  }}
                >
                  <FaPlusCircle size={"1.5rem"} />
                </Button>
              </Form.Group>
            </Col>
            {/* <Col style={{ marginLeft: "4rem" }}>
              <h2> Notation</h2>
              <div style={{ marginTop: "2rem" }}>
                <strong>
                  <p
                    style={{
                      display: "inline-block",
                      marginRight: "2rem",
                      width: "10rem",
                    }}
                  >
                    Note de départ
                  </p>
                </strong>
                <div style={{ display: "inline-block", marginBottom: "1rem" }}>
                  <Counter
                    min={9}
                    max={20}
                    value={noteDepart}
                    delta={0.25}
                    handleCounterValue={handleNoteDepart}
                  ></Counter>
                </div>
              </div>
              <div>
                <strong>
                  <p
                    style={{
                      display: "inline-block",
                      marginRight: "2rem",
                      width: "10rem",
                    }}
                  >
                    Participation
                  </p>
                </strong>
                <div style={{ display: "inline-block", marginBottom: "1rem" }}>
                  <Counter
                    min={0}
                    max={20}
                    value={participation}
                    delta={0.25}
                    handleCounterValue={handleParticipation}
                  ></Counter>
                </div>
              </div>
              <div>
                <strong>
                  <p
                    style={{
                      display: "inline-block",
                      marginRight: "2rem",
                      width: "10rem",
                    }}
                  >
                    Avertissement (-)
                  </p>
                </strong>
                <div style={{ display: "inline-block", marginBottom: "1rem" }}>
                  <Counter
                    min={-20}
                    max={0}
                    value={avertissement}
                    delta={0.25}
                    handleCounterValue={handleAvertissement}
                  ></Counter>
                </div>
              </div>
              <div>
                <strong>
                  <p
                    style={{
                      display: "inline-block",
                      marginRight: "2rem",
                      width: "10rem",
                    }}
                  >
                    Bonus (+)
                  </p>
                </strong>
                <div style={{ display: "inline-block", marginBottom: "1rem" }}>
                  <Counter
                    min={0}
                    max={20}
                    value={bonus}
                    delta={0.25}
                    handleCounterValue={handleBonus}
                  ></Counter>
                </div>
              </div>

              <Form.Group
                className="mb-3"
                controlId="formendOfTrimestre"
                style={{ marginTop: "2rem" }}
              >
                <Form.Label style={{ fontSize: "1.5rem" }}>
                  Fin du trimestre
                </Form.Label>
                <Form.Control
                  type="date"
                  value={endOfTrimestre}
                  onChange={(e) => {
                    handleDateChange(e.target.value);
                    setField("endOfTrimestre", e.target.value);
                  }}
                  isInvalid={!!errors.endOfTrimestre}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endOfTrimestre}
                </Form.Control.Feedback>
              </Form.Group>

              {isAdmin && (
                <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label style={{ fontSize: "1.5rem" }}>
                      Nouvelle base de données Elève
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={(e) => {
                        console.log("nouveau csv");
                        handleUploadStudentFile(e.target.files[0]);
                      }}
                      isInvalid={
                        studentsFile
                          ? !isValidFileUploadForStudentDB(studentsFile)
                          : false
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {"Le format du fichier choisi est incorrect"}
                    </Form.Control.Feedback>
                    <Modal
                      show={showModalUploadStudentFile}
                      onHide={hideModalUploadStudentFile}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Importer élèves</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Etes vous sûr de vouloir importer une nouvelle base de
                        données ? Cela affectera la base déjà existante. <br />
                        Cette opération va prendre plusieurs minutes.
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setShowModalUploadStudentFile(false);
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            importNewStudents();
                          }}
                        >
                          Importer
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </Form.Group>
                </div>
              )}
            </Col> */}

            {/* client don't want picture for the teacher */}
            {/* <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log(e.target.files[0]);
                setShowCamera(false);
                setSelectedPicture(e.target.files[0]);
                setPictureFile(e.target.files[0]);
              }}
              isInvalid={
                pictureFile ? !isValidFileUploadForPicture(pictureFile) : false
                // true
              }
            />
            <Form.Control.Feedback type="invalid">
              {"Le format du fichier choisi est incorrect"}
            </Form.Control.Feedback>
            {photo && (
              <div
                style={{
                  marginTop: "2rem",
                  width: "400rem",
                }}
              >
                <img
                  src={photo}
                  style={{
                    objectFit: "contain",
                    height: "15rem",
                    maxWidth: "100%",
                  }}
                />
              </div>
            )}
            {showCamera && (
              <div style={{ marginTop: "2rem" }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  width="350rem"
                  screenshotFormat="image/jpeg"
                />
                <br />
                <Button onClick={capture}>Capturer</Button>
              </div>
            )}
            {!showCamera && (
              <Button
                style={{ marginTop: "2rem" }}
                onClick={() => {
                  setPhoto(null);
                  setShowCamera(true);
                }}
              >
                Prendre photo
              </Button>
            )}
          </Form.Group> */}

            {/* <h2 style={{ marginTop: "2rem" }}>Base élève</h2>
        <Form.Group
          controlId="formFile"
          className="mb-3"
          style={{ marginTop: "2rem" }}
        >
          <Form.Label>Mettre à jour la base</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group> */}
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
        <Modal
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
        </Modal>

        <Modal show={showFailureImport}>
          <Modal.Header>
            <Modal.Title>Echec de la mise à jour</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            La mise à jour ne s'est pas passée comme prévu. <br />
            Veuillez vérifier votre fichier ou réessayer plus tard
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={() => {
                setShowFailureImport(false);
              }}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(Evaluation);
