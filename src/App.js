import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Classes from "./components/Classes/Classes";
import Login from "./components/Login/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Signup from "./components/Signup/Signup";
import Classe from "./components/Classe/Classe";
import Contact from "./components/Contact/Contact";
import EleveEdit from "./components/Eleve/EleveEdit";
import EleveStats from "./components/Eleve/EleveStats";
import Settings from "./components/Settings/Settings";
import { useCallback, useContext, useState } from "react";

import ForgottenPassword from "./components/UserManagement/ForgottenPassword.js";
import EmailSent from "./components/UserManagement/EmailSent.js";
import PasswordReset from "./components/UserManagement/PasswordReset.js";
import Dashboard from "./components/Dashboard/Dashboard";
import Evaluations from "./components/Evaluations/Evaluations.js";
import Evaluation from "./components/Evaluation/Evaluation.js";
import Pending from "./components/Pending/Pending.js";
import Statistics from "./components/Statistics/Statistics.js";
import ProtectedRoute from "./components/Routes/ProtectedRoute.js";
import { TailSpin } from "react-loader-spinner";
import { colors } from "./utils/Styles.js";

import AuthContext, {
  AuthContextProvider,
} from "./auth/context/AuthContext.js";

function App() {
  // look for user data by localStorage and with the context value
  const userData = localStorage.getItem("userData");
  const { user, isFetching } = useContext(AuthContext);

  let authenticated = user != null || userData != null;
  console.log("connecté?");
  console.log(authenticated);

  const [navbarVisibility, setNavbarVisibility] = useState(true);
  // authenticated = true => authenticated
  // authenticated = false => not authenticiated

  const handleNavbarVisibilty = useCallback((newValue) => {
    setNavbarVisibility(newValue);
  });

  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
          {navbarVisibility && <Navbar />}
          {isFetching && (
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <TailSpin width="20rem" height="20rem" color={colors.theme} />
            </div>
          )}
          {!isFetching && (
            <Routes>
              <Route
                path="/passwordreset/:professeurId/:resetString"
                element={<PasswordReset />}
              />
              <Route path="/" element={<Navigate to="/classes" />} />

              <Route path="/home" element={<Navigate to="/classes" />} />
              <Route path="/dashboard" element={<Dashboard />}></Route>

              {/* Protected routes */}
              <Route
                path="/classes"
                element={
                  <ProtectedRoute accessBy="authenticated">
                    <Classes handleNavbar={handleNavbarVisibilty} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes/:classId"
                element={
                  <ProtectedRoute accessBy="authenticated">
                    <Classe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/eleves/:eleveId"
                element={
                  <ProtectedRoute accessBy="authenticated">
                    <EleveEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute accessBy="authenticated">
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/evaluations"
                element={
                  <ProtectedRoute accessBy="authenticated">
                    <Evaluations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/evaluation-create"
                element={
                  <ProtectedRoute accessBy="authenticated">
                    <Evaluation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/statistics"
                element={
                  <ProtectedRoute accessBy="authenticated">
                    <Statistics />
                  </ProtectedRoute>
                }
              />

              {/* End of protected routes */}
              <Route path="/pending" element={<Pending />} />
              <Route path="/eleves/:studentId/stats" element={<EleveStats />} />

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
          )}
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
