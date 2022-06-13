import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Counter from "../../utils/Counter";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const allowedExtensions = ["csv", "xls"];

export default function EleveEdit() {
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState("");
  const webcamRef = React.useRef(null);
  const [showModal, setShowModal] = useState(false);

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

  const confirmDelete = () => {
    setShowModal(true);
  };

  const deleteStudent = () => {
    navigate("/classes");
  }

  return (
    <div style={{ margin: "2rem" }}>
      <h2 style={{ marginBottom: "2rem" }}> Informations Elève</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formFirstname">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entrer le nom de l'élève"
            defaultValue={"Eleve"}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formLastname">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entrer le prénom de l'élève"
            defaultValue={"2"}
          />
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
              variant="outline-primary"
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
        <Button
          style={{ marginTop: "2rem" }}
          variant="primary"
          type="submit"
          disabled={!file}
          onClick={() => {
            handleClick();
          }}
        >
          Sauvegarder
        </Button>
        <Button
          style={{ marginTop: "2rem", marginLeft: '1rem' }}
          variant="outline-danger"
          onClick={() => confirmDelete()}
        >
          Supprimer l'élève
        </Button>{" "}
        <Modal show={showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>Etes vous sur de vouloir supprimer l'élève ?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteStudent();
              }}
            >
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </div>
  );
}
