// src/pages/associate/AssociateDashboard.jsx
import React, { useState } from "react";

const AssociateDashboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tabs = [
    <div>Associate Home</div>,
    <div>Associate Payments</div>,
    <div>Associate Residents</div>,
    <div>Associate Announcements</div>,
    <div>Associate Profile</div>,
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

export default AssociateDashboard;
