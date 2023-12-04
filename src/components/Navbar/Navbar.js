import React, { useContext, useState } from "react";
import { Button } from "../Button";
import { ProfesseurMenuItems } from "./ProfesseurMenuItems";
import { EleveMenuItems } from "./EleveMenuItems";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth/context/AuthContext";

export const Navbar = () => {
  // look for user data by localStorage and with the context value
  const userData = localStorage.getItem("userData");
  const { user, logout, userType, isFetching, setIsFetching } = useContext(AuthContext);

  const [clicked, setClicked] = useState(false);
  const isTeacher = userType === 'teacher';
  const isStudent = userType === 'student';
  const authenticated = user != null || userData != null;
  console.log("connecté?");
  console.log(authenticated);

  let navigate = useNavigate();

  const handleClick = () => {
    setClicked(!clicked);
    // this.setState({ clicked: !clicked });
  };

  const goToLogin = () => {
    let path = `login`;
    navigate(path);
  };

  const Logout = async () => {
    const result = await logout();
    console.log('result de logout')
    console.log(result)
  };

  return (
    <nav className="NavbarItems">
      {/* <h1 className="navbar-logo"> */}
      <img
        src={"/images/handsup-removebg-preview.png"}
        style={{ maxWidth: "100%", maxHeight: "60%", marginLeft: "1rem" }}
      />
      <img
        src={"/images/icone_handsup.png"}
        style={{ maxWidth: "100%", maxHeight: "60%", marginLeft: "1rem" }}
      />

      {/* </h1> */}
      <div className="menu-icon" onClick={handleClick}>
        {authenticated && (
          <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
        )}
      </div>
      <ul
        className={clicked ? "nav-menu active" : "nav-menu"}
        style={{ marginTop: "1rem" }}
      >
        {authenticated && isTeacher &&
          ProfesseurMenuItems.map((item, index) => {
            return (
              <li key={index}>
                <a className={item.cName} href={item.url}>
                  {item.title}
                </a>
              </li>
            );
          })}
        {authenticated && isStudent &&
          EleveMenuItems.map((item, index) => {
            return (
              <li key={index}>
                <a className={item.cName} href={item.url}>
                  {item.title}
                </a>
              </li>
            );
          })}
      </ul>
      <div
        style={{
          marginLeft: "1rem",
          marginRight: "1rem",
          whiteSpace: "nowrap",
        }}
      >
        {!authenticated && (
          <Button id="login-button" onClick={goToLogin}>
            Log In
          </Button>
        )}
        {authenticated && (
          <Button id="logout-button" onClick={Logout}>
            Log Out
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
