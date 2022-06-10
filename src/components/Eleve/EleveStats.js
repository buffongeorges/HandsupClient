import React from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
    <div className="container"
    style={{
      textAlign: "center",
      position: "relative",
      justifyContent: "center",
      paddingTop: "2rem",
      paddingLeft: "2rem",
    }}>
      <div
        id="student-stats"
        style={{marginBottom: '2rem'}}
      >
        Statistiques de Eleve 2
      </div>
      <div ></div>
      <LineChart
        width={500}
        height={350}
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
    </div>
  );
}
