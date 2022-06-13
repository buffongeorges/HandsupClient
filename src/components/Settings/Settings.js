import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CounterInput from "react-counter-input";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Counter from "../../utils/Counter";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const allowedExtensions = ["csv", "xls"];

export default function Settings() {
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState("");
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    setShowCamera(false);
    setPhoto(imageSrc);
  }, [webcamRef]);
  let navigate = useNavigate();

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

  return (
    <div style={{ margin: "2rem" }}>
    
      <h2> Utilisateur</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formFirstname">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entrer votre nom"
            defaultValue={"Grandemange"}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formLastname">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entrer votre prénom"
            defaultValue={"Antoine"}
          />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Photo</Form.Label>
          <Form.Control type="file" />
          {photo && (<img src={photo}/>)}
          {showCamera && (
        <div>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <br/><Button onClick={capture}>Capturer</Button>
        </div>
      )}
      {!showCamera && (
        <Button style={{marginTop: '0.5rem'}}
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
            <Counter min={9} max={20} value={10} delta={0.5}></Counter>
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
            <Counter min={0} max={20} value={0} delta={0.5}></Counter>
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
            <Counter min={0} max={20} value={0} delta={0.5}></Counter>
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
            <Counter min={0} max={20} value={0} delta={0.5}></Counter>
          </div>
        </div>

        <h2 style={{ marginTop: "2rem" }}>Base élève</h2>
        <Form.Group
          controlId="formFile"
          className="mb-3"
          style={{ marginTop: "2rem" }}
        >
          <Form.Label>Mettre à jour la base</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={!file}
          onClick={() => {
            handleClick();
          }}
        >
          Sauvegarder
        </Button>
      </Form>
    </div>
  );
}
