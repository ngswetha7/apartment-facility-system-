import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ResidentRequests.css"; // styles for layout

export default function ResidentRequests({ token }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Repair");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const typeOptions = {
    Repair: ["Electrical", "Plumbing", "Wall Cracks", "Damaged Ceiling", "Other"],
    Complaint: ["Noise", "Security Concern", "Water Leakage", "Lift Malfunction", "Cleanliness", "Other"],
  };

  // fetch requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/requests/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data || []);
    } catch (e) {
      alert("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setType(typeOptions[category][0]);
    fetchRequests();
  }, [category]);

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/requests`,
        { category, type, description },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      alert("Request submitted");
      setDescription("");
      setType(typeOptions[category][0]);
      fetchRequests();
    } catch (e) {
      alert("Failed to submit request");
    }
  };

  return (
    <div className="resident-requests-container">
      {loading ? (
        <div className="center">Loading...</div>
      ) : (
        <>
          <form className="request-form" onSubmit={submitRequest}>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {Object.keys(typeOptions).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {typeOptions[category].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Additional Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                placeholder="Enter description..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Request
            </button>
          </form>

          <h3>Your Requests</h3>
          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <div className="requests-list">
              {requests.map((req, idx) => {
                const date = new Date(req.created_at || Date.now());
                const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                let statusColor = "red";
                if ((req.status || "").toLowerCase() === "closed") statusColor = "green";
                else if ((req.status || "").toLowerCase() === "in progress") statusColor = "#F4B400";

                return (
                  <div key={idx} className="request-card">
                    <div className="request-header">
                      <span><b>Category:</b> {req.category}</span>
                      <span style={{ color: statusColor, fontWeight: "bold" }}>
                        {req.status?.toUpperCase() || "OPEN"}
                      </span>
                    </div>
                    <div><b>Type:</b> {req.type}</div>
                    <div><b>Description:</b> {req.description}</div>
                    <div><b>Posted on:</b> {formattedDate}</div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
