import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import CounterInput from "react-counter-input";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Counter from "../../utils/Counter/Counter";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import store from "../../auth/store";
import { AuthContext, useAuth } from "../../auth/context/AuthContext";

// auth & redux
import { connect } from "react-redux";
import { editProfesseur, logoutUser } from "../../auth/actions/userActions";
import { colors } from "../../utils/Styles";
import { ThreeDots } from "react-loader-spinner";

const allowedExtensions = ["csv", "xls"];

const Settings = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const [professeur, setProfesseur] = useState(store.getState().session.user);

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [college, setCollege] = useState("Choisir collège");
  const [photo, setPhoto] = useState(null);
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
    console.log(store.getState());
    console.log(currentUser);
    console.log(sessionStorage.getItem("username"));
    console.log(sessionStorage.getItem("isAdmin"));
    console.log(sessionStorage.getItem("firstname"));
    console.log(sessionStorage.getItem("lastname"));
    setFirstname(sessionStorage.getItem("firstname"));
    setLastname(sessionStorage.getItem("lastname"));

    setForm({
      firstname: sessionStorage.getItem("firstname"),
      lastname: sessionStorage.getItem("lastname"),
    });
  }, []);

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
    if (!regName.test(lastname))
      newErrors.lastname = "Veuillez saisir un nom correct";
    if (!regName.test(firstname))
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
      alert("Thank you for your feedback!");
      setIsSubmitting(true);
      saveProfesseur();
    }
  };

  const saveProfesseur = () => {
    let credentials = {
      professeur: professeur,
      newFirstname: firstname,
      newLastname: lastname,
      newCollege: college,
      newPhoto: photo,
      newNoteDepart: noteDepart,
      newParticipation: participation,
      newAvertissement: avertissement,
      newBonus: bonus,
    }
    editProfesseur(credentials, navigate);
  }

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
    console.log('valeur actuelle')
    console.log(value);
    setNoteDepart(value.current);
  }
  const handleParticipation = (value) => {
    console.log('valeur actuelle')
    console.log(value);
    setParticipation(value.current);
  }
  const handleAvertissement = (value) => {
    console.log('valeur actuelle')
    console.log(value);
    setAvertissement(value.current);
  }
  const handleBonus = (value) => {
    console.log('valeur actuelle')
    console.log(value);
    setBonus(value.current);
  }

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
        <Form.Group className="mb-3" controlId="formLastname">
          <Form.Label>Collège</Form.Label>
          <DropdownButton
            id="dropdown-basic-button"
            title={college}
            style={{ marginBottom: "1rem" }}
          >
            <Dropdown.Item onClick={(e) => setCollege(e.target.textContent)}>
              Soualiga
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setCollege(e.target.textContent)}>
              Mont des Accords
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setCollege(e.target.textContent)}>
              Autre...
            </Dropdown.Item>
          </DropdownButton>
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Photo</Form.Label>
          <Form.Control type="file" />
          {photo && <img src={photo} />}
          {showCamera && (
            <div>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
              <br />
              <Button onClick={capture}>Capturer</Button>
            </div>
          )}
          {!showCamera && (
            <Button
              style={{ marginTop: "0.5rem" }}
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
            <Counter min={9} max={20} value={10} delta={0.25} handleCounterValue={handleNoteDepart}></Counter>
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
            <Counter min={0} max={20} value={0} delta={0.25} handleCounterValue={handleParticipation}></Counter>
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
            <Counter min={-20} max={0} value={0} delta={0.25} handleCounterValue={handleAvertissement}></Counter>
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
            <Counter min={0} max={20} value={0} delta={0.25} handleCounterValue={handleBonus}></Counter>
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
          <Button
            variant="primary"
            type="submit"
            // disabled={!file}
            // onClick={() => {
            //   handleClick();
            // }}
          >
            Sauvegarder
          </Button>
        )}
        {isSubmitting && (
          <ThreeDots color={colors.theme} height={49} width={100} />
        )}
      </Form>
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(Settings);
