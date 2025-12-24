import { useEffect, useState } from "react";
import axios from "axios";

import ResidentHome from "./ResidentHome";
import ResidentPaymentsPage from "./PaymentsPage/ResidentPaymentsPage";
import ResidentRequests from "./ResidentRequests";
import ResidentAnnouncements from "./ResidentAnnouncements";
import ResidentProfile from "./ResidentProfile";

import { baseUrl } from "../constants";
import "../../styles/ResidentDashboard.css";

export default function ResidentDashboard({ token, username }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkIsOwner = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/residents/is-owner`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsOwner(res.data?.isOwner || false);
      } catch (error) {
        console.error(error);
      }
    };
    checkIsOwner();
  }, [token]);

  const renderBody = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <ResidentHome
            username={username}
            token={token}
            onCardTap={setSelectedIndex}
            onNavSelect={setSelectedIndex}   // ✅ IMPORTANT
          />
        );
      case 1:
        return <ResidentPaymentsPage token={token} username={username} />;
      case 2:
        return <ResidentRequests token={token} />;
      case 3:
        return <ResidentAnnouncements token={token} />;
      case 4:
        return <ResidentProfile token={token} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-body">{renderBody()}</main>
    </div>
  );
}

