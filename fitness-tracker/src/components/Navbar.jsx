import React, { useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SignupModal from "./SignupModal"; // import modal

const navItems = [
  { id: "banner", label: "Banner" },
  { id: "slider", label: "Slider" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact Us" },
];

export default function Navbar() {
  
  const [active, setActive] = useState("banner");
  const [showModal, setShowModal] = useState(false);
  const handleClick = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav 
      className="navbar "
    >
      {/* Logo */}
      <div className="navbar-logo">FitTrack</div>

      {/* Navigation Buttons */}
      <ul className="navbar-nav">
        {navItems.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`nav-button ${active === id ? "active" : ""}`}
              onClick={() => handleClick(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* Auth Buttons */}
      <div className="navbar-auth">
        <button
          className="btn-outline"
          onClick={() => alert("Redirect to login")}
        >
          Login
        </button>
        <button
          className="btn-filled"
          // onClick={() => setShowModal(true)}
        >
          Sign Up
        </button>
      </div>

      {/* <SignupModal isOpen={showModal} onClose={() => setShowModal(false)} /> */}
    </nav>
  );
}
