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

// auth & redux
import { connect } from "react-redux";
import { logoutUser } from "../../auth/actions/userActions";

// React router
import { useNavigate } from "react-router-dom";
import store from "../../auth/store.js";
import { useAuth } from "../../auth/context/AuthContext.js";
import { useEffect } from "react";

const Dashboard = ({ logoutUser, user }) => {
  const { currentUser, setCurrentUser } = useAuth();
//   console.log(setCurrentUser);
  const professeur = store.getState().session.user;

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser({username: professeur.email, firstname: professeur.firstname, lastname: professeur.lastname, isAdmin: false} );
    // setCurrentUser(professeur);
    console.log("le user");
    // console.log(sessionStorage.getItem("username"));
    // console.log(sessionStorage.getItem("unTest"));
    console.log(store.getState().session.user);

    console.log(currentUser);
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
          Bienvenue, {user.firstname} {user.lastname}
        </StyledTitle>
        <ExtraText color={colors.light1}>{user.email}</ExtraText>
        <ExtraText color={colors.light1}>
          {new Date(user.dateOfBirth).toLocaleDateString()}
        </ExtraText>
        <ButtonGroup>
          <StyledButton
            to="#"
            onClick={() => {
              logoutUser(navigate);
            }}
          >
            Se déconnecter
          </StyledButton>
        </ButtonGroup>
      </StyledFormArea>
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  user: session.user,
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
