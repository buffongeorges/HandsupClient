import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
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
} from "recharts";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// auth & redux
import { connect } from "react-redux";
import store from "../../auth/store.js";
import { colors } from "../../utils/Styles.js";
import { getProfesseurClasses } from "../../auth/actions/userActions.js";
import { sessionService } from "redux-react-session";
import AnimatedCountup from "../../utils/AnimatedCountup/AnimatedCountup.js";
import Row from "react-bootstrap/esm/Row.js";
import Col from "react-bootstrap/esm/Col.js";
import Form from "react-bootstrap/Form";

const Statistics = ({ handleNavbar, userType }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  let professeur = store.getState().session.user;
  const [statistics, setStatistics] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [classes, setClasses] = useState([]);
  const [checkedClasses, setCheckedClasses] = useState([]);

  const [graphData, setGraphData] = useState([]);
  let sumAvertissements = 22;
  let sumBonus = 44;
  let sumParticipations = 111;
  const fromLogin = sessionStorage.fromLogin;
  console.log("fromLogin", fromLogin);
  console.log(fromLogin == "true");

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
    sessionStorage.setItem("selectedClasse", JSON.stringify(selectedClass));
    let classeName = selectedClass.value;
    const classeId = selectedClass._id;
    classeName = classeName.replace(/\s/g, "");

    sessionService.loadUser().then((user) => {
      console.log("mon utilisateur");
      console.log(user);
    });

    let updatedUserFields = {
      ...user,
      selectedClass: selectedClass,
    };

    console.log("updatedUserFields");
    console.log(updatedUserFields);
    sessionService
      .saveUser(updatedUserFields)
      .then(() => {
        console.log("user has been saved in session successfully");
      })
      .catch((err) => {
        console.log("error while updating user selected class");
        console.log(err);
      });

    let path = `${location.pathname}/${classeId}`;

    navigate(`${path}`);
  };

  useEffect(() => {
    console.log("to be defined/////");
    console.log(store.getState().session.user);
    setGraphData(table);

    sessionService.loadUser().then((user) => {
      //   let teacherClasses = user.classes;
      //   setUser(user);
      //   if (teacherClasses) {
      //     console.log("teacherClasses");
      //     console.log(teacherClasses);
      //     setClasses(teacherClasses);
      // }

      //if not call api for teacher classes:
      getProfesseurClasses(user._id)
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
        <div className="m-3">
          <div>
            <div className="mt-5" style={{ fontSize: "2rem" }}>
              {" "}
              En graphique{" "}
            </div>
            <div>
              <Row className="mt-5">
                <Col>
                  <Form>
                    <div className="mb-3 mx-5">
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
                  <Row style={{ marginBottom: "2rem", marginTop: "2rem" }}>
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
                  </Row>
                  {Array.isArray(data) && (true || graphData.length) > 0 ? (
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
                </Col>
              </Row>
            </div>
          </div>
          <div>
            <div
              className="mb-5"
              style={{ fontSize: "2rem", marginTop: "9rem" }}
            >
              {" "}
              En chiffres{" "}
            </div>
            <div>
              <Row>
                <Col className="mb-3">
                  <AnimatedCountup
                    countUp="13"
                    className="h-100"
                    label="Nb compétences abordées"
                  />
                </Col>
                <Col className="mb-3">
                  <AnimatedCountup
                    countUp="20"
                    className="h-100"
                    label="Participation moy./séance"
                  />
                </Col>
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
          </div>
        </div>

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

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(Statistics);
