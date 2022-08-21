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

function App({ checked }) {
  const [navbarVisibility, setNavbarVisibility] = useState(true);

  const handleNavbarVisibilty = useCallback((newValue) => {
    setNavbarVisibility(newValue);
  });
  return (
    <Router>
      {true && (
        <div className="App">
          {navbarVisibility && <Navbar></Navbar>}
          <Routes>
            <Route
              path="/"
              element={<Home handleNavbar={handleNavbarVisibilty} />}
            />
            <Route path="/home" element={<Home />} />
            <Route element={<AuthRoutes />}>
              {/* all private routes go in here */}
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/classes" element={<Classes />} />
              <Route path="/classes/:id" element={<Classe />} />
              <Route path="/student/:studentId/edit" element={<EleveEdit />} />
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
            <Route
              path="/emailsent/:userEmail"
              element={<EmailSent />}
            />
            <Route
              path="/emailsent"
              element={<EmailSent />}
            />
            <Route path="/forgottenpassword" element={<ForgottenPassword />} />

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
  );
}

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
});

export default connect(mapStateToProps)(App);
