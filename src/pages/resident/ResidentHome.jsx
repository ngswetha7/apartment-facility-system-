import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/residentHome.css";
import building from "../../assets/apartment.jpg";

export default function ResidentHome({
  username,
  token,
  onCardTap,
  onNavSelect
}) {
  const [data, setData] = useState({
    totalPayments: 0,
    totalRequests: 0,
    totalAnnouncements: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) fetchHomeData();
    else setError("Token missing. Please login.");
  }, [token]);

  const fetchHomeData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/residents/home", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data || {});
    } catch (err) {
      console.error(err);
      setError("Failed to load home data");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 0, label: "Home", icon: "🏠" },
    { id: 1, label: "Payments", icon: "💰" },
    { id: 2, label: "Requests", icon: "🛠" },
    { id: 3, label: "Announcements", icon: "📢" },
    { id: 4, label: "Profile", icon: "👤" },
  ];

  const cards = [
    { id: 1, title: "Payment Due", value: data.totalPayments },
    { id: 2, title: "Requests", value: data.totalRequests },
    { id: 3, title: "Announcements", value: data.totalAnnouncements },
    { id: 4, title: "Events", value: data.totalEvents },
  ];

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="loader">{error}</div>;

  return (
    <div className="resident-home">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Resident Portal</h3>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => onNavSelect(item.id)}   // ✅ FIX
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <div
          className="home-header"
          style={{ backgroundImage: `url(${building})` }}
        >
          <div className="header-content">
            <h2>Welcome, {username} 👋</h2>
          </div>
        </div>

        <div className="card-grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              value={card.value}
              onClick={() => onCardTap(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, onClick }) {
  return (
    <div className="home-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
