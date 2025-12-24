import "../styles/Startup.css";
import apartmentImg from "../assets/apartment.jpg";
import { useNavigate } from "react-router-dom";

export default function Startup() {
  const navigate = useNavigate();

  return (
    <div
      className="startup-wrapper"
      style={{ backgroundImage: `url(${apartmentImg})` }}
    >
      {/* Overlay */}
      <div className="bg-overlay"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          Efficient
        </div>
      </nav>

      {/* HERO */}
      <div className="startup-content">
        <h1 className="fade-in">
          Efficient Resident <br /> Facility Management
        </h1>

        <p className="fade-in delay">
          A smart apartment management system to handle residents, payments,
          maintenance requests and announcements — all in one place.
        </p>

        <div className="buttons fade-in delay-2">
          {/* ✅ DIRECT LOGIN */}
          <button
            className="primary-btn"
            onClick={() => navigate("/")}
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
