import React from "react";
import { useContext } from "react";
import AuthContext from "../../auth/context/AuthContext";
import { TailSpin } from "react-loader-spinner";
import { colors } from "../../utils/Styles";

const EvaluationCorrection = () => {
  const { user, isFetching, setIsFetching } = useContext(AuthContext);
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
    return <div>EvaluationCorrection</div>;
  }
};

export default EvaluationCorrection;
