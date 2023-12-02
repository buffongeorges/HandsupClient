import axios from "axios";
import { useNavigate } from "react-router-dom";

//the remote endpoint and local
const preprodApiUrl = "https://preprod--handsup-server.netlify.app/.netlify/functions/api"; // pre-prod
// const productionApiUrl = "https://handsup-server.netlify.app/.netlify/functions/api"; // prod

const localUrl = "http://localhost:8888/.netlify/functions/api";
const backendUrl = process.env.REACT_APP_API_URL;

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
      .post(`${backendUrl}/professeur/signin`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { data } = response;
        console.log("qqn???")
        console.log(response)

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
        } else if (data.status === 200) {
          const userData = data.data[0];
          console.log('OKayy')
          console.log(userData);
          console.log(JSON.parse(localStorage.getItem('userData')));
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
      .post(`${backendUrl}/professeur/signup`, credentials, {
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
    // sessionService.deleteSession();
    // sessionService.deleteUser();
    // sessionService.invalidateSession();
    // sessionService.navigate("/login");
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
      .post(`${backendUrl}/professeur/requestPasswordReset`, credentials, {
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
      .post(`${backendUrl}/professeur/resetPassword`, credentials, {
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
export const editProfesseur = (data) => {
  return axios
    .post(`${backendUrl}/professeur/edit`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//Update students from file provided by teacher
export const importStudentsFromFile = (formData) => {
  console.log("formData");
  console.log(formData);
  return axios
    .post(`${backendUrl}/professeur/importStudents`, formData, {
      // headers: {
      //   "Content-Type": "application/json",
      // },
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//Update student data
export const editEleve = (data) => {
  return axios
    .post(`${backendUrl}/eleve/edit`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

//Update student data
export const deleteEleve = (data) => {
  console.log("student data to be deleted");
  console.log(data);
  return axios
    .post(`${backendUrl}/eleve/deleteStudent`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

//Get teacher data
export const getProfesseurData = (profId) => {
  return axios
    .get(`${backendUrl}/professeur/get/${profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

//Get teacher data to create new evaluation
export const getProfesseurDataForEvaluation = (profId) => {
  return axios
    .get(`${backendUrl}/evaluation/create/${profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

//Get teacher registered classes
export const getProfesseurClasses = (profId) => {
  console.log("profId");
  console.log(profId);
  const headers = {
    "Content-Type": "application/json",
  }
  console.log('headers')
  console.log(headers)
  return axios
    .get(`${backendUrl}/classes/get/${profId}`, {
      headers,
      withCredentials: true,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

//Add student to a specific class
export const addEleveToClasse = (credentials) => {
  console.log("credentials");
  console.log(credentials);
  return axios
    .post(`${backendUrl}/classes/add/student`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

//Upload teacher picture
export const uploadTeacherPicture = (formData) => {
  return axios
    .post(`${backendUrl}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

//get secure url for image
export const getS3SecureURL = () => {
  return axios
    .get(`${backendUrl}/s3Url`)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

//upload image to S3 bucket
export const uploadImageToS3 = (url, file) => {
  console.log(url);
  console.log("le fichier");
  console.log(file);
  return axios
    .put(`${url}`, file, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

//Get student gender
export const getEleveGender = (eleveName) => {
  console.log("eleveName");
  console.log(eleveName);
  const genderEndpointUrl = `https://api.genderize.io?name=${eleveName}&country_id=FR`;

  return axios
    .get(genderEndpointUrl)
    .then((response) => {
      console.log("response du genre");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//get students in a specific class
//Get teacher registered classes
export const getElevesInClasse = (data) => {
  console.log("data");
  console.log(data);
  return axios
    .post(`${backendUrl}/classe/getClassStudents`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//get data for a specific student
export const getElevesData = (eleveId) => {
  return axios
    .get(`${backendUrl}/eleves/get/${eleveId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//edit student marks
// remarque : position n'est pas vraiment une note, mais dans les tabs à coté des notes.
export const editEleveNote = (eleveData) => {
  return axios
    .post(`${backendUrl}/eleve/updateMark`, eleveData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//end class sequence. Reset marks to 0, increase seance
export const endClassSequence = (eleveData) => {
  return axios
    .post(`${backendUrl}/classe/endSequence`, eleveData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

//increase class seance index. Reset marks to 0, increase seance
export const increaseClassSeanceIndex = (eleveData) => {
  return axios
    .post(`${backendUrl}/classe/increaseSeance`, eleveData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((response) => {
      console.log("response");
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};
