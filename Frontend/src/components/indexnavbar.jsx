import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/indexnavbar.css";
import logo from "../assets/StartUPAi_logo_box.png";

const IndexNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="index-navbar-container">
      <div className="index-navbar-logo">
        <img src={logo} alt="StartupAI Logo" className="index-logo-image" />
      </div>
      <div className="index-navbar-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </div>
      <ul className={`index-navbar-links ${menuOpen ? "index-navbar-links-active" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/calender">Calendar</Link></li>
        <li><Link to="/audio">Audio</Link></li>
        <li><Link to="/investors">Investors</Link></li>
        <li><Link to="/chat">AI</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default IndexNavbar;
