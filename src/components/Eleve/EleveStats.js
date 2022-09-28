import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
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

// auth & redux
import { connect } from "react-redux";
import { sessionService } from "redux-react-session";
import { getElevesData } from "../../auth/actions/userActions";
import { TailSpin } from "react-loader-spinner";
import { colors } from "../../utils/Styles";

const EleveStats = () => {
  let dataTest = [];
  let { studentId } = useParams();
  let navigate = useNavigate();
  console.log("studentId");
  console.log(studentId);
  const [user, setUser] = useState(null);
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
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("fromLogin", JSON.stringify(false));
    setIsFetching(true);
    sessionService.loadUser().then((user) => {
      console.log("mon utilisateur");
      console.log(user);
      setUser(user);
      setDiscipline(user.discipline);
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
      <Row>
        <Col xs="2" md="2" lg="2" style={{marginTop: '1rem'}}>
          <Button variant="link" onClick={() => {
            navigate(-1) //go back to previous page
          }}>
            <FaArrowLeft /> Retour
          </Button>
        </Col>
        <Col xs="10" md="10" lg="10">
          <div
            className="container"
            style={{
              textAlign: "center",
              position: "relative",
              justifyContent: "center",
              paddingTop: "2rem",
              marginLeft: "-4rem"
            }}
          >
            <h1 id="student-stats" style={{ marginBottom: "2rem" }}>
              Statistiques de {firstname} {lastname} en {discipline?.name}
            </h1>

            <Row style={{ marginBottom: "2rem", marginTop: "2rem" }}>
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
            {Array.isArray(participations) && graphData.length > 0 ? (
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
          </div>
        </Col>
      </Row>
    );
  }
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(EleveStats);
