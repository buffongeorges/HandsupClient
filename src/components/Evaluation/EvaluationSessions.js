import React, { useRef } from "react";
import { useContext } from "react";
import AuthContext from "../../auth/context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { colors } from "../../utils/Styles";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import fr from 'date-fns/locale/fr';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const EvaluationSessions = () => {
  const { user, isFetching, setIsFetching } = useContext(AuthContext);
  const [evaluation, setEvaluation] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [endEvaluationDate, setEndEvaluationDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  let listGroupRef = useRef();

  useEffect(() => {
    // setIsFetching(true);
    setEvaluation(evaluationSample);
  }, []);

  let evaluationSample = {
    id: 1,
    name: "Algèbre",
    competences: ["Calcul", "Expression littérale"],
    // classes: ["6EME4", "5EME3", "5EME5"],
    classes: [
      {
        id: 1,
        name: "6EME4",
        etat: "Créé",
        endDate: null,
      },
      {
        id: 2,
        name: "5EME3",
        etat: "Démarré",
        endDate: new Date(2023, 10, 29, 12, 0),
      },
      {
        id: 3,
        name: "5EME5",
        etat: "Terminé",
        endDate: new Date(2023, 10, 30),
      },
      {
        id: 4,
        name: "5EME6",
        etat: "Corrigé",
        endDate: new Date(2023, 10, 28),
      },
    ],
    duree: "1 heure",
    questions: [
      {
        id: 1,
        name: "Que veut dire développer ?",
        réponses: [],
        options: [],
      },
    ],
  };

  const parseDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ajouter 1 car les mois commencent à partir de 0
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Afficher la date au format "DD/MM/YYYY"
    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}:${seconds}`,
    };
  };

  const handleDateChange = (date) => {
    console.log("date");
    console.log(date);
    console.log('selectedClasse')
    console.log(selectedClasse)
    setEndEvaluationDate(date);
    let evaluationData = { ...evaluation };
    const classeToUpdateIndex = evaluationData?.classes.findIndex(
      (classe) => classe.id === selectedClasse.id
    );
    evaluationData.classes[classeToUpdateIndex].endDate = date;
    console.log('evaluationData')
    console.log(evaluationData)
    // setEvaluation(evaluationData);
    setCalendarOpen(false);
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
      <>
        <h1
          id="evaluation-title"
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {evaluation?.name}
        </h1>
        <div className="m-4">
          <div style={{ fontSize: "1.7rem" }}>Sessions par classe</div>
          <ListGroup id="classes-session" className="mt-4">
            {evaluation &&
              Array.isArray(evaluation?.classes) &&
              evaluation?.classes?.map((classe, index) => (
                <ListGroup.Item style={{ marginRight: "4rem" }} key={`list-group${index}`} ref={listGroupRef}>
                  <Row className="my-2">
                    <Col>
                      <div className="me-4">
                        Classe: &nbsp;<b>{classe.name}</b>
                      </div>
                      <div className="me-4">
                        Etat de l'évaluation: &nbsp;
                        {classe?.etat === "Créé" && (
                          <b style={{ color: "grey" }}>{classe.etat}</b>
                        )}
                        {classe?.etat === "Démarré" && (
                          <>
                            <b style={{ color: "blue" }}>{classe.etat}</b>
                            <div>
                              Fermeture automatique le: <br />
                              <b>
                                {parseDate(classe?.endDate)?.date} à{" "}
                                {parseDate(classe?.endDate)?.time}
                              </b>
                            </div>
                          </>
                        )}
                        {classe?.etat === "Terminé" && (
                          <>
                            <b style={{ color: "green" }}>{classe.etat}</b>
                            <div>
                              Faite le: &nbsp;{" "}
                              <b>{parseDate(classe?.endDate)?.date}</b>
                            </div>
                          </>
                        )}
                        {classe?.etat === "Corrigé" && (
                          <>
                            <b style={{ color: "red" }}>{classe.etat}</b>
                            <div>
                              Faite le: &nbsp;{" "}
                              <b>{parseDate(classe?.endDate)?.date}</b>
                            </div>
                          </>
                        )}
                      </div>
                    </Col>
                    <Col className="d-flex align-items-center">
                      <span>
                        {/* Plusieurs possibilités de boutons : en fonction de l'état de l'évaluation */}
                        {classe?.etat === "Créé" && (
                          <div className="d-inline-flex">
                            <Button
                              className="me-4"
                              onClick={() => {
                                setSelectedClasse(classe);
                                setShowModal(true);
                                setCalendarOpen(true);
                              }}
                            >
                              Commencer
                            </Button>
                          </div>
                        )}
                        {classe?.etat === "Démarré" && (
                          <div className="d-inline-flex">
                            <Button className="me-4">Terminer</Button>
                          </div>
                        )}
                        {classe?.etat === "Terminé" && (
                          <div className="d-inline-flex">
                            <Button className="me-4">Corriger</Button>
                            <Button variant="link">Rouvrir</Button>
                          </div>
                        )}
                        {classe?.etat === "Corrigé" && (
                          <div className="d-inline-flex">
                            <Button className="me-4">Notes</Button>
                            <Button variant="link">Voir correction</Button>
                          </div>
                        )}
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
          </ListGroup>
          <Modal show={showModal}>
            <Modal.Header
              closeButton
              onHide={() => {
                console.log("ouiiiii?");
                setShowModal(false);
              }}
            >
              <Modal.Title>
                Démarrer évaluation {selectedClasse?.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <>
                Quand doit se terminer l'évaluation pour {selectedClasse?.name}{" "}
                ?
                <DatePicker
                  open={calendarOpen}
                  
                  locale={fr}
                  onClickOutside={() => setCalendarOpen(false)}
                  onInputClick={() => setCalendarOpen(true)}
                  selected={endEvaluationDate}
                  onChange={(e) => handleDateChange(e)}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy HH:mm"
                  timeIntervals={30}
                />
              </>
            </Modal.Body>

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
                variant="primary"
                onClick={() => {
                  setShowModal(false);
                  setCalendarOpen(false);
                }}
              >
                Confirmer
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
    );
  }
};

export default EvaluationSessions;
