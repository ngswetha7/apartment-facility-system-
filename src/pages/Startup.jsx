import "../styles/Startup.css"; // if you moved it to src/styles

import apartmentImg from "../assets/apartment.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Startup() {
  const navigate = useNavigate();
  const [showLoginChoice, setShowLoginChoice] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token && (role === "resident" || role === "user")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div
      className="startup-wrapper"
      style={{ backgroundImage: `url(${apartmentImg})` }}
    >
      {/* Overlay */}
      <div className="bg-overlay"></div>

      {/* SIMPLE NAVBAR - Only Logo */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          Efficient
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="startup-content">
        <h1 className="fade-in">
          Efficient Resident <br /> Facility Management
        </h1>

        <p className="fade-in delay">
          A smart apartment management system to handle residents, payments,
          maintenance requests and announcements — all in one place.
        </p>

        <div className="buttons fade-in delay-2">
          {/* Get Started Button - ALWAYS shows modal for login choice */}
          <button
            className="primary-btn"
            onClick={() => setShowLoginChoice(true)}
          >
            Get Started
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/explore")}
          >
            Explore
          </button>
        </div>
      </div>

      {/* LOGIN CHOICE MODAL */}
      {showLoginChoice && (
        <div className="choice-overlay" onClick={() => setShowLoginChoice(false)}>
          <div className="choice-box" onClick={(e) => e.stopPropagation()}>
            <h2>Choose Login Type</h2>
            <button
              className="primary-btn"
              onClick={() => {
                setShowLoginChoice(false);
                navigate("/resident/login");
              }}
              style={{ marginBottom: "10px" }}
            >
              Resident Login
            </button>
            <button
              className="secondary-btn"
              onClick={() => {
                setShowLoginChoice(false);
                navigate("/admin/login");
              }}
            >
              Admin Login
            </button>
            <div 
              className="close-text" 
              onClick={() => setShowLoginChoice(false)}
            >
              Cancel
            </div>
          </div>
        </div>
      )}

    

      {/* STATS */}
      <section className="stats">
        <div>
          <h2>120+</h2>
          <p>Residents</p>
        </div>
        <div>
          <h2>60+</h2>
          <p>Apartments</p>
        </div>
        <div>
          <h2>250+</h2>
          <p>Requests Solved</p>
        </div>
      </section>
    </div>
  );
}