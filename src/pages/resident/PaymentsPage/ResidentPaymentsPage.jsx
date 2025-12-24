import { useEffect, useState } from "react";
import axios from "axios";
import "../../../styles/ResidentPaymentsPage.css";
import { baseUrl } from "../../../constants";

export default function ResidentPaymentsPage({ token, username }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [maintenance, setMaintenance] = useState(0);
  const [electricity, setElectricity] = useState(0);
  const [water, setWater] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  const [recentPayments, setRecentPayments] = useState([]);

  // 🔹 helper
  const parseToFloat = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    return parseFloat(val) || 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB");
  };

  // ✅ THIS IS WHERE YOU FETCH (IMPORTANT)
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/payments/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rows = res.data || [];

      // calculate totals
      let m = 0,
        e = 0,
        w = 0;

      rows.forEach((p) => {
        m += parseToFloat(p.maintenance_amount);
        e += parseToFloat(p.electricity || 0);
        w += parseToFloat(p.water || 0);
      });

      setMaintenance(m);
      setElectricity(e);
      setWater(w);
      setTotalDue(m + e + w);
      setRecentPayments(rows);
    } catch (err) {
      console.error(err);
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // ✅ fetch automatically when page opens
  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // mark as paid
  const markAsPaid = async (paymentId) => {
    if (!window.confirm("Mark this payment as paid?")) return;

    try {
      await axios.put(
        `${baseUrl}/api/payments/${paymentId}/pay`,
        { receipt_url: "manual" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Payment marked as paid");
      fetchData(); // refresh
    } catch (err) {
      alert("❌ Failed to mark payment");
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const duePayments = recentPayments.filter(
    (p) => (p.status || "").toLowerCase() !== "paid"
  );
  const paidPayments = recentPayments.filter(
    (p) => (p.status || "").toLowerCase() === "paid"
  );

  return (
    <div className="payments-container">
      <h2>Hello, {username}</h2>

      {/* SUMMARY */}
      <div className="payment-summary-card">
        <h3>Current Dues</h3>

        <div className="payment-row">
          <span>Maintenance</span>
          <span>₹{maintenance.toFixed(2)}</span>
        </div>

        <div className="payment-row">
          <span>Electricity</span>
          <span>₹{electricity.toFixed(2)}</span>
        </div>

        <div className="payment-row">
          <span>Water</span>
          <span>₹{water.toFixed(2)}</span>
        </div>

        <hr />

        <div className="payment-row total">
          <span>Total Due</span>
          <span>₹{totalDue.toFixed(2)}</span>
        </div>
      </div>

      {/* DUE PAYMENTS */}
      <h3>Due Payments</h3>
      {duePayments.length === 0 ? (
        <p>No due payments 🎉</p>
      ) : (
        duePayments.map((p) => (
          <div key={p.id} className="due-card">
            <span>Month: {p.month}</span>
            <span>₹{parseToFloat(p.total).toFixed(2)}</span>
            <button onClick={() => markAsPaid(p.id)}>Pay Now</button>
          </div>
        ))
      )}

      {/* HISTORY */}
      <h3>Payment History</h3>
      {paidPayments.length === 0 ? (
        <p>No paid payments</p>
      ) : (
        paidPayments.map((p) => (
          <div key={p.id} className="paid-card">
            <div>Month: {p.month}</div>
            <div>Amount: ₹{parseToFloat(p.total).toFixed(2)}</div>
            <div>Paid On: {formatDate(p.paid_on)}</div>
          </div>
        ))
      )}
    </div>
  );
}
