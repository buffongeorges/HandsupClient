import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import CounterInput from "react-counter-input";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { MultiSelect } from "react-multi-select-component";

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
  getS3SecureURL,
  logoutUser,
  signupUser,
  uploadImageToS3,
  uploadTeacherPicture,
} from "../../auth/actions/userActions";
import { colors } from "../../utils/Styles";
import { ThreeDots, TailSpin } from "react-loader-spinner";
import { sessionService } from "redux-react-session";

//the remote endpoint and local
const remoteUrl = "https://young-dusk-42243.herokuapp.com";
const localUrl = "http://localhost:3002";
const backendUrl = localUrl;

const allowedExtensions = ["csv", "xls"];

const Settings = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [selected, setSelected] = useState([]);
  const [multiselectOptions, setMultiselectOptions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [college, setCollege] = useState("Choisir collège");
  const [ecoles, setEcoles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [file, setFile] = useState("");
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    setShowCamera(false);
    setPhoto(imageSrc);
  }, [webcamRef]);

  const [noteDepart, setNoteDepart] = useState(null);
  const [participation, setParticipation] = useState(null);
  const [avertissement, setAvertissement] = useState(null);
  const [bonus, setBonus] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    sessionService.loadUser().then((user) => {
      console.log("user");
      console.log(user);
      console.log(user._id);
      setUserId(user._id);
      setUser(user);
      getProfesseurData(user._id)
        .then((response) => {
          console.log("les infos prof");
          console.log(response.data);
          const professeur = response.data.data;
          setFirstname(professeur.firstname);
          setLastname(professeur.lastname);
          setCollege(professeur.college[0]);
          setAvertissement(professeur.avertissement);
          setBonus(professeur.bonus);
          setParticipation(professeur.participation);
          setNoteDepart(professeur.noteDepart);
          setEcoles(professeur.ecoles);
          setClasses(professeur.classes);
          setPhoto(professeur.photo);
          const initialSchoolId = professeur.college[0]._id;
          const initialClasses = professeur.ecoles.find(
            (ecole) => ecole._id === initialSchoolId
          ).classes;
          const newOptions = multiselectOptions;
          initialClasses.forEach((classe) => {
            const option = {
              label: classe.name,
              value: classe.name,
              _id: classe._id,
            };
            newOptions.push(option);
          });
          setMultiselectOptions(newOptions);
        })
        .finally(() => {
          setIsFetching(false);
        });

      setForm({
        firstname: sessionStorage.getItem("firstname"),
        lastname: sessionStorage.getItem("lastname"),
      });
    });
    // console.log(store.getState());
    // console.log(currentUser);
    // console.log("prof de la session:");
    // console.log(sessionStorage.professeurId);
    // console.log("id");
    // console.log(JSON.parse(sessionStorage.professeurId));
    // setUserId(JSON.parse(sessionStorage.professeurId));
    // setProfesseur(JSON.parse(sessionStorage.professeur));
    console.log("userId");
    console.log(userId);
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      console.log(selectedSchool);
      const newOptions = [];
      selectedSchool.classes.forEach((classe) => {
        const option = {
          label: classe.name,
          value: classe.name,
          _id: classe._id,
        };
        newOptions.push(option);
      });
      setMultiselectOptions(newOptions);
      setClasses([]);
    }
  }, [selectedSchool]);

  const handleClick = () => {
    alert("Mise à jour réussie !");
    navigate("/classes");
  };

  const handleFileChange = (e) => {
    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      console.log(e.target.files.length);

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    } else {
      setFile(null);
    }
  };

  const findFormErrors = () => {
    const { firstname, lastname } = form;

    var regName = /^[a-z ,.'-]+$/i;

    const newErrors = {};
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
    if (!college || college === "") newErrors.food = "select a food!";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // get our new errors
    const newErrors = findFormErrors();
    // Conditional logic:
    if (Object.keys(newErrors).length > 0) {
      // We got errors!
      setErrors(newErrors);
      console.log("errors");
      console.log(errors);
    } else if (college == "Choisir collège") {
      alert("Veuillez choisir un collège");
    } else {
      // No errors! Put any logic here for the form submission!
      setIsSubmitting(true);
      console.log("avertissement");
      console.log(avertissement);
      saveProfesseur();
    }
  };

  const saveProfesseur = () => {
    // setCurrentUser({firstname: firstname, lastname: lastname, ...professeur} );
    console.log("les classes sont");
    console.log(classes);

    let credentials = {
      professeurId: userId,
      newFirstname: firstname,
      newLastname: lastname,
      newCollege: college,
      newPhoto: photo,
      newNoteDepart: noteDepart,
      newParticipation: participation,
      newAvertissement: avertissement,
      newBonus: bonus,
      newClasses: classes,
    };

    let sessionStorageValues = {
      firstname: firstname,
      lastname: lastname,
      college: college,
      classes: classes,
      photo: photo,
      noteDepart: noteDepart,
      participation: participation,
      avertissement: avertissement,
      bonus: bonus,
    };

    let newUserFields = {
      ...user,
      ...sessionStorageValues,
      //What if both the object has same key, it simply merge the last objects value and have only one key value.
    };

    sessionService.saveUser(newUserFields).then((newUser) => {
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
    navigate("/dashboard");
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
    if (selectedPicture) {
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
                console.log("on a accès?");
                console.log(response.data);
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
        <h2> Utilisateur</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFirstname">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrer votre nom"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
                setField("lastname", e.target.value);
              }}
              isInvalid={!!errors.lastname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastname">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrer votre prénom"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
                setField("firstname", e.target.value);
              }}
              isInvalid={!!errors.firstname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCollege">
            <Form.Label>Collège</Form.Label>
            <DropdownButton
              id="dropdown-schools"
              title={college.name}
              style={{ marginBottom: "1rem" }}
            >
              {ecoles.map((ecole, index) => (
                <Dropdown.Item
                  key={`${index}`}
                  onClick={(e) => {
                    setCollege(ecole);
                    setSelectedSchool(ecole);
                  }}
                >
                  {ecole.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="formCollege"
            style={{ marginBottom: "2rem" }}
          >
            <Form.Label>Ecoles</Form.Label>
            <MultiSelect
              options={multiselectOptions}
              value={classes}
              //setSelectedSchool.classes
              onChange={(selectedItems) => {
                setClasses(selectedItems);
              }}
              labelledBy="Select"
            />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log(e);
                setSelectedPicture(e.target.files[0]);
              }}
            />
            {photo && (
              <div
                style={{
                  marginTop: "2rem",
                  width: "400px"
                }}
              >
                <img
                  src={photo}
                  style={{
                    objectFit: "contain",
                    height: "250px",
                    maxWidth: "100%"
                  }}
                />
              </div>
            )}
            {/* <img src={`${backendUrl}/images/af2ed533f2d98d08819dd1b108a723ea`}></img> */}
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
          </Form.Group>

          <h2 style={{ marginTop: "2rem" }}> Notation</h2>
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

          {/* <h2 style={{ marginTop: "2rem" }}>Base élève</h2>
        <Form.Group
          controlId="formFile"
          className="mb-3"
          style={{ marginTop: "2rem" }}
        >
          <Form.Label>Mettre à jour la base</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group> */}
          {!isSubmitting && (
            <Button variant="primary" type="submit">
              Sauvegarder
            </Button>
          )}
          {isSubmitting && (
            <ThreeDots color={colors.theme} height={49} width={100} />
          )}
        </Form>
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
      </div>
    );
  }
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(Settings);
