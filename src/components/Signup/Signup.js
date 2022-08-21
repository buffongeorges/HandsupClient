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

import SignupImage from "../../images/icone_handsup.png";

//formik
import { Formik, Form } from "formik";
import { TextInput } from "../../utils/FormLib.js";

//icons
import { FiMail, FiLock, FiUser, FiCalendar } from "react-icons/fi";

//loader
import { ThreeDots } from "react-loader-spinner";

//auth & redux
import { connect } from "react-redux";
import { signupUser } from "../../auth/actions/userActions.js";
import { useNavigate } from "react-router-dom";

const Signup = ({ signupUser }) => {
  const history = useNavigate();
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
        <Avatar image={SignupImage} />
        <StyledTitle color={colors.theme} size={30}>
          Inscription
        </StyledTitle>
        <Formik
          initialValues={{
            email: "",
            password: "",
            repeatPassword: "",
            dateOfBirth: "",
            name: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(8, "Password is too short")
              .max(30, "Password is too long")
              .required("Required"),
            name: Yup.string().required("Required"),
            dateOfBirth: Yup.date().required("Required"),
            repeatPassword: Yup.string()
              .required("Required")
              .oneOf([Yup.ref("password")], "Passwords must match"),
          })}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            console.log(values);
            signupUser(values, history, setFieldError, setSubmitting);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                name="name"
                type="text"
                label="NOM Prénom"
                placeholder="DOE John"
                icon={<FiUser />}
              />
              <TextInput
                name="email"
                type="text"
                label="Adresse e-mail"
                placeholder="john@example.com"
                icon={<FiMail />}
              />
              <TextInput
                name="dateOfBirth"
                type="date"
                label="Date de naissance"
                icon={<FiCalendar />}
              />
              <TextInput
                name="password"
                type="password"
                label="Mot de passe"
                placeholder="******"
                icon={<FiLock />}
              />
              <TextInput
                name="repeatPassword"
                type="password"
                label="Confirmer mot de passe"
                placeholder="******"
                icon={<FiLock />}
              />
              <ButtonGroup>
                {!isSubmitting && (
                  <StyledFormButton type="submit">Valider</StyledFormButton>
                )}
                {isSubmitting && (
                  <ThreeDots color={colors.theme} height={49} width={100} />
                )}
              </ButtonGroup>
            </Form>
          )}
        </Formik>
        <ExtraText style={{marginTop: '2rem'}}>
          Vous avez déjà un compte? <TextLink to="/login">Se connecter</TextLink>
        </ExtraText>
      </StyledFormArea>
      <CopyrightText>All rights reserved &copy;2022</CopyrightText>
    </div>
  );
};

export default connect(null, { signupUser })(Signup);
