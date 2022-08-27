import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Webcam from "react-webcam";
import {
  deleteEleve,
  editEleve,
  getElevesData,
  getS3SecureURL,
  uploadImageToS3,
} from "../../auth/actions/userActions";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import { colors } from "../../utils/Styles";

// auth & redux
import { connect } from "react-redux";

const allowedExtensions = ["csv", "xls"];

const EleveEdit = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [file, setFile] = useState("");
  const webcamRef = React.useRef(null);
  const [showModalSave, setShowModalSave] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isFetching, setIsFetching] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [college, setCollege] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [classe, setClasse] = useState(null);
  const [birthday, setBirthday] = useState(null);

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  const [selectedPicture, setSelectedPicture] = useState(null);

  let { eleveId } = useParams();

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

  let navigate = useNavigate();

  useEffect(() => {
    setIsFetching(true);
    getElevesData(eleveId)
      .then((response) => {
        if (response.status === 200 && response.data.status === "SUCCESS") {
          console.log("infos eleve");
        console.log(response);
        const eleve = response.data.data;
        setFirstname(eleve.firstname);
        setLastname(eleve.lastname);
        setPhoto(eleve.photo);
        setCollege(eleve.college.name);
        setClasse(eleve.classe);
        const birthday = new Date(eleve.dateOfBirth).toLocaleDateString(
          "en-CA"
        );
        setBirthday(birthday);

        setForm({
          firstname: eleve.firstname,
          lastname: eleve.lastname,
          birthday: birthday,
        });
      }
      else {
        navigate("/classes")
      }
    }) 
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

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
    setShowModalDelete(true);
  };

  const deleteStudent = () => {
    setIsSubmitting(true);
    setIsFetching(true);
    deleteEleve(eleveId)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsSubmitting(true);
        setIsFetching(true);
        handleCloseModalDelete(false);
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

  const findFormErrors = () => {
    const { firstname, lastname } = form;

    var regName = /^[a-z ,.'-]+$/i;

    const newErrors = {};

    //birtdhday empty
    if (!birthday)
      newErrors.birthday = "Veuillez choisir une date de naissance";
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
      setShowModalSave(true);
      saveEleve();
    }
  };

  const saveEleve = () => {
    let studentData = {
      eleveId: eleveId,
      newFirstname: firstname,
      newLastname: lastname,
      college: college,
      classe: classe,
      newBirthday: new Date(birthday).toISOString(),
      newPhoto: photo,
    };

    console.log("studentData");
    console.log(studentData);

    // let newUserFields = {
    //   ...user,
    //   ...sessionStorageValues,
    //   //What if both the object has same key, it simply merge the last objects value and have only one key value.
    // };

    editEleve(studentData).then(async (response) => {
      console.log("réponse de edit");
      console.log(response);
      console.log("url de la photo du prof");
      console.log(photo);
      if (response.status === 200 && response.data.status === "SUCCESS") {
        setShowModalSave(true);
      }
      else {
        navigate("/classes")
      }
    });
  };

  const handleDateChange = (date) => {
    console.log(date);
    const newStudentBirthday = date;
    setBirthday(new Date(newStudentBirthday).toLocaleDateString("en-CA"));
  };

  const handleCloseModalSave = () => {
    setShowModalSave(false);
    navigate(`/classes/${classe._id}`);
  };

  const handleCloseModalDelete = () => {
    setShowModalDelete(false);
    navigate(`/classes/${classe._id}`);
  };

  const hideModalDelete = () => {
    setShowModalDelete(false);
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
      <div style={{ margin: "2rem" }}>
        <h2 style={{ marginBottom: "2rem" }}> Informations Elève</h2>
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
          <Form.Group className="mb-3" controlId="formClasse">
            <Form.Label>Classe</Form.Label>
            <Form.Control type="text" value={classe?.name} disabled={true} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCollège">
            <Form.Label>Collège</Form.Label>
            <Form.Control type="text" value={college} disabled={true} />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log(e);
                setShowCamera(false);
                setSelectedPicture(e.target.files[0]);
              }}
            />
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

            <Form.Group
              className="mb-3"
              controlId="formBirthday"
              style={{ marginTop: "2rem" }}
            >
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => {
                  handleDateChange(e.target.value);
                  setField("birthday", e.target.value);
                }}
                isInvalid={!!errors.birthday}
              />
              <Form.Control.Feedback type="invalid">
                {errors.birthday}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Group>
          {!isSubmitting && (
            <Button
              variant="primary"
              type="submit"
              style={{ marginTop: "2rem" }}
            >
              Sauvegarder
            </Button>
          )}
          {isSubmitting && (
            <ThreeDots
              color={colors.theme}
              height={49}
              width={100}
              style={{ marginTop: "2rem" }}
            />
          )}
          <Button
            style={{ marginTop: "2rem", marginLeft: "1rem" }}
            variant="outline-danger"
            onClick={() => confirmDelete()}
          >
            Supprimer l'élève
          </Button>{" "}
          <Modal show={showModalDelete} onHide={hideModalDelete}>
            <Modal.Header closeButton>
              <Modal.Title>Suppression</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Etes vous sur de vouloir supprimer l'élève ?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModalDelete(false);
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

        <Modal
          show={showModalSave}
          onHide={handleCloseModalSave}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Informations mises à jour</Modal.Title>
          </Modal.Header>
          <Modal.Body>Vos modifications ont été bien sauvegardées.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModalSave}>
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

export default connect(mapStateToProps)(EleveEdit);
