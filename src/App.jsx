import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Startup from "./pages/Startup"; // import Startup page
import LoginScreen from "./pages/LoginScreen";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AssociateDashboard from "./pages/associate/AssociateDashboard";
import ResidentDashboard from "./pages/resident/ResidentDashboard";
import TenantDashboard from "./pages/tenant/TenantDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Startup page */}
        <Route path="/" element={<Startup />} />

        {/* Login pages */}
        <Route path="/resident/login" element={<LoginScreen />} />
        <Route path="/admin/login" element={<LoginScreen />} />
        <Route path="/associate/login" element={<LoginScreen />} />
        <Route path="/tenant/login" element={<LoginScreen />} />

        {/* Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/associate" element={<AssociateDashboard />} />
        <Route path="/resident" element={<ResidentDashboard token="dummy" username="user" />} />
        <Route path="/tenant" element={<TenantDashboard token="dummy" username="user" />} />
      </Routes>
    </Router>
  );
}

export default App;
