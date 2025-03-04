import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/StartUPAi_logo_long.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
      <img src={logo} alt="StartupAI Logo" className="logo-image" />
      </div>
      <div className="navbar-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </div>
      <ul className={`navbar-links ${menuOpen ? "navbar-links-active" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/investors">Investors</Link></li>
        <li><Link to="/chat">AI</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
