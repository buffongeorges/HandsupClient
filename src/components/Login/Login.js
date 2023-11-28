import React, { useState } from "react";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import LoginImage from "../../images/icone_handsup.png";

//formik
import { Formik, Form } from "formik";
import { TextInput } from "../../utils/FormLib.js";

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

//form validation
import * as Yup from "yup";

//auth & redux
import { connect } from "react-redux";
import { loginUser } from "../../auth/actions/userActions.js";

//icons
import { FiMail, FiLock } from "react-icons/fi";

//loader
import { ThreeDots } from "react-loader-spinner";

const Login = ({loginUser}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();


  // function handleSubmit(event) {
  //   event.preventDefault();
  //   // fake login
  //   // if (email === "handsup@hotmail.fr" && password === "sxm") {
  //   console.log("ok");
  //   Axios.post("http://localhost:3001/api/insert/teacher", {
  //     firstname: "titi",
  //     lastname: "toto",
  //     email: email,
  //     admin: true,
  //     college: "Soualiga",
  //     password: password, //a encoder!!
  //     verified: false, // doit vérifier par mail
  //   });
  //   localStorage.setItem("connected", JSON.stringify(true));
  //   navigate("/import");
  //   // }
  // }

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
        {/* avatar */}
        <Avatar image={LoginImage} />

        {/* title */}
        <StyledTitle color={colors.theme} size={30}>
          Connexion
        </StyledTitle>

        <Formik
          initialValues={{
            email: userEmail,
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(8, "Password is too short")
              .max(30, "Password is too long")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            console.log('coucou')
            console.log(values);
            loginUser(values, navigate, setFieldError, setSubmitting);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                name="email"
                type="text"
                label="Adresse e-mail"
                placeholder="john@example.com"
                icon={<FiMail />}
              />
              <TextInput
                name="password"
                type="password"
                label="Mot de passe"
                placeholder="********"
                icon={<FiLock />}
              />
              <ButtonGroup>
                {!isSubmitting && (
                  <>
                    <StyledFormButton type="submit">Login</StyledFormButton>
                  </>
                )}
                {isSubmitting && (
                  <ThreeDots color={colors.theme} height={49} width={100} />
                )}
              </ButtonGroup>
            </Form>
          )}
        </Formik>
        <ExtraText style={{marginTop: '2rem'}}>
          Mot de passe oublié?
          <TextLink to="/forgottenpassword"> Renvoyer</TextLink>
        </ExtraText>
        <ExtraText>
          Vous êtes nouveau? <TextLink to="/signup"> Inscription</TextLink>
        </ExtraText>
      </StyledFormArea>
      <CopyrightText>All rights reserved &copy;2023</CopyrightText>
    </div>
  );
}

export default connect(null, { loginUser })(Login);