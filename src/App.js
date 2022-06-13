import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Classes from './components/Classes/Classes';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Uploader from "./components/Uploader/Uploader";
import Home from "./components/Home/Home";
import Classe from "./components/Classe/Classe";
import Contact from "./components/Contact/Contact";
import EleveEdit from "./components/Eleve/EleveEdit";
import EleveStats from "./components/Eleve/EleveStats";
import Settings from "./components/Settings/Settings";
import { useCallback, useState } from "react";

function App() {
  const [navbarVisibility, setNavbarVisibility] = useState(true);

  const handleNavbarVisibilty = useCallback((newValue) => {
    setNavbarVisibility(newValue);
  })
  return (
    <Router>
      <div className="App">
        {navbarVisibility && (<Navbar></Navbar>)}
        <Routes>
          <Route path="/" element={<Home handleNavbar={handleNavbarVisibilty}/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/import" element={<Uploader/>} />
          <Route path="/classes" element={<Classes/>} />
          <Route path="/classes/:id" element={<Classe/>} />
          <Route path="/student/:studentId/edit" element={<EleveEdit/>} />
          <Route path="/student/:studentId/stats" element={<EleveStats/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
