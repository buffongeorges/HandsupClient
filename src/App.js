import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Classes from './components/Classes/Classes';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Uploader from "./components/Uploader/Uploader";
import Home from "./components/Home/Home";
import Classe from "./components/Classe/Classe";
import Contact from "./components/Contact/Contact";
import Eleve from "./components/Eleve/Eleve";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/import" element={<Uploader/>} />
          <Route path="/classes" element={<Classes/>} />
          <Route path="/classes/:id" element={<Classe/>} />
          <Route path="/classes/:id/:studentId" element={<Eleve/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
