import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { ThreeDots, TailSpin } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// auth & redux
import { connect } from "react-redux";
import store from "../../auth/store.js";
import { colors } from "../../utils/Styles.js";
import { getProfesseurClasses } from "../../auth/actions/userActions.js";
import { sessionService } from "redux-react-session";
import Switch from "../../utils/Switch/Switch.js";

const Evaluations = ({ handleNavbar }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  let professeur = store.getState().session.user;
  const [evaluations, setEvaluations] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const fromLogin = sessionStorage.fromLogin;
  console.log("fromLogin", fromLogin);
  console.log(fromLogin == "true");

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
          //   console.log(response.data)
          //   console.log("les classes:");
          //   console.log(response.data.data.classes);
          //   setClasses(response.data.data.classes);
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
        {evaluations && evaluations?.length > 0 && (
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
              {evaluations.map((classe, index) => {
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
            </div>
            {/* </Container> */}
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
                Vous n'avez pas d'évaluations enregistrées sur votre profil <br />
                <center>
                  {" "}
                  <Alert.Link href="/evaluation-create">Créer une évaluation</Alert.Link>
                </center>
              </Alert>
            </div>
          </div>
        )}
      </>
    );
  }
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(Evaluations);
