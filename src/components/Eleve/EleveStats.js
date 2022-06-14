import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
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

export default function EleveStats() {
  let { studentId } = useParams();
  console.log("studentId");
  console.log(studentId);
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

  return (
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
      <h1 id="student-stats" style={{ marginBottom: "2rem" }}>
        Statistiques de Eleve 2
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
                textAlign: 'center',
                display: 'table-cell',
                verticalAlign: 'middle',
                fontSize: '2rem'
              }}
            >
              55
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
                textAlign: 'center',
                display: 'table-cell',
                verticalAlign: 'middle',
                fontSize: '2rem'
              }}
            >
              14
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
                textAlign: 'center',
                display: 'table-cell',
                verticalAlign: 'middle',
                fontSize: '2rem'
              }}
            >
              19
            </p>
          </center>
          </div>
        </Col>
      </Row>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={data}
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
          <Line type="monotone" dataKey="Participation" stroke="#82ca9d" />
          <Line
            type="monotone"
            dataKey="Bonus"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="Avertissement" stroke="#c29825" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
