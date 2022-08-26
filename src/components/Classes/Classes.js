import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { ThreeDots, TailSpin } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// auth & redux
import { connect } from "react-redux";
import store from "../../auth/store.js";
import { colors } from "../../utils/Styles.js";
import { getProfesseurClasses } from "../../auth/actions/userActions.js";

let classes = [
  "6EME 1",
  "6EME 2",
  "6EME 3",
  "6EME 4",
  "6EME 5",
  "6EME 6",
  "5EME 1",
  "5EME 2",
  "5EME 3",
  "5EME 4",
  "5EME 5",
  "5EME 6",
  "4EME 1",
  "4EME 2",
  "4EME 3",
  "4EME 4",
  "4EME 5",
  "4EME 6",
  "3EME 1",
  "3EME 2",
  "3EME 3",
  "3EME 4",
  "3EME 5",
  "3EME 6",
];

const Classes = () => {
  let navigate = useNavigate();
  const location = useLocation();
  let professeur = store.getState().session.user;
  const [classes, setClasses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const Input = () => {
    return <input placeholder="Your input here" />;
  };

  const [inputList, setInputList] = useState([]);

  const goToClass = (selectedClass) => {
    console.log("selectedClass")
    console.log(selectedClass)
    sessionStorage.setItem("selectedClasse", JSON.stringify(selectedClass));
    let classeName = selectedClass.value;
    classeName = classeName.replace(/\s/g, "");

    let path = `${location.pathname}/${classeName}`;

    navigate(`${path}`, { replace: true });
  };

  useEffect(() => {
    console.log("sessionStorage.getItem('professeur')");
    console.log(sessionStorage.getItem("professeur"));
    console.log(professeur);
    //first check if session contains the teacher classes:
    if (sessionStorage.getItem("professeur")) {
      let teacherClasses = JSON.parse(
        sessionStorage.getItem("professeur")
      ).classes;
      console.log("teacherClasses");
      console.log(teacherClasses);
      setClasses(teacherClasses);
      setIsFetching(false);
    }

    //if not call api for teacher classes:
    else {
      getProfesseurClasses(JSON.parse(sessionStorage.professeurId))
      .then((response) => {
        console.log("les classes:")
        console.log(response.data.data.classes)
        setClasses(response.data.data.classes)
      })
      .catch((error) => {console.log(error)})
      .finally(() => {
        setIsFetching(false);
      });
    }
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
        <TailSpin width={500} height={500} color={colors.theme} />
      </div>
    );
  } else if (!isFetching) {
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
        {/* <Container fluid> */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {classes.map((classe, index) => {
            return (
              <div
                style={{
                  marginBottom: "2rem",
                  marginRight: "2rem",
                  flex: "1 0 21%",
                }}
              >
                <Button onClick={() => goToClass(classe)}>{classe.value}</Button>
              </div>
            );
          })}
        </div>
        {/* </Container> */}
      </div>
    );
  }
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(Classes);
