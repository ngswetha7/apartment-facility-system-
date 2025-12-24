import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Main Pages
import Startup from "./pages/Startup";
import LoginScreen from "./pages/LoginScreen";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import AssociateDashboard from "./pages/associate/AssociateDashboard";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import ResidentDashboard from "./pages/resident/ResidentDashboard"; // ✅ FIX

function App() {
  return (
    <Router>
      <Routes>
        {/* Startup & Login */}
        <Route path="/startup" element={<Startup />} />
        <Route path="/" element={<LoginScreen />} />

        {/* Dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/associate-dashboard" element={<AssociateDashboard />} />
        <Route path="/tenant-dashboard" element={<TenantDashboard />} />
        <Route
          path="/resident-dashboard"
          element={<ResidentDashboard token="dummyToken" username="Swetha" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
