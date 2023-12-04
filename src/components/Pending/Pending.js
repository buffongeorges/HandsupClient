import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { ThreeDots, TailSpin } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { colors } from "../../utils/Styles.js";
import { getProfesseurClasses } from "../../auth/actions/userActions.js";
import AuthContext from "../../auth/context/AuthContext.js";

const Pending = ({ handleNavbar }) => {
  // NOUVELLE FACON DE FAIRE
  const { user, isFetching, setIsFetching, logout } = useContext(AuthContext);
  let currentUser = user ? user : localStorage.getItem("userData");
  let navigate = useNavigate();
  const location = useLocation();
  let professeur = null;
  const [evaluations, setEvaluations] = useState([]);
  const fromLogin = localStorage.getItem("fromLogin");
  console.log("fromLogin", fromLogin);
  console.log(fromLogin == "true");

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
  }, []);

  return (
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
          La suite sera bientôt disponible
          <br />
          <center>
            {" "}
            {/* <Alert.Link href="/evaluation-create">Créer une évaluation</Alert.Link> */}
          </center>
        </Alert>
      </div>
    </div>
  );

  //   if (isFetching) {
  //     return (
  //       <>
  //         <div
  //           style={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             height: "100vh",
  //           }}
  //         >
  //           <img
  //             src={"/images/handsup.png"}
  //             style={{ maxWidth: "100%", maxHeight: "13%" }}
  //           />
  //           <img
  //             src={"/images/icone_handsup.png"}
  //             style={{ maxWidth: "100%", maxHeight: "13%", marginLeft: "1rem" }}
  //           />
  //         </div>
  //       </>
  //     );
  //   } else if (!isFetching) {
  //     return (
  //       <>
  //         <h1
  //           id="evaluations-title"
  //           style={{
  //             marginTop: "1rem",
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //           }}
  //         >
  //           Mes évaluations
  //         </h1>
  //         {evaluations && evaluations?.length > 0 && (
  //           <div
  //             className="container"
  //             style={{
  //               textAlign: "center",
  //               position: "relative",
  //               justifyContent: "center",
  //               paddingTop: "2rem",
  //               paddingLeft: "2rem",
  //             }}
  //           >
  //             {/* <Container fluid> */}
  //             <div style={{ display: "flex", flexWrap: "wrap" }}>
  //               {evaluations.map((classe, index) => {
  //                 return (
  //                   <div
  //                     style={{
  //                       marginBottom: "2rem",
  //                       marginRight: "2rem",
  //                       flex: "1 0 21%",
  //                     }}
  //                     key={index}
  //                   >
  //                     <Button onClick={() => goToClass(classe)}>
  //                       {classe.value}
  //                     </Button>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //             {/* </Container> */}
  //           </div>
  //         )}
  //         {(!evaluations || evaluations?.length == 0) && (
  //           <div
  //             style={{
  //               minHeight: "100vh",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "space-around",
  //               paddingBottom: "15rem",
  //             }}
  //           >
  //             <div style={{ display: "flex", flexWrap: "wrap" }}>
  //               <Alert key={"warning"} variant={"warning"}>
  //                 Vous n'avez pas d'évaluations enregistrées sur votre profil <br />
  //                 <center>
  //                   {" "}
  //                   <Alert.Link href="/evaluation-create">Créer une évaluation</Alert.Link>
  //                 </center>
  //               </Alert>
  //             </div>
  //           </div>
  //         )}
  //       </>
  //     );
  //   }
};

export default Pending;
