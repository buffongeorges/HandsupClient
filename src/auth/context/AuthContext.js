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

  const login = async (payload) => {
    // A TERME DOIT ETRE
    // await axios.post(`${backendUrl}/user/signin`, payload, {
    try {
      await axios.post(`${backendUrl}/user/signin`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // const header = new Headers(authHeader());
      // header.set('Accept', 'application/json');
      // header.set('Content-Type', 'application/json');

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
      setUser(user);
      localStorage.setItem("userData", JSON.stringify(user));
      console.log("user");
      console.log(user);

      const httpResponse = {
        status: userData.data.status,
        message: userData.data.message,
      };
      return httpResponse;
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const logoutResponse = await axios.get(`${backendUrl}/user/signout`, {
        withCredentials: true,
      });
      localStorage.removeItem("userData");
      setUser(null);

      const httpResponse = {
        status: logoutResponse.data.status,
        message: logoutResponse.data.message,
      };
      return httpResponse;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, isFetching, setIsFetching }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
