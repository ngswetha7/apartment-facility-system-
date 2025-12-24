import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../constants";
import "../../styles/ResidentAnnouncements.css";




export default function AnnouncementPage({ token }) {
  const [activeTab, setActiveTab] = useState("announcements"); // 'announcements' or 'events'

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [roles] = useState(["All", "Admin", "Associate"]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  // Events
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [participatingEventIds, setParticipatingEventIds] = useState(new Set());
  const [errorEvents, setErrorEvents] = useState("");

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
  }, []);

  // ------------------- Announcements -------------------
  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const res = await axios.get(`${baseUrl}/api/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data || []);
      setFilteredAnnouncements(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const applyRoleFilter = (role) => {
    setSelectedRole(role);
    if (role === "All") setFilteredAnnouncements(announcements);
    else
      setFilteredAnnouncements(
        announcements.filter(
          (a) => (a.poster_role || "").toLowerCase() === role.toLowerCase()
        )
      );
  };

  // ------------------- Events -------------------
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await axios.get(`${baseUrl}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data || []);
      fetchParticipation();
    } catch (err) {
      setErrorEvents("Failed to load events");
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchParticipation = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/events/participation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = new Set(res.data.map((e) => Number(e.event_id)));
      setParticipatingEventIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleParticipation = async (eventId) => {
    const isParticipating = participatingEventIds.has(eventId);
    try {
      if (isParticipating) {
        await axios.delete(`${baseUrl}/api/events/${eventId}/withdraw`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        participatingEventIds.delete(eventId);
      } else {
        await axios.post(
          `${baseUrl}/api/events/${eventId}/participate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        participatingEventIds.add(eventId);
      }
      setParticipatingEventIds(new Set(participatingEventIds));
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const formatDate = (ts) => {
    try {
      const d = new Date(ts);
      return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getFullYear()}`;
    } catch {
      return ts;
    }
  };

  // ------------------- JSX -------------------
  return (
    <div className="announcement-page">
      <h2>Community Updates</h2>

      <div className="tabs">
        <button
          className={activeTab === "announcements" ? "active" : ""}
          onClick={() => setActiveTab("announcements")}
        >
          Announcements
        </button>
        <button
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
      </div>

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <div className="tab-content">
          <div className="filter">
            <label>Filter by Role: </label>
            <select
              value={selectedRole}
              onChange={(e) => applyRoleFilter(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {loadingAnnouncements ? (
            <p>Loading...</p>
          ) : filteredAnnouncements.length === 0 ? (
            <p>No announcements found</p>
          ) : (
            <div className="card-grid">
              {filteredAnnouncements.map((a, i) => (
                <div className="small-card" key={i}>
                  <h4>{a.title}</h4>
                  <p>{a.message}</p>
                  <small>
                    By {a.name || "Unknown"} | {formatDate(a.created_at)}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="tab-content">
          {loadingEvents ? (
            <p>Loading...</p>
          ) : errorEvents ? (
            <p>{errorEvents}</p>
          ) : events.length === 0 ? (
            <p>No events found</p>
          ) : (
            <div className="card-grid">
              {events.map((e) => (
                <div className="small-card" key={e.id}>
                  <h4>{e.title}</h4>
                  <p>{e.message}</p>
                  <small>Event Date: {formatDate(e.event_date)}</small>
                  <button
                    onClick={() => toggleParticipation(e.id)}
                    className={
                      participatingEventIds.has(e.id) ? "participating" : ""
                    }
                  >
                    {participatingEventIds.has(e.id)
                      ? "Participating"
                      : "Participate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
