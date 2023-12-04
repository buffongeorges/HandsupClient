import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import Accordion from "react-bootstrap/Accordion";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { ThreeDots, TailSpin } from "react-loader-spinner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { colors } from "../../utils/Styles.js";
import { getProfesseurClasses } from "../../auth/actions/userActions.js";
import AnimatedCountup from "../../utils/AnimatedCountup/AnimatedCountup.js";
import Row from "react-bootstrap/esm/Row.js";
import Col from "react-bootstrap/esm/Col.js";
import Form from "react-bootstrap/Form";
import AuthContext from "../../auth/context/AuthContext.js";

const Statistics = ({ handleNavbar, userType }) => {
  // NOUVELLE FACON DE FAIRE
  const { user, isFetching, setIsFetching, logout } = useContext(AuthContext);
  let currentUser = user ? user : localStorage.getItem("userData");

  let navigate = useNavigate();
  const location = useLocation();
  let professeur = null;
  const [statistics, setStatistics] = useState([]);
  const [classes, setClasses] = useState([]);
  const [checkedClasses, setCheckedClasses] = useState([]);

  const [graphData, setGraphData] = useState([]);
  let sumAvertissements = 22;
  let sumBonus = 44;
  let sumParticipations = 111;
  const fromLogin = localStorage.getItem("fromLogin");
  console.log("fromLogin", fromLogin);
  console.log(fromLogin == "true");

  const data03 = [
    { name: "Geeksforgeeks", students: 20, color: "#0c9564" },
    { name: "Technical scripter", students: 10, color: "#8455ca" },
    { name: "Geek-i-knack", students: 8, color: "#af1546" },
  ];

  // 8455ca : violet
  // dbdae5 : gris
  // eb984b : jaune
  // af1546 : rouge
  // 525659 : gris
  // 0c9564 : vert

  const data04 = [
    { name: "Maitrise", students: 10, color: "#0c9564" },
    { name: "Acquis", students: 8, color: "#af1546" },
    { name: "ECA 2", students: 5, color: "#8455ca" },
    { name: "ECA 1", students: 5, color: "#eb984b" },
    { name: "Non acquis", students: 10, color: "#525659" },
  ];

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

  const table = [
    {
      name: "Séance 1",
      Participation: 1,
      Bonus: 0,
      Avertissement: 0,
    },
    {
      name: "Séance 2",
      Participation: 0,
      Bonus: 0,
      Avertissement: 0,
    },
  ];

  const goToClass = (selectedClass) => {
    console.log("selectedClass");
    console.log(selectedClass);
    localStorage.setItem("selectedClasse", JSON.stringify(selectedClass));
    let classeName = selectedClass.value;
    const classeId = selectedClass._id;
    classeName = classeName.replace(/\s/g, "");

    let updatedUserFields = {
      ...user,
      selectedClass: selectedClass,
    };

    console.log("updatedUserFields");
    console.log(updatedUserFields);
    let path = `${location.pathname}/${classeId}`;
// Supprimer une barre oblique en double s'il y en a une
path = path.replace(/\/\//g, "/");
    navigate(`${path}`);
  };

  useEffect(() => {
    console.log("to be defined/////");
    setGraphData(table);

      //if not call api for teacher classes:
      getProfesseurClasses(currentUser?._id)
        .then((response) => {
          console.log(response.data);
          console.log("les classes:");
          console.log(response.data.data.classes);
          setClasses(response.data.data.classes);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsFetching(false);
        });
  }, []);

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
          id="Statistics-title"
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Mes Stats
        </h1>
        <Row>
          <Col>
            <div className="m-3">
              <div>
                <Accordion defaultActiveKey="0" alwaysOpen={true}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <div className="fs-2">En graphique</div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div>
                        <Row className="mt-1">
                          <Col>
                            <Form>
                              <div className="mb-3 mx-2">
                                {Array.isArray(classes)
                                  ? classes.map((classe, index) => (
                                      <Form.Check
                                        inline={true}
                                        type="checkbox"
                                        id={`inline-${classe.label}-${index}`}
                                        label={`${classe.label}`}
                                        //   checked={
                                        //     setCheckedClasses &&
                                        //     setCheckedClasses._id == classe._id
                                        //   }
                                        onClick={() => {
                                          //   setShowDisciplineAlert(false);
                                          setCheckedClasses(classe);
                                        }}
                                      />
                                    ))
                                  : null}
                              </div>
                            </Form>
                            {/* <Row
                              style={{
                                marginBottom: "2rem",
                                marginTop: "2rem",
                              }}
                            >
                              <Col>
                                <div style={{ textAlign: "center" }}>
                                  <strong>Participations</strong>
                                  <center>
                                    <p
                                      style={{
                                        borderRadius: "50%",
                                        backgroundColor: "#82ca9d",
                                        marginTop: "1.5rem",
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
                                <div style={{ textAlign: "center" }}>
                                  <strong>Bonus</strong>
                                  <center>
                                    <p
                                      style={{
                                        borderRadius: "50%",
                                        backgroundColor: "#8884d8",
                                        marginTop: "1.5rem",
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
                                <div style={{ textAlign: "center" }}>
                                  <strong>Avertissements</strong>
                                  <center>
                                    <p
                                      style={{
                                        borderRadius: "50%",
                                        backgroundColor: "#c29825",
                                        marginTop: "1.5rem",
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
                            </Row> */}
                            <Row style={{ marginTop: "-6.5rem" }}>
                              <Col md="6" style={{ marginTop: "0px" }}>
                                <ResponsiveContainer
                                  width="100%"
                                  height={500}
                                  className="mb-5"
                                >
                                  <PieChart width={400} height={400}>
                                    <Pie
                                      data={data03}
                                      dataKey="students"
                                      outerRadius={130}
                                    >
                                      <Cell
                                        key={`cell-1-`}
                                        fill={data03[0].color}
                                      />
                                      <Cell
                                        key={`cell-2-`}
                                        fill={data03[1].color}
                                      />
                                      <Cell
                                        key={`cell-3-`}
                                        fill={data03[2].color}
                                      />
                                    </Pie>
                                  </PieChart>
                                  <div style={{ marginTop: "-6rem" }}>
                                    {" "}
                                    <Row>
                                      <Col className="d-inline-flex align-items-center justify-content-end">
                                        <span>
                                          <i
                                            className="fa-solid fa-pen-to-square"
                                            style={{ color: "#0c9564" }}
                                          ></i>
                                        </span>
                                      </Col>
                                      <Col>
                                        <span>
                                          <b
                                            className="fs-5"
                                            style={{ color: "#0c9564" }}
                                          >
                                            Participations
                                          </b>
                                        </span>
                                      </Col>
                                      <Col className="lead d-inline-flex align-items-center justify-content-start">
                                        <span
                                          style={{
                                            fontSize: "large",
                                            color: "#0c9564",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <b>20</b>
                                        </span>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col className="d-inline-flex align-items-center justify-content-end">
                                        <span>
                                          <i
                                            className="fa-solid fa-pen-to-square"
                                            style={{ color: "#0c9564af1546" }}
                                          ></i>
                                        </span>
                                      </Col>
                                      <Col>
                                        <span>
                                          <b
                                            className="fs-5"
                                            style={{ color: "#af1546" }}
                                          >
                                            Avertissements
                                          </b>
                                        </span>
                                      </Col>
                                      <Col className="lead d-inline-flex align-items-center justify-content-start">
                                        <span
                                          style={{
                                            fontSize: "large",
                                            color: "#af1546",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <b>8</b>
                                        </span>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col className="d-inline-flex align-items-center justify-content-end">
                                        <span>
                                          <i
                                            className="fa-solid fa-pen-to-square"
                                            style={{ color: "#8455ca" }}
                                          ></i>
                                        </span>
                                      </Col>
                                      <Col>
                                        <span>
                                          <b
                                            className="fs-5"
                                            style={{ color: "#8455ca" }}
                                          >
                                            Bonus
                                          </b>
                                        </span>
                                      </Col>
                                      <Col className="lead d-inline-flex align-items-center justify-content-start">
                                        <span
                                          style={{
                                            fontSize: "large",
                                            color: "#8455ca",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <b>10</b>
                                        </span>
                                      </Col>
                                    </Row>
                                  </div>

                                  {/* <div>
                                    <span>
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </span>
                                    <span>Participations</span>
                                    <span>660</span>
                                  </div> */}
                                </ResponsiveContainer>
                              </Col>
                              <Col md="6">
                                <ResponsiveContainer
                                  width="100%"
                                  height={500}
                                  className="mb-5"
                                >
                                  <PieChart width={400} height={400}>
                                    <Pie
                                      data={data04}
                                      dataKey="students"
                                      outerRadius={130}
                                    >
                                      <Cell
                                        key={`cell-1-`}
                                        fill={data04[0].color}
                                      />
                                      <Cell
                                        key={`cell-2-`}
                                        fill={data04[1].color}
                                      />
                                      <Cell
                                        key={`cell-3-`}
                                        fill={data04[2].color}
                                      />
                                      <Cell
                                        key={`cell-4-`}
                                        fill={data04[3].color}
                                      />
                                      <Cell
                                        key={`cell-5-`}
                                        fill={data04[4].color}
                                      />
                                    </Pie>
                                  </PieChart>
                                  <div style={{ marginTop: "-6.5rem" }}>
                                    {" "}
                                    <Col>
                                      <Row>
                                        <Col className="d-inline-flex align-items-center justify-content-end">
                                          <span>
                                            <i
                                              className="fa-solid fa-pen-to-square"
                                              style={{ color: "#0c9564" }}
                                            ></i>
                                          </span>
                                        </Col>
                                        <Col>
                                          <span>
                                            <b
                                              className="fs-5"
                                              style={{ color: "#0c9564" }}
                                            >
                                              Maîtrise
                                            </b>
                                          </span>
                                        </Col>
                                        <Col className="lead d-inline-flex align-items-center justify-content-start">
                                          <span
                                            style={{
                                              fontSize: "large",
                                              color: "#0c9564",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <b>10</b>
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col className="d-inline-flex align-items-center justify-content-end">
                                          <span>
                                            <i
                                              className="fa-solid fa-pen-to-square"
                                              style={{ color: "#af1546" }}
                                            ></i>
                                          </span>
                                        </Col>
                                        <Col>
                                          <span>
                                            <b
                                              className="fs-5"
                                              style={{ color: "#af1546" }}
                                            >
                                              Acquis
                                            </b>
                                          </span>
                                        </Col>
                                        <Col className="lead d-inline-flex align-items-center justify-content-start">
                                          <span
                                            style={{
                                              fontSize: "large",
                                              color: "#af1546",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <b>8</b>
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col className="d-inline-flex align-items-center justify-content-end">
                                          <span>
                                            <i
                                              className="fa-solid fa-pen-to-square"
                                              style={{ color: "#8455ca" }}
                                            ></i>
                                          </span>
                                        </Col>
                                        <Col>
                                          <span>
                                            <b
                                              className="fs-5"
                                              style={{ color: "#8455ca" }}
                                            >
                                              ECA 2
                                            </b>
                                          </span>
                                        </Col>
                                        <Col className="lead d-inline-flex align-items-center justify-content-start">
                                          <span
                                            style={{
                                              fontSize: "large",
                                              color: "#8455ca",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <b>5</b>
                                          </span>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col>
                                      <Row>
                                        <Col className="d-inline-flex align-items-center justify-content-end">
                                          <span>
                                            <i
                                              className="fa-solid fa-pen-to-square"
                                              style={{ color: "#eb984b" }}
                                            ></i>
                                          </span>
                                        </Col>
                                        <Col>
                                          <span>
                                            <b
                                              className="fs-5"
                                              style={{ color: "#eb984b" }}
                                            >
                                              ECA 1
                                            </b>
                                          </span>
                                        </Col>
                                        <Col className="lead d-inline-flex align-items-center justify-content-start">
                                          <span
                                            style={{
                                              fontSize: "large",
                                              color: "#eb984b",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <b>5</b>
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col className="d-inline-flex align-items-center justify-content-end">
                                          <span>
                                            <i
                                              className="fa-solid fa-pen-to-square"
                                              style={{ color: "#525659" }}
                                            ></i>
                                          </span>
                                        </Col>
                                        <Col>
                                          <span>
                                            <b
                                              className="fs-5"
                                              style={{ color: "#525659" }}
                                            >
                                              Non acquis
                                            </b>
                                          </span>
                                        </Col>
                                        <Col className="lead d-inline-flex align-items-center justify-content-start">
                                          <span
                                            style={{
                                              fontSize: "large",
                                              color: "#525659",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <b>10</b>
                                          </span>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </div>
                                </ResponsiveContainer>
                              </Col>
                            </Row>
                            <Row>
                              {Array.isArray(data) &&
                              (true || graphData.length) > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                  <LineChart
                                    width={500}
                                    height={300}
                                    data={graphData}
                                    margin={{
                                      top: 5,
                                      right: 30,
                                      left: 0,
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
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="fs-2">
                      <div className="fs-2">En chiffres</div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div>
                        <Row>
                          <OverlayTrigger
                            trigger={["click", "hover", "focus"]}
                            overlay={
                              <Popover id="popover-competences">
                                <Popover.Header as="h3">
                                  Compétences
                                </Popover.Header>
                                <Popover.Body>
                                  Vous avez déjà abordé{" "}
                                  <strong>13 compétences</strong> dont 7 avec la
                                  6EME6.
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <Col className="mb-3">
                              <AnimatedCountup
                                countUp="13"
                                className="h-100"
                                label="Nb compétences abordées"
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
                                  En moyenne vous accordez
                                  <strong>
                                    {" "}
                                    20 pts de participation par séance.{" "}
                                  </strong>
                                  La classe qui participe le + est la 5EME3.
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <Col className="mb-3">
                              <AnimatedCountup
                                countUp="20"
                                className="h-100"
                                label="Participation moy./séance"
                              />
                            </Col>
                          </OverlayTrigger>
                          <Col className="mb-3">
                            <AnimatedCountup
                              countUp="240"
                              className="h-100"
                              label="Participation totale"
                            />
                          </Col>
                          <Col>
                            <AnimatedCountup />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={22} />
                          </Col>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={31} />
                          </Col>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={45} />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={54} />
                          </Col>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={104} />
                          </Col>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={77} />
                          </Col>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={2} />
                          </Col>
                          <Col>
                            <AnimatedCountup className="mt-3" countUp={59} />
                          </Col>
                        </Row>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </Col>
        </Row>

        {/* {statistics && statistics?.length > 0 && (
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
        {/* <div style={{ display: "flex", flexWrap: "wrap" }}>
              {Statistics.map((classe, index) => {
                return (
                  <div
                    style={{
                      marginBottom: "2rem",
                      marginRight: "2rem",
                      flex: "1 0 21%",
                    }}
                    key={index}
                  >
                    <Button onClick={() => goToClass(classe)}>
                      {classe.value}
                    </Button>
                  </div>
                );
              })}
            </div> */}
        {/* </Container> */}
        {/* </div> */}
        {/* )}
         {(!statistics || statistics?.length == 0) && (
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
        )}  */}
      </>
    );
  }
};
export default Statistics;
