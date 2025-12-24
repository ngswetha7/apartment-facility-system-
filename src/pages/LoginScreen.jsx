import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/LoginScreen.css";
import building from "../assets/apartment.jpg";
import { baseUrl } from "../constants";


export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        identifier: email.trim(),
        password,
      });

      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") navigate("/admin-dashboard");
      else if (data.role === "associate") navigate("/associate-dashboard");
      else if (data.role === "resident") navigate("/resident-dashboard");
      else navigate("/tenant-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      {/* BLUR BACKGROUND */}
      <div
        className="bg-blur"
        style={{ backgroundImage: `url(${building})` }}
      ></div>

      {/* LOGIN CARD */}
      <div className="login-card">
        <h2 className="title">Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email / Phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="copyright">© 2025 All Rights Reserved</p>
      </div>
    </div>
  );
}
