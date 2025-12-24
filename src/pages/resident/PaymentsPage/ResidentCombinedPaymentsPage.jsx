import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../constants";
import "../../styles/ResidentDashboard.css";
import ResidentCombinedPaymentsPage from "./ResidentCombinedPaymentsPage";

export default function ResidentCombinedPaymentsPage({ token, username }) {
  const [activeTab, setActiveTab] = useState("payments"); // "payments" or "rent"
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentPayments, setRecentPayments] = useState([]);
  const [paymentSplit, setPaymentSplit] = useState({ maintenance: 0, electricity: 0, water: 0 });

  const [rentPayments, setRentPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const totalDue = paymentSplit.maintenance + paymentSplit.electricity + paymentSplit.water;

  useEffect(() => {
    fetchDashboardData();
    fetchRentPayments();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/payments/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentSplit({
        maintenance: res.data.paymentSplit?.maintenance || 0,
        electricity: res.data.paymentSplit?.electricity || 0,
        water: res.data.paymentSplit?.water || 0,
      });
      setRecentPayments(res.data.recentPayments || []);
      setIsLoading(false);
    } catch (err) {
      setErrorMessage("Failed to load dashboard");
      setIsLoading(false);
    }
  };

  const fetchRentPayments = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/tenant-payments/tenants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRentPayments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsPaid = async (id) => {
    if (!window.confirm("Mark this payment as paid?")) return;
    try {
      await axios.put(`${baseUrl}/api/payments/${id}/pay`, { receipt_url: "manual-entry" }, { headers: { Authorization: `Bearer ${token}` } });
      fetchDashboardData();
      alert("✅ Marked as Paid");
    } catch {
      alert("❌ Payment failed");
    }
  };

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return date;
    }
  };

  const filteredRent = statusFilter === "All" ? rentPayments : rentPayments.filter((r) => r.status === statusFilter);

  return (
    <div className="combined-payments-container" style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <h2>Hi, {username}</h2>

      {/* Tabs */}
      <div className="tabs" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <button className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}>Payment Due</button>
        <button className={activeTab === "rent" ? "active" : ""} onClick={() => setActiveTab("rent")}>Rental</button>
      </div>

      {activeTab === "payments" && (
        <div className="payments-tab">
          {isLoading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            <>
              <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
                <h3>Current Utility Fee</h3>
                <div className="fee-row"><span>Maintenance:</span> <span>₹{paymentSplit.maintenance.toFixed(2)}</span></div>
                <div className="fee-row"><span>Electricity:</span> <span>₹{paymentSplit.electricity.toFixed(2)}</span></div>
                <div className="fee-row"><span>Water:</span> <span>₹{paymentSplit.water.toFixed(2)}</span></div>
                <hr />
                <div className="fee-row" style={{ fontWeight: "bold", fontSize: "18px" }}><span>Total:</span> <span>₹{totalDue.toFixed(2)}</span></div>
              </div>

              <div className="card" style={{ padding: "20px" }}>
                <h3>Due Payments</h3>
                {recentPayments.filter(p => p.status !== "Paid").length === 0 ? (
                  <p style={{ color: "green" }}>No due payments!</p>
                ) : (
                  recentPayments.filter(p => p.status !== "Paid").map((p) => (
                    <div key={p.id} className="payment-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
                      <span>Month: {p.month}</span>
                      <span>₹{p.total.toFixed(2)}</span>
                      <button onClick={() => markAsPaid(p.id)}>Pay Now</button>
                    </div>
                  ))
                )}

                <h3 style={{ marginTop: "20px" }}>Payment History</h3>
                {recentPayments.filter(p => p.status === "Paid").length === 0 ? (
                  <p>No paid payments</p>
                ) : (
                  recentPayments.filter(p => p.status === "Paid").map((p) => (
                    <div key={p.id} className="payment-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f0f0f0" }}>
                      <span>{p.month}</span>
                      <span>₹{p.total.toFixed(2)}</span>
                      <span>Paid On: {formatDate(p.paid_on)}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "rent" && (
        <div className="rent-tab">
          <div style={{ marginBottom: "10px" }}>
            <label>Status Filter: </label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All</option>
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
          </div>

          {filteredRent.map((r, i) => (
            <div key={i} className="rent-row" style={{ display: "flex", justifyContent: "space-between", padding: "15px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "10px" }}>
              <span>{r.name} | {r.flat_no} | {r.month}</span>
              <span>Status: {r.status}</span>
              <span>₹{r.rent}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
