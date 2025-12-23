import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // ✅ import axios instance
import "../styles/LoginScreen.css";
import building from "../assets/images/building.jpg";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
 const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        identifier: email.trim(), // backend expects 'identifier'
        password,
      });


      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      if (data.role === "admin") navigate("/admin-dashboard");
      else if (data.role === "associate") navigate("/associate-dashboard");
      else if (data.role === "resident")
        navigate("/resident-dashboard", { state: { username: data.name } });
      else navigate("/tenant-dashboard", { state: { username: data.name } });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left"></div>
      <div
  className="login-container"
  style={{
    backgroundImage: `url(${building})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
></div>

      <div className="login-right">
        {error && <p className="error">{error}</p>}
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
        <p className="copyright">© 2025 All Rights Reserved.</p>
      </div>
    </div>
    
  );
}
