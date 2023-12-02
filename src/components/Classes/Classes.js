import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { ThreeDots, TailSpin } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { colors } from "../../utils/Styles.js";
import { getProfesseurClasses } from "../../auth/actions/userActions.js";
import AuthContext from "../../auth/context/AuthContext.js";

let classesTest = [
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

const Classes = ({ handleNavbar }) => {
  let navigate = useNavigate();
  const location = useLocation();

  // NOUVELLE FACON DE FAIRE
  const { user, logout } = useContext(AuthContext);
  let currentUser = user ? user : localStorage.getItem("userData");

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fromLogin = localStorage.getItem('fromLogin');
  // fromLogin permet d'avoir l'effet d'arriver sur une app
  // avec cette page temporaire de bienvenu avec l'icone Handsup
  console.log("fromLogin", fromLogin);
  console.log(fromLogin == "true");

  const goToClass = (selectedClass) => {
    console.log("selectedClass");
    console.log(selectedClass);
    // sessionStorage.setItem("selectedClasse", JSON.stringify(selectedClass));
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
    localStorage.setItem('userData', JSON.stringify(updatedUserFields));

    // ANCIENNE FACON DE FAIRE
    // sessionService
    //   .saveUser(updatedUserFields)
    //   .then(() => {
    //     console.log("user has been saved in session successfully");
    //   })
    //   .catch((err) => {
    //     console.log("error while updating user selected class");
    //     console.log(err);
    //   });

    let path = `${location.pathname}/${classeId}`;
    navigate(`${path}`);
  };

  useEffect(() => {
    if (!currentUser) {
      logout().then(() => {
        // navigate("/login");
      });
    } else {
      const teacherClasses = currentUser?.classes;
      if (Array.isArray(teacherClasses) && teacherClasses?.length > 0) {
        if (typeof handleNavbar === "function" && fromLogin == "true") {
          handleNavbar(false);
        }
        console.log("teacherClasses");
        console.log(teacherClasses);
        setClasses(teacherClasses);
      }
      //if not call api for teacher classes:
      getProfesseurClasses(currentUser._id)
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
          if (fromLogin == "true") {
            setTimeout(() => {
              setIsLoading(false);
              if (typeof handleNavbar === "function") {
                handleNavbar(true);
              }
            }, 2500);
          }
        });
    }
  }, []);

  if (isLoading && fromLogin == "true") {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <img
            src={"/images/handsup.png"}
            style={{ maxWidth: "100%", maxHeight: "13%" }}
          />
          <img
            src={"/images/icone_handsup.png"}
            style={{ maxWidth: "100%", maxHeight: "13%", marginLeft: "1rem" }}
          />
        </div>
      </>
    );
  } else if (!isLoading || fromLogin == "false") {
    return (
      <>
        {classes && classes?.length > 0 && (
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
        {(!classes || classes?.length == 0) && (
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
                Vous n'avez pas de classes enregistrées sur votre profil <br />
                <center>
                  {" "}
                  <Alert.Link href="/settings">Rajouter des classes</Alert.Link>
                </center>
              </Alert>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default Classes;
