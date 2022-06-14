import React, { useState } from "react";
import { Button } from "../Button";
import { MenuItems } from "./MenuItems";
import "./Navbar.css"; 
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  // const [connected, setConnected] = useState(false);
  const authent = localStorage.getItem('connected');
  const authenticated = JSON.parse(authent);
  console.log("authenticated")
  console.log(authenticated)

  let navigate = useNavigate();   

  // state = { clicked: false, connected: false };

  const handleClick = () => {
    setClicked(!clicked);
    // this.setState({ clicked: !clicked });
  };

  const goToLogin = () => {
    let path = `login`; 
    navigate(path);
  };

  const Logout = () => {
    localStorage.removeItem('connected');
    navigate('/');
  }

    return (
      <nav className="NavbarItems">
        {/* <h1 className="navbar-logo"> */}
        <img src={'/images/handsup-removebg-preview.png'} style={{maxWidth: '100%', maxHeight: '70%'}}/>
        <img src={'/images/thumbnail_hand-finger-up.png'} style={{maxWidth: '100%', maxHeight: '70%'}}/>

        {/* </h1> */}
        <div className="menu-icon" onClick={handleClick}>
          <i
            className={clicked ? "fas fa-times" : "fas fa-bars"}
          ></i>
        </div>
        <ul className={clicked ? "nav-menu active" : "nav-menu"}>
          {authenticated &&
            MenuItems.map((item, index) => {
              return (
                <li key={index}>
                  <a className={item.cName} href={item.url}>
                    {item.title}
                  </a>
                </li>
              );
            })}
        </ul>
        {!authenticated && <Button id="login-button" onClick={goToLogin}>Log In</Button>}
        {authenticated && <Button id="logout-button" onClick={Logout}>Log Out</Button>}
      </nav>
    );
}

export default Navbar;
