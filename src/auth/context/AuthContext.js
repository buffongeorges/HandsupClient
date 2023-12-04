import axios from "axios";
import { createContext, useContext, useState } from "react";

const backendUrl = process.env.REACT_APP_API_URL;

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [isFetching, setIsFetching] = useState(false);

  const [user, setUser] = useState(() => {
    let userData = localStorage.getItem("userData");
    if (userData) return JSON.parse(userData);
    return null;
  });

  const [userType, setUserType] = useState(() => {
    let userType = localStorage.getItem("userType");
    if (userType) return JSON.parse(userType);
    return null;
  });

  const login = async (payload, navigate, setFieldError, setSubmitting) => {
    try {
      const signinResult = await axios.post(
        `${backendUrl}/user/signin`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // const header = new Headers(authHeader());
      // header.set('Accept', 'application/json');
      // header.set('Content-Type', 'application/json');
      console.log("signinResult");
      console.log(signinResult);
      const userData = await axios.post(
        `${backendUrl}/user/fetchUserData`,
        payload,
        // ATTENTION : ne pas oublier de mettre cet objet vide
        //pour data (si vide)sinon tes headers seront passés en req.body !!
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // the user data was retrieve successfully:
      const user = userData.data.data[0];
      const userTypeResult = await getUserType({ userId: user._id });
      const userType = userTypeResult.data.userType;
      console.log("userTypeResult");
      console.log(userTypeResult);
      console.log(userType);
      setUser(user);
      setUserType(userType);
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("userType", JSON.stringify(userType));
      console.log("user");
      console.log(user);
      setSubmitting(false);
      localStorage.setItem("fromLogin", JSON.stringify(true));
      if (userType === 'teacher') {
        navigate("/classes");
      }
      else if (userType === 'student') {
        navigate('/matieres');
      }
      else {
        await logout();
      }
    } catch (error) {
      console.log(error);
      const { message } = error?.response?.data;

      //check for specific error
      if (message.includes("credentials")) {
        setFieldError("email", message);
        setFieldError("password", message);
      } else if (message.includes("password")) {
        setFieldError("password", message);
      } else if (message.toLowerCase().includes("email")) {
        setFieldError("email", message);
      }
      setSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      const logoutResponse = await axios.get(`${backendUrl}/user/signout`, {
        withCredentials: true,
      });
      localStorage.removeItem("userData");
      localStorage.removeItem("userType");
      setUser(null);
      setUserType(null);

      const httpResponse = {
        status: logoutResponse.data.status,
        message: logoutResponse.data.message,
      };
      return httpResponse;
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async (payload, navigate, setFieldError, setSubmitting) => {
    try {
      const signinResult = await axios.post(
        `${backendUrl}/user/signup`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // const header = new Headers(authHeader());
      // header.set('Accept', 'application/json');
      // header.set('Content-Type', 'application/json');
      console.log("signinResult");
      console.log(signinResult);
      setSubmitting(false);
      const { email } = payload;
      navigate(`/emailsent/${email}`);

      // const httpResponse = {
      //   status: userData.data.status,
      //   message: userData.data.message,
      // };
      // return httpResponse;
    } catch (error) {
      console.log(error);
      const { message } = error?.response?.data;

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
      setSubmitting(false);
    }
  };

  const resetPasswordRequest = async (
    payload,
    navigate,
    setFieldError,
    setSubmitting
  ) => {
    try {
      await axios.post(`${backendUrl}/user/requestPasswordReset`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { email } = payload;
      navigate(`/emailsent/${email}/${true}`);
      //complete submission
      setSubmitting(false);
    } catch (error) {
      console.log(error);
      const { message } = error?.response?.data;
      console.log(message);
      //check for specific error
      if (
        message.toLowerCase().includes("credentials") ||
        message.toLowerCase().includes("password") ||
        message.toLowerCase().includes("email")
      ) {
        setFieldError("email", message);
      }
      //complete submission
      setSubmitting(false);
    }
  };

  const resetPassword = async (
    payload,
    navigate,
    setFieldError,
    setSubmitting
  ) => {
    try {
      const resetPasswordResult = await axios.post(
        `${backendUrl}/user/resetPassword`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = resetPasswordResult.data;
      console.log(resetPasswordResult);
      console.log(data);

      navigate(`/emailsent`);

      //complete submission
      setSubmitting(false);
    } catch (error) {
      console.log(error);
      const { message } = error?.response?.data;

      //check for specific error
      if (message.toLowerCase().includes("password")) {
        setFieldError("newPassword", message);
      }
      //complete submission
      setSubmitting(false);
    }
  };

  const getUserType = async (userType) => {
    try {
      const getUserTypeResult = await axios.post(
        `${backendUrl}/user/getUserType`,
        userType,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("getUserTypeResult");
      console.log(getUserTypeResult);
      return getUserTypeResult;
    } catch (error) {
      console.log(error);
      const { message } = error?.response?.data;
      console.log(message);
      return error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signup,
        resetPasswordRequest,
        resetPassword,
        user,
        setUser,
        isFetching,
        setIsFetching,
        userType,
        setUserType,
        getUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
