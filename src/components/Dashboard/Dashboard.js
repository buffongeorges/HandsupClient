import {
  StyledTitle,
  StyledSubTitle,
  Avatar,
  StyledButton,
  StyledFormArea,
  ButtonGroup,
  colors,
  ExtraText,
} from "../../utils/Styles.js";

//Logo
import Logo from "./../../images/icone_handsup.png";

import { logoutUser } from "../../auth/actions/userActions";

// React router
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = ({ logoutUser, user }) => {
  const currentUser = '';
  const setCurrentUser = undefined;
  // let professeur = store.getState().session.user;
  let professeur = '';

  const navigate = useNavigate();

  useEffect(() => {

  }, []);
  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "transparent",
          width: "100%",
          padding: "15px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        {/* <Avatar image={Logo} /> */}
      </div>
      <StyledFormArea bg={colors.dark2}>
        <StyledTitle size={65}>
          Bienvenue,
        </StyledTitle>
        <StyledTitle size={65}>
          {professeur.firstname} {professeur.lastname}
        </StyledTitle>
        <ExtraText color={colors.light1}>{professeur.email}</ExtraText>
        <ExtraText color={colors.light1}>
          {new Date(professeur.dateOfBirth).toLocaleDateString()}
        </ExtraText>
        {/* <ButtonGroup>
          <StyledButton
            to="/login"
            onClick={() => {
              logoutUser(navigate);
            }}
          >
            Se déconnecter
          </StyledButton>
        </ButtonGroup> */}
      </StyledFormArea>
    </div>
  );
};

export default Dashboard;
