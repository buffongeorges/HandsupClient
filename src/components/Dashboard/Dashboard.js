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
  import { connect } from 'react-redux';
  import { logoutUser } from "../../auth/actions/userActions";
  
  // React router
  import { useNavigate } from "react-router-dom";
  
  
  const Dashboard = ({logoutUser, user}) => {
    const history = useNavigate();
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
          <Avatar image={Logo} />
        </div>
        <StyledFormArea bg={colors.dark2}>
          <StyledTitle size={65}>Welcome, {user.name}</StyledTitle>
          <ExtraText color={colors.light1}>{user.email}</ExtraText>
          <ExtraText color={colors.light1}>{new Date(user.dateOfBirth).toLocaleDateString()}</ExtraText>
          <ButtonGroup>
            <StyledButton to="#" onClick={() => { logoutUser(history)}} >Logout</StyledButton>
          </ButtonGroup>
        </StyledFormArea>
      </div>
    );
  };
  
  const mapStateToProps = ({session}) => ({
    user: session.user
  })
  
  export default connect(mapStateToProps, {logoutUser})(Dashboard);
  