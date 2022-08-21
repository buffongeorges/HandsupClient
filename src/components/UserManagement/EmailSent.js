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
  
  // React router
  import { useNavigate, useParams } from "react-router-dom";
  
  const EmailSent = () => {
    const history = useNavigate();
    const { userEmail, reset } = useParams();
    return (
      <div>
        <div
          style={{
            position: "absolute",
            // top: 0,
            // left: 0,
            backgroundColor: "transparent",
            width: "100%",
            padding: "15px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {/* <Avatar image={Logo} style={{zIndex: 1}}/> */}
        </div>
        {reset && userEmail && (
          <StyledFormArea bg={colors.dark2}>
            <StyledTitle size={65}>Réinitialiser mon mot de passe</StyledTitle>
            <ExtraText color={colors.light1}>
              {/* An email with a password reset link has been sent to your email: */}
              Un courriel contenant un lien de réinitialisation du mot de passe a été envoyé à votre adresse courriel :
              <b style={{ color: colors.primary }}>{userEmail}</b>
            </ExtraText>
            <ExtraText color={colors.light1}>
              {/* Check your email and click on the link to proceed! */}
              Vérifiez votre courriel et cliquez sur le lien pour continuer!
            </ExtraText>
          </StyledFormArea>
        )}
  
        {!reset && userEmail && (
          <StyledFormArea bg={colors.dark2}>
            <StyledTitle size={65}>Confirmer mon compte</StyledTitle>
            <ExtraText color={colors.light1}>
              {/* An email with your account confirmation link has been sent to your */}
              Un courriel de confirmation de votre compte a été envoyé à votre
              email: <b style={{ color: colors.primary }}>{userEmail}</b>
            </ExtraText>
            <ExtraText color={colors.light1}>
              {/* Check your email and come back to proceed! */}
              Vérifiez votre courriel et revenez pour continuer!
            </ExtraText>
            <ButtonGroup>
              <StyledButton to={`/login/${userEmail}`}>Continuer</StyledButton>
            </ButtonGroup>
          </StyledFormArea>
        )}
  
        {!reset && !userEmail && (
          <StyledFormArea bg={colors.dark2}>
            <StyledTitle size={65}>Password Reset</StyledTitle>
            <ExtraText color={colors.light1}>
              Your password has been reset successfully.
            </ExtraText>
            <ExtraText color={colors.light1}>
              You may now login!
            </ExtraText>
            <ButtonGroup>
              <StyledButton to={`/login`}>Login</StyledButton>
            </ButtonGroup>
          </StyledFormArea>
        )}
      </div>
    );
  };
  
  export default EmailSent;
  