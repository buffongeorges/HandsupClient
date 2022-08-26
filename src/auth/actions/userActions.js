import axios from "axios";
import { sessionService } from "redux-react-session";
import { useNavigate } from "react-router-dom";

//the remote endpoint and local
const remoteUrl = "https://young-dusk-42243.herokuapp.com";
const localUrl = "http://localhost:3002";
const currentUrl = remoteUrl;

export const loginUser = (
  credentials,
  navigate,
  setFieldError,
  setSubmitting
) => {
  //Make checks and get some data

  return () => {
    console.log("dans loginUser");
    axios
      .post(`${currentUrl}/professeur/signin`, credentials, {
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
                navigate("/dashboard");
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
    console.log("hello");
    axios
      .post(`${currentUrl}/professeur/signup`, credentials, {
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
    navigate("/login");
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
      .post(`${currentUrl}/professeur/requestPasswordReset`, credentials, {
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
          const { email } = credentials;
          navigate(`/emailsent/${email}/${true}`);
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
      .post(`${currentUrl}/professeur/resetPassword`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { data } = response;

        if (data.status === "FAILED") {
          const { message } = data;

          //check for specific error
          if (message.toLowerCase().includes("password")) {
            setFieldError("newPassword", message);
          }
        } else if (data.status === "SUCCESS") {
          navigate(`/emailsent`);
        }

        //complete submission
        setSubmitting(false);
      })
      .catch((err) => console.log(err));
  };
};

//Update teacher data
export const editProfesseur = (credentials) => {
  return axios
    .post(`${currentUrl}/professeur/edit`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//Get teacher data
export const getProfesseurData = (profId) => {
  return axios
    .get(`${currentUrl}/professeur/get/${profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//Get teacher registered classes
export const getProfesseurClasses = (profId) => {
  console.log("profId");
  console.log(profId);
  return axios
    .get(`${currentUrl}/classes/get/${profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//Add student to a specific class
export const addEleveToClasse = (credentials) => {
  console.log("credentials");
  console.log(credentials);
  return axios
    .post(`${currentUrl}/classes/add/student`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//Upload teacher picture
export const uploadTeacherPicture = (formData) => {
  return axios
    .post(`${currentUrl}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};
