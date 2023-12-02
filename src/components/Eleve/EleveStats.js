import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { FaArrowLeft } from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getElevesData } from "../../auth/actions/userActions";
import { TailSpin } from "react-loader-spinner";
import { colors } from "../../utils/Styles";
import AnimatedCountup from "../../utils/AnimatedCountup/AnimatedCountup";
import AuthContext from "../../auth/context/AuthContext";

const EleveStats = () => {
  // NOUVELLE FACON DE FAIRE
  const { user, isFetching, setIsFetching, logout } = useContext(AuthContext);
  let currentUser = user ? user : localStorage.getItem("userData");

  let dataTest = [];
  let { studentId } = useParams();
  let navigate = useNavigate();
  console.log("studentId");
  console.log(studentId);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [eleve, setEleve] = useState(null);
  const [participations, setParticipations] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [nbSeances, setNbSeances] = useState(null);
  const [sumParticipations, setSumParticipations] = useState(0);
  const [sumBonus, setSumBonus] = useState(0);
  const [sumAvertissements, setSumAvertissements] = useState(0);
  const [avertissements, setAvertissements] = useState(null);
  const [discipline, setDiscipline] = useState(null);

  useEffect(() => {
    localStorage.setItem("fromLogin", JSON.stringify(false));
    setIsFetching(true);
      console.log("mon utilisateur");
      console.log(currentUser);
      setDiscipline(currentUser?.discipline);
      getElevesData(studentId)
        .then((response) => {
          console.log("infos eleve");
          console.log(response);
          if (response.status === 200 && response.data.status === "SUCCESS") {
            const eleve = response.data.data;
            setFirstname(eleve.firstname);
            setLastname(eleve.lastname);
            setEleve(eleve);
            setParticipations(eleve.participations);
            setBonus(eleve.bonus);
            setAvertissements(eleve.avertissements);
          } else {
            navigate("/classes");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          // setIsFetching(false);
        });
  }, []);

  useEffect(() => {
    if (eleve && Array.isArray(participations)) {
      console.log("eleves[0]");
      console.log(participations);
      console.log(discipline);
      // console.log(eleves[0].participation);
      const numberOfSeances = participations.find(
        (matiere) => matiere.matière == discipline.name
      ).nbSeances;
      setNbSeances(
        participations.find((matiere) => matiere.matière == discipline.name)
          .nbSeances
      );
      let table = [];
      for (var i = 0; i < numberOfSeances; i++) {
        table.push({
          name: `Séance ${i + 1}`,
          Participation: participations.find(
            (matiere) => matiere.matière == discipline.name
          ).notes[i],
          Bonus: bonus.find((matiere) => matiere.matière == discipline.name)
            .notes[i],
          Avertissement: avertissements.find(
            (matiere) => matiere.matière == discipline.name
          ).notes[i],
        });
      }
      setGraphData(table);
      console.log("table");
      console.log(table);

      setSumAvertissements(
        avertissements
          .find((matiere) => matiere.matière == discipline.name)
          .notes.reduce((sum, x) => sum + x)
      );
      setSumBonus(
        bonus
          .find((matiere) => matiere.matière == discipline.name)
          .notes.reduce((sum, x) => sum + x)
      );
      setSumParticipations(
        participations
          .find((matiere) => matiere.matière == discipline.name)
          .notes.reduce((sum, x) => sum + x)
      );
    }
  }, [eleve]);

  useEffect(() => {
    if (graphData.length > 0) {
      console.log("graphData");
      console.log(graphData);
      setIsFetching(false);
      console.log("sumParticipations");
      console.log(sumParticipations);
    }
  }, [graphData]);

  const data = [
    {
      name: "Séance 1",
      Participation: 5,
      Bonus: 2,
      Avertissement: 0,
    },
    {
      name: "Séance 2",
      Participation: 13,
      Bonus: 2,
      Avertissement: 4,
    },
    {
      name: "Séance 3",
      Participation: 20,
      Bonus: 3,
      Avertissement: 8,
    },
    {
      name: "Séance 4",
      Participation: 7,
      Bonus: 7,
      Avertissement: 7,
    },
    {
      name: "Séance 5",
      Participation: 0,
      Bonus: 0,
      Avertissement: 0,
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
      <>
        <Row className="mt-3">
          <Col xs="auto">
            <Button
              variant="link"
              onClick={() => {
                navigate(-1); //go back to previous page
              }}
            >
              <FaArrowLeft /> Retour
            </Button>
          </Col>

          <Col className="text-center">
            <h1
              id="student-stats"
              style={{
                marginBottom: "2rem",
                marginLeft: "auto",
                marginRight: "6rem", // Vous pouvez ajuster cette valeur pour déplacer le titre horizontalement
              }}
            >
              Statistiques de {firstname} {lastname} en {discipline?.name}
            </h1>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="m-3">
              <Accordion defaultActiveKey="0" alwaysOpen={true}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="fs-2">
                    <div className="fs-2">En graphique</div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div id="student-graphique-part">
                      {/* <div className="mt-5" style={{ fontSize: "2rem" }}>
                  {" "}
                  En graphique{" "}
                </div> */}
                      <div>
                        <Row className="mt-1 mb-3 text-center">
                          <Col>
                            <Row
                              style={{
                                marginBottom: "2rem",
                                marginTop: "2rem",
                              }}
                            >
                              <Col>
                                <div>
                                  <strong>Participations</strong>
                                  <center>
                                    <p
                                      style={{
                                        borderRadius: "50%",
                                        backgroundColor: "#82ca9d",
                                        marginTop: "1rem",
                                        width: "5rem",
                                        height: "5rem",
                                        textAlign: "center",
                                        display: "table-cell",
                                        verticalAlign: "middle",
                                        fontSize: "2rem",
                                      }}
                                    >
                                      {sumParticipations}
                                    </p>
                                  </center>
                                </div>
                              </Col>
                              <Col>
                                <div>
                                  <strong>Bonus</strong>
                                  <center>
                                    <p
                                      style={{
                                        borderRadius: "50%",
                                        backgroundColor: "#8884d8",
                                        marginTop: "1rem",
                                        width: "5rem",
                                        height: "5rem",
                                        textAlign: "center",
                                        display: "table-cell",
                                        verticalAlign: "middle",
                                        fontSize: "2rem",
                                      }}
                                    >
                                      {sumBonus}
                                    </p>
                                  </center>
                                </div>
                              </Col>
                              <Col>
                                <div>
                                  <strong>Avertissements</strong>
                                  <center>
                                    <p
                                      style={{
                                        borderRadius: "50%",
                                        backgroundColor: "#c29825",
                                        marginTop: "1rem",
                                        width: "5rem",
                                        height: "5rem",
                                        textAlign: "center",
                                        display: "table-cell",
                                        verticalAlign: "middle",
                                        fontSize: "2rem",
                                      }}
                                    >
                                      {sumAvertissements}
                                    </p>
                                  </center>
                                </div>
                              </Col>
                            </Row>
                            {Array.isArray(participations) &&
                            graphData.length > 0 ? (
                              <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                  width={500}
                                  height={300}
                                  data={graphData}
                                  margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="Participation"
                                    stroke="#82ca9d"
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="Bonus"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="Avertissement"
                                    stroke="#c29825"
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            ) : null}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                  eventKey="1"
                  id="student-graphique-accordion-item"
                >
                  <Accordion.Header>
                    <div className="fs-2">En chiffres</div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div id="student-numbers-part">
                      {/* <div
                  className="mb-5"
                  style={{ fontSize: "2rem", marginTop: "9rem" }}
                >
                  {" "}
                  En chiffres{" "}
                </div> */}
                      <div className="m-3">
                        <Row>
                          <OverlayTrigger
                            trigger={["click", "hover", "focus"]}
                            overlay={
                              <Popover id="popover-competences">
                                <Popover.Header as="h3">
                                  Compétences
                                </Popover.Header>
                                <Popover.Body>
                                  {firstname} {lastname} a déjà validé&nbsp;
                                  <strong>Se repérer dans l'espace</strong>
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <Col className="mb-3">
                              <AnimatedCountup
                                countUp="1"
                                className="h-100"
                                label="Nb compétences validées"
                              />
                            </Col>
                          </OverlayTrigger>
                          <OverlayTrigger
                            trigger={["click", "hover", "focus"]}
                            overlay={
                              <Popover id="popover-participation">
                                <Popover.Header as="h3">
                                  Participation
                                </Popover.Header>
                                <Popover.Body>
                                  {firstname} {lastname} a le + participé&nbsp;
                                  <strong>lors de la séance n°1.</strong>
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <Col className="mb-3">
                              <AnimatedCountup
                                countUp={4}
                                className="h-100"
                                label="Participation moy./séance"
                              />
                            </Col>
                          </OverlayTrigger>
                          <Col className="mb-3">
                            <AnimatedCountup
                              countUp={9}
                              className="h-100"
                              label="Participation totale"
                            />
                          </Col>
                          <Col className="mb-3">
                            <AnimatedCountup
                              countUp={75}
                              unit="%"
                              className="h-100"
                              label="Ratio particip./avert."
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <AnimatedCountup
                              className="mt-3"
                              countUp={17.5}
                              unit="/ 20"
                              label="Moy. évaluations écrites"
                            />
                          </Col>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={31} />
                          </Col>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={45} />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Card>
                  <Card.Header>
                    <Button
                      className="m-1 fs-4"
                      variant="link"
                      onClick={() => navigate("/pending")}
                    >
                      Voir le livret
                    </Button>
                  </Card.Header>
                </Card>
              </Accordion>
              {/* <div className="text-center">
                <Button className="m-3" onClick={() => navigate("/pending")}>
                  Voir le livret
                </Button>
              </div> */}
            </div>
          </Col>
        </Row>
      </>
    );
  }
};

export default EleveStats;
