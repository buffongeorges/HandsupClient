import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Classes from "./components/Classes/Classes";
import Login from "./components/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Uploader from "./components/Uploader/Uploader";
import Home from "./components/Home/Home";
import Signup from "./components/Signup/Signup";
import Classe from "./components/Classe/Classe";
import Contact from "./components/Contact/Contact";
import EleveEdit from "./components/Eleve/EleveEdit";
import EleveStats from "./components/Eleve/EleveStats";
import Settings from "./components/Settings/Settings";
import { useCallback, useState } from "react";

// auth & redux
import AuthRoutes from "./components/Routes/AuthRoutes.js";
import BasicRoute from "./components/Routes/BasicRoutes.js";

import { connect } from "react-redux";
import ForgottenPassword from "./components/UserManagement/ForgottenPassword.js";
import EmailSent from "./components/UserManagement/EmailSent.js";
import PasswordReset from "./components/UserManagement/PasswordReset.js";
import Dashboard from "./components/Dashboard/Dashboard";
import { sessionService } from "redux-react-session";
import store from "./auth/store";
import { AuthContext } from "./auth/context/AuthContext";

function App({ checked }) {
  const [currentUser, setCurrentUser] = useState();

  const [navbarVisibility, setNavbarVisibility] = useState(true);
  console.log("checked");
  console.log(checked);
  console.log("test");
  console.log(store.getState());
  // checked = true => authenticated
  // checked = false => not authenticiated

  const handleNavbarVisibilty = useCallback((newValue) => {
    setNavbarVisibility(newValue);
  });

  const setAuth = (data) => {
    console.log('data dans setAuth')
    console.log(data);
    if (data) {
      sessionStorage.setItem("professeurId", JSON.stringify(data.user._id));
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("firstname", data.firstname);
      sessionStorage.setItem("lastname", data.lastname);
      sessionStorage.setItem("isAdmin", data.isAdmin);
      setCurrentUser({
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        isAdmin: data.isAdmin,
      });
    } else {
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("firstname");
      sessionStorage.removeItem("lastname");
      sessionStorage.removeItem("isAdmin");
      setCurrentUser();
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser: setAuth }}>
      <Router>
        {checked && (
          <div className="App">
            {navbarVisibility && <Navbar></Navbar>}
            <Routes>
              <Route
                path="/"
                element={<Home handleNavbar={handleNavbarVisibilty} />}
              />
              <Route path="/home" element={<Dashboard />} />
              <Route
                path="/passwordreset/:professeurId/:resetString"
                element={<PasswordReset />}
              />
              <Route element={<AuthRoutes />}>
                {/* all private routes go in here */}
                <Route path="/dashboard" element={<Dashboard />}></Route>
                <Route path="/classes" element={<Classes />} />
                <Route path="/classes/:id" element={<Classe />} />
                <Route
                  path="/student/:studentId/edit"
                  element={<EleveEdit />}
                />
                <Route path="/settings" element={<Settings />} />

                <Route
                  path="/student/:studentId/stats"
                  element={<EleveStats />}
                />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/login/:userEmail" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/emailsent/:userEmail/:reset"
                element={<EmailSent />}
              />
              <Route path="/emailsent/:userEmail" element={<EmailSent />} />
              <Route path="/emailsent" element={<EmailSent />} />
              <Route
                path="/forgottenpassword"
                element={<ForgottenPassword />}
              />

              {/* <Route path="/contact" element={<Contact />} />
            <Route path="/import" element={<Uploader />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<Classe />} />
            <Route path="/student/:studentId/edit" element={<EleveEdit />} />
            <Route path="/student/:studentId/stats" element={<EleveStats />} />
            <Route path="/forgottenpassword" element={<ForgottenPassword />} />

            <Route path="/emailsent/:userEmail/:reset" element={<BasicRoute />}>
            <Route
              path="/emailsent/:userEmail/:reset"
              element={<EmailSent />}
            />
            </Route>

            <Route path="/settings" element={<Settings />} />

            
            <Route path="/login" element={<Login />} />
            <Route path="/login/:userEmail" element={<Login />} />

            <Route path="/dashboard" element={<AuthRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route> */}
            </Routes>
          </div>
        )}
      </Router>
    </AuthContext.Provider>
  );
}

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(App);
