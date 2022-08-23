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
  
  //auth & redux
  import { connect } from "react-redux";
  import { resetPassword } from "./../../auth/actions/userActions.js";
  import { useNavigate, useParams } from "react-router-dom";
  
  const PasswordReset = ({ resetPassword }) => {
    const history = useNavigate();
    const { professeurId, resetString } = useParams();
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
              newPassword: "",
              confirmNewPassword: "",
              professeurId,
              resetString,
            }}
            validationSchema={Yup.object({
              newPassword: Yup.string()
                .min(8, "Password is too short")
                .max(30, "Password is too long")
                .required("Required"),
              confirmNewPassword: Yup.string()
                .required("Required")
                .oneOf([Yup.ref("newPassword")], "Passwords must match"),
            })}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              console.log("coucou");
              console.log(values);
              resetPassword(values, history, setFieldError, setSubmitting);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <TextInput
                  name="newPassword"
                  type="password"
                  label="Nouveau mot de passe"
                  placeholder="********"
                  icon={<FiLock />}
                />
  
                <TextInput
                  name="confirmNewPassword"
                  type="password"
                  label="Confirmer mot de passe"
                  placeholder="********"
                  icon={<FiLock />}
                />
                <ButtonGroup>
                  {!isSubmitting && (
                    <StyledFormButton type="submit">Submit</StyledFormButton>
                  )}
                  {isSubmitting && (
                    <ThreeDots color={colors.theme} height={49} width={100} />
                  )}
                </ButtonGroup>
              </Form>
            )}
          </Formik>
        </StyledFormArea>
        <CopyrightText>All rights reserved &copy;2022</CopyrightText>
      </div>
    );
  };
  
  export default connect(null, { resetPassword })(PasswordReset);
  