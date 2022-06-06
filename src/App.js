import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Dogs from './components/Dogs/Dogs';
import Cats from './components/Cats/Cats';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Dogs/>} />
          <Route path="/services" element={<Cats/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
