import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { ThreeDots, TailSpin } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { colors } from "../../utils/Styles.js";
import { getProfesseurClasses } from "../../auth/actions/userActions.js";
import Switch from "../../utils/Switch/Switch.js";
import AuthContext from "../../auth/context/AuthContext.js";

const Evaluations = ({ handleNavbar }) => {
  // NOUVELLE FACON DE FAIRE
  const { user, isFetching, setIsFetching } = useContext(AuthContext);
  let currentUser = user ? user : localStorage.getItem("userData");

  let navigate = useNavigate();
  const location = useLocation();
  const [evaluations, setEvaluations] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const fromLogin = localStorage.getItem("fromLogin");
  console.log("fromLogin", fromLogin);
  console.log(fromLogin == "true");

  let evaluationsTest = [
    {
      id: 1,
      name: "Algèbre",
      competences: ["Calcul", "Expression littérale"],
      classes: ["6EME4", "5EME3", "5EME5"],
      duree: "1 heure",
      creationDate: new Date(2023, 10, 20),
      questions: [
        {
          id: 1,
          name: "Que veut dire développer ?",
          réponses: [],
          options: [],
        },
        {
          id: 2,
          name: "Que veut dire réduire ?",
          réponses: [],
          options: [],
        },
      ],
    },
    {
      id: 1,
      name: "Littérature",
      competences: ["Lire"],
      classes: ["6EME4", "6EME6"],
      duree: "2 heures",
      creationDate: new Date(2023, 11, 1),
      questions: [
        {
          id: 1,
          name: "Qui a écrit Les Misérables ?",
          réponses: [],
          options: [],
        },
      ],
    },
  ];

  const goToClass = (selectedClass) => {
    console.log("selectedClass");
    console.log(selectedClass);
    localStorage.setItem("selectedClasse", JSON.stringify(selectedClass));
    let classeName = selectedClass.value;
    const classeId = selectedClass._id;
    classeName = classeName.replace(/\s/g, "");

    let path = `${location.pathname}/${classeId}`;
    // Supprimer une barre oblique en double s'il y en a une
    path = path.replace(/\/\//g, "/");
    navigate(`${path}`);
  };

  useEffect(() => {
    console.log("to be defined/////");
    // setIsFetching(true);
    getProfesseurClasses(currentUser?._id)
      .then((response) => {
        setEvaluations(evaluationsTest);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const goToEditEvaluation = (evaluation) => {
    const evaluationId = evaluation.id;

    localStorage.setItem("selectedEvaluation", JSON.stringify(evaluation));
    let path = `${location.pathname}/${evaluationId}`;
    // Supprimer une barre oblique en double s'il y en a une
    path = path.replace(/\/\//g, "/");
    navigate(`${path}`);
  };

  const goToEvaluationSessions = (evaluation) => {
    const evaluationId = evaluation.id;

    localStorage.setItem("selectedEvaluation", JSON.stringify(evaluation));
    let path = `${location.pathname}/${evaluationId}/sessions`;
    // Supprimer une barre oblique en double s'il y en a une
    path = path.replace(/\/\//g, "/");
    navigate(`${path}`);
  };

  const parseDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Ajouter 1 car les mois commencent à partir de 0
    const day = date.getDate();
    
    // Afficher la date au format "DD/MM/YYYY"
    return `${day}/${month}/${year}`;
  }

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
      <>
        <h1
          id="evaluations-title"
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Mes évaluations
        </h1>
        {Array.isArray(evaluations) && evaluations?.length > 0 && (
          <div className="m-4">
            {evaluations.map((evaluation, index) => (
              <Row className="mt-3">
                <Col>
                  <Card
                    style={{
                      boxShadow: "1px 1px 8px rgba(0, 0, 0, 0.6)",
                      // border: "1px solid",
                    }}
                  >
                    <Card.Body className="text-center">
                      <Card.Title style={{ fontSize: "1.6rem" }}>
                        {evaluation.name}
                      </Card.Title>
                      <Card.Text>
                        {evaluation?.competences?.length == 1 && (
                          <div>
                            Compétence: &nbsp;
                            <b>{evaluation?.competences?.join(", ")}</b>
                          </div>
                        )}
                        {evaluation?.competences?.length > 1 && (
                          <div>
                            Compétences: &nbsp;
                            <b>{evaluation?.competences?.join(", ")}</b>
                          </div>
                        )}
                        {evaluation?.classes?.length == 1 && (
                          <div>
                            Classe: &nbsp;
                            <b>{evaluation?.classes?.join(", ")}</b>
                          </div>
                        )}
                        {evaluation?.classes?.length > 1 && (
                          <div>
                            Classes: &nbsp;
                            <b>{evaluation?.classes?.join(", ")}</b>
                          </div>
                        )}
                        <div>
                          Durée: &nbsp;<b>{evaluation?.duree}</b>
                        </div>
                        {evaluation?.questions?.length == 1 && (
                          <div>
                            Nombre: &nbsp;<b>1 question</b>
                          </div>
                        )}
                        {evaluation?.questions?.length > 1 && (
                          <div>
                            Nombre: &nbsp;
                            <b> {evaluation?.questions?.length} questions</b>
                          </div>
                        )}
                        <div className="me-4">
                          Créée le: &nbsp;
                          <b>{parseDate(evaluation?.creationDate)}</b>
                        </div>
                      </Card.Text>
                      <div className="d-inline-flex">
                        <Button
                          className="me-4"
                          onClick={() => goToEvaluationSessions(evaluation)}
                        >
                          Gérer sessions
                        </Button>
                        <Button
                          className="me-4"
                          variant="secondary"
                          onClick={() => goToEditEvaluation(evaluation)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => {
                            goToEditEvaluation(evaluation);
                          }}
                        >
                          Apercu du test
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ))}
            <div className="mt-4 text-center">
              <Button
                onClick={() => {
                  navigate("/evaluation-create");
                }}
              >
                Nouvelle évaluation
              </Button>
            </div>
          </div>
        )}
        {(!evaluations || evaluations?.length == 0) && (
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
                Vous n'avez pas d'évaluations enregistrées sur votre profil{" "}
                <br />
                <center>
                  {" "}
                  <Alert.Link href="/evaluation-create">
                    Créer une évaluation
                  </Alert.Link>
                </center>
              </Alert>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default Evaluations;
