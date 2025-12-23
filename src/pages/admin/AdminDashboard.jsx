// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";

const AdminDashboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tabs = [
    <div>Admin Home</div>,
    <div>Admin Payments</div>,
    <div>Admin Residents</div>,
    <div>Admin Announcements</div>,
    <div>Admin Profile</div>,
  ];

  const navItems = ["Home", "Payments", "Residents", "Announcements", "Profile"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ flex: 1 }}>{tabs[currentIndex]}</div>
      <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
        {navItems.map((label, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              flex: 1,
              textAlign: "center",
              padding: 10,
              cursor: "pointer",
              background: currentIndex === index ? "#484FD7" : "#fff",
              color: currentIndex === index ? "#fff" : "#000",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
