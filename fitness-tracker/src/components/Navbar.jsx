import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const navItems = [
  { id: "banner", label: "Banner" },
  { id: "slider", label: "Slider" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact Us" },
];

export default function Navbar({ onSignupClick, onLoginClick }) {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [active, setActive] = useState("banner");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // Close menu on click (mobile)
  };

  return (
    <nav className="landing-navbar">
      <img 
        src="/assets/logo.png"
        alt="Animated GIF"
        className="h-20 w-30"
        style={{ backgroundColor: "transparent" }}
      />

      {/* Hamburger Icon */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>

      {/* Navigation Buttons */}
      <ul className={`landing-navbar-nav ${menuOpen ? "active" : ""}`}>
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
        <div className="mobile-auth">
          <button className="btn-outline" onClick={onLoginClick}>
            Login
          </button>
          <button className="btn-filled" onClick={onSignupClick}>
            Sign Up
          </button>
        </div>
      </ul>

      <div className="landing-navbar-auth">
        <button className="btn-outline" onClick={onLoginClick}>
          Login
        </button>
        <button className="btn-filled" onClick={onSignupClick}>
          Sign Up
        </button>
      </div>
    </nav>
  );
}
