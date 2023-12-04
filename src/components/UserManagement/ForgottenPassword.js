//styled components
import {
  StyledTextInput,
  StyledFormArea,
  StyledFormButton,
  StyledLabel,
  StyledTitle,
  Avatar,
  colors,
  ButtonGroup,
  ExtraText,
  TextLink,
  CopyrightText,
} from "../../utils/Styles.js";
import * as Yup from "yup";

import Logo from "./../../images/icone_handsup.png";

//formik
import { Formik, Form } from "formik";
import { TextInput } from "../../utils/FormLib.js";

//icons
import { FiMail, FiLock } from "react-icons/fi";

//loader
import { ThreeDots } from "react-loader-spinner";

import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../auth/context/AuthContext.js";

//the frontend url
const frontendUrl = window.location.origin;

const ForgottenPassword = () => {
  const { resetPasswordRequest } = useContext(AuthContext);
  console.log("the base url:");
  console.log(window.location.origin);
  const history = useNavigate();

  const forgottenPassword = async (
    values,
    navigate,
    setFieldError,
    setSubmitting
  ) => {
    let payload = { ...values };
    await resetPasswordRequest(payload, navigate, setFieldError, setSubmitting);
  };
  const { userEmail } = useParams();
  return (
    <div
      className="Login"
      style={{
        width: "25rem",
        height: "60rem",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <StyledFormArea>
        <Avatar image={Logo} />
        <StyledTitle color={colors.theme} size={30}>
          Réinitialiser mot de passe
        </StyledTitle>
        <Formik
          initialValues={{
            email: userEmail,
            redirectUrl: `${frontendUrl}/passwordreset`,
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            forgottenPassword(values, history, setFieldError, setSubmitting);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                name="email"
                type="text"
                label="Entrer votre adresse e-mail"
                placeholder="john@example.com"
                icon={<FiMail />}
              />
              <ButtonGroup>
                {!isSubmitting && (
                  <StyledFormButton type="submit">Envoyer</StyledFormButton>
                )}
                {isSubmitting && (
                  <ThreeDots color={colors.theme} height={49} width={100} />
                )}
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </StyledFormArea>
      <CopyrightText>All rights reserved &copy;2023</CopyrightText>
    </div>
  );
};

export default ForgottenPassword;
