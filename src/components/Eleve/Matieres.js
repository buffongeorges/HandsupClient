import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ThreeDots, TailSpin } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { colors } from "../../utils/Styles.js";
import { getEleveMatiere } from "../../auth/actions/userActions.js";
import AuthContext from "../../auth/context/AuthContext.js";

const Matieres = ({ handleNavbar }) => {
  let navigate = useNavigate();
  const location = useLocation();

  // NOUVELLE FACON DE FAIRE
  const { user, logout } = useContext(AuthContext);
  let currentUser = user ? user : localStorage.getItem("userData");

  const [matieres, setMatieres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fromLogin = localStorage.getItem("fromLogin");
  // fromLogin permet d'avoir l'effet d'arriver sur une app
  // avec cette page temporaire de bienvenu avec l'icone Handsup
  console.log("fromLogin", fromLogin);
  console.log(fromLogin == "true");

  const goToMatiere = (selectedMatiere) => {
    console.log("selectedMatiere");
    console.log(selectedMatiere);
    // sessionStorage.setItem("selectedMatieree", JSON.stringify(selectedMatiere));
    let matiereName = selectedMatiere.value;
    const matiereId = selectedMatiere.id;
    // matiereName = matiereName.replace(/\s/g, "");

    // let updatedUserFields = {
    //   ...user,
    //   selectedMatiere: selectedMatiere,
    // };

    // console.log("updatedUserFields");
    // console.log(updatedUserFields);
    localStorage.setItem("selectedMatiere", JSON.stringify(selectedMatiere));
    let path = `${location.pathname}/${matiereId}`;
    // Supprimer une barre oblique en double s'il y en a une
    path = path.replace(/\/\//g, "/");
    navigate(`${path}`);
  };

  useEffect(() => {
    if (!currentUser) {
      logout().then(() => {
        // navigate("/login");
      });
    } else {
      const studentChemistry = currentUser?.matieres;
      try {
        if (Array.isArray(studentChemistry) && studentChemistry?.length > 0) {
          if (typeof handleNavbar === "function" && fromLogin == "true") {
            handleNavbar(false);
          }
          console.log("studentChemistry");
          console.log(studentChemistry);
          setMatieres(studentChemistry);
        } else {
          //if not call api for teacher matieres:
          getEleveMatiere(currentUser._id)
            .then((response) => {
              console.log(response.data);
              console.log("les matieres:");
              console.log(response.data.data);
              setMatieres(response.data.data);
            })
            .catch((error) => {
              console.log(error);
              logout();
            });
        }
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        if (fromLogin == "true") {
          setTimeout(() => {
            setIsLoading(false);
            if (typeof handleNavbar === "function") {
              handleNavbar(true);
            }
          }, 3000);
        }
      }
    }
  }, []);
  if (isLoading && fromLogin == "true") {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <img
            src={"/images/handsup.png"}
            style={{ maxWidth: "100%", maxHeight: "13%" }}
          />
          <img
            src={"/images/icone_handsup.png"}
            style={{ maxWidth: "100%", maxHeight: "13%", marginLeft: "1rem" }}
          />
        </div>
      </>
    );
  } else if (!isLoading || fromLogin == "false") {
    return (
      <>
        <Row className="text-center">
          <Col>
            <h1 className="m-3"> Bonjour {currentUser?.firstname}</h1>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
            <div className="lead m-3"> A quel cours vas-tu assister ?</div>
          </Col>
        </Row>

        {matieres && matieres?.length > 0 && (
          <div
            className="container"
            style={{
              textAlign: "center",
              position: "relative",
              justifyContent: "center",
              paddingTop: "2rem",
              paddingLeft: "2rem",
            }}
          >
            {/* <Container fluid> */}
            <div style={{ display: "inline-flex" }}>
              {matieres.map((matiere, index) => {
                return (
                  <div
                    style={{
                      marginBottom: "2rem",
                      marginRight: "2rem",
                    }}
                    key={index}
                  >
                    <Button onClick={() => goToMatiere(matiere)}>
                      {matiere.name}
                    </Button>
                  </div>
                );
              })}
            </div>
            {/* </Container> */}
          </div>
        )}
        {(!matieres || matieres?.length == 0) && (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              paddingBottom: "15rem",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <Alert key={"warning"} variant={"warning"}>
                Vous n'avez pas de matieres enregistrées pour votre classe.
                Veuillez vous rapprocher de vos professeurs.
              </Alert>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default Matieres;
