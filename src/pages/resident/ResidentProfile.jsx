import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ResidentProfile.css"; // make sure this CSS file exists
import { baseUrl } from "../constants";

export default function ProfilePage({ token }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/residents/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!userData) return <div className="no-data">No data available</div>;

  const renderDetail = (label, value) => (
    <div className="detail-box">
      <span className="detail-label">{label}</span>
      <span className="detail-colon">:</span>
      <span className="detail-value">{value}</span>
    </div>
  );

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      {renderDetail("NAME", userData.name)}
      {renderDetail("EMAIL", userData.email)}
      {renderDetail("PHONE", userData.phone)}
      {renderDetail("FLAT NO", userData.flat_no)}
      {renderDetail("BLOCK", userData.block)}
      {renderDetail("ROLE", userData.role)}

      {userData.role === "resident" && userData.associate && (
        <>
          <h3>Associate Information</h3>
          {renderDetail("NAME", userData.associate.name)}
          {renderDetail("EMAIL", userData.associate.email)}
          {renderDetail("PHONE", userData.associate.phone)}
        </>
      )}

      <div className="logout-container">
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear(); // or your logout logic
            window.location.href = "/"; // redirect to login
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}