import axios from "axios";
import { sessionService } from "redux-react-session";
// import { usenavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


//the remote endpoint and local
const remoteUrl = "https://young-dusk-42243.herokuapp.com";
const localUrl = "http://localhost:3001";
const currentUrl = localUrl;

export const loginUser = (
  credentials,
  navigate,
  setFieldError,
  setSubmitting
) => {
  //Make checks and get some data

  return () => {
    console.log('dans loginUser')
    axios
      .post(`${currentUrl}/user/signin`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { data } = response;

        if (data.status === "FAILED") {
          const { message } = data;

          //check for specific error
          if (message.includes("credentials")) {
            setFieldError("email", message);
            setFieldError("password", message);
          } else if (message.includes("password")) {
            setFieldError("password", message);
          } else if (message.toLowerCase().includes("email")) {
            setFieldError("email", message);
          }
        } else if (data.status === "SUCCESS") {
          const userData = data.data[0];

          const token = userData._id;

          sessionService
            .saveSession(token)
            .then(() => {
              sessionService.saveUser(userData).then(() => {
                useNavigate("/dashboard");
              });
            })
            .catch((err) => console.log(err));
        }

        //complete submission
        setSubmitting(false);
      })
      .catch((err) => console.log(err));
  };
};

export const signupUser = (
  credentials,
  navigate,
  setFieldError,
  setSubmitting
) => {
  return (dispatch) => {
    axios
      .post(`${currentUrl}/user/signup`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { data } = response;

        if (data.status === "FAILED") {
          const { message } = data;

          //checking for specific error
          if (message.includes("name")) {
            setFieldError("name", message);
          } else if (message.includes("email")) {
            setFieldError("email", message);
          } else if (message.includes("date")) {
            setFieldError("dateOfBirth", message);
          } else if (message.includes("password")) {
            setFieldError("password", message);
          }
        } else if (data.status === "PENDING") {
          //display message for email verification
          const { email } = credentials;
          navigate(`/emailsent/${email}`);
        }
        //complete submission
        setSubmitting(false);
      })
      .catch((err) => console.log(err));
  };
};

export const logoutUser = (navigate) => {
  return () => {
    sessionService.deleteSession();
    sessionService.deleteUser();
    navigate("/");
  };
};

export const forgottenPassword = (
  credentials,
  navigate,
  setFieldError,
  setSubmitting
) => {
  //Make checks and get some data

  return () => {
    axios
      .post(`${currentUrl}/user/requestPasswordReset`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { data } = response;

        if (data.status === "FAILED") {
          const { message } = data;

          //check for specific error
          if (
            message.toLowerCase().includes("credentials") ||
            message.toLowerCase().includes("password") ||
            message.toLowerCase().includes("email")
          ) {
            setFieldError("email", message);
          }
        } else if (data.status === "PENDING") {
          const {email} = credentials;
          navigate.push(`/emailsent/${email}/${true}`)
        }

        //complete submission
        setSubmitting(false);
      })
      .catch((err) => console.log(err));
  };
};

//Actual reset
export const resetPassword = (
    credentials,
    navigate,
    setFieldError,
    setSubmitting
  ) => {
    //Make checks and get some data
    return () => {
      axios
        .post(`${currentUrl}/user/resetPassword`, credentials, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const { data } = response;
  
          if (data.status === "FAILED") {
            const { message } = data;
  
            //check for specific error
            if (
              message.toLowerCase().includes("password") 
            ) {
              setFieldError("newPassword", message);
            }
          } else if (data.status === "SUCCESS") {
            navigate.push(`/emailsent`)
          }
  
          //complete submission
          setSubmitting(false);
        })
        .catch((err) => console.log(err));
    };
  };
