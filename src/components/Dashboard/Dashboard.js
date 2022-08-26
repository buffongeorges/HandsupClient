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
  let professeur = store.getState().session.user;

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('professeur'))
    {
      let teacherUpdatedValues = JSON.parse(sessionStorage.getItem('professeur'));
      if (teacherUpdatedValues) {
        console.log('teacherUpdatedValues')
        console.log(teacherUpdatedValues)

        professeur.firstname = teacherUpdatedValues.firstname;
        professeur.lastname = teacherUpdatedValues.lastname;
        professeur.college = teacherUpdatedValues.college;
        professeur.classes = teacherUpdatedValues.classes;
        professeur.noteDepart = teacherUpdatedValues.noteDepart;
        professeur.bonus = teacherUpdatedValues.bonus;
        professeur.avertissement = teacherUpdatedValues.avertissement;
        professeur.participation = teacherUpdatedValues.participation;
        professeur.photo = teacherUpdatedValues.photo;
      }
    }
    console.log('professeur maj')
    console.log(professeur)
  
    setCurrentUser({
      user: professeur,
      username: professeur.email,
      firstname: professeur.firstname,
      lastname: professeur.lastname,
      isAdmin: false,
    });
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
          Bienvenue, {professeur.firstname} {professeur.lastname}
        </StyledTitle>
        <ExtraText color={colors.light1}>{professeur.email}</ExtraText>
        <ExtraText color={colors.light1}>
          {new Date(professeur.dateOfBirth).toLocaleDateString()}
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
