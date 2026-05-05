import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrderById, updateStatus, markPaid, addNote } from "../api/admin.api.js";
import { TopBar } from "../components/Layout.jsx";

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrderById(id).then(setOrder).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleStatus = async (status) => {
    if (!window.confirm(`Update status to "${status}"?`)) return;
    const updated = await updateStatus(id, status);
    setOrder(updated);
  };

  const handleMarkPaid = async () => {
    const updated = await markPaid(id);
    setOrder(updated);
  };

  const handleNote = async () => {
    setSaving(true);
    const updated = await addNote(id, note);
    setOrder(updated);
    setNote("");
    setSaving(false);
  };

  if (loading) return <><TopBar title="Order Detail" /><div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div className="spinner" /></div></>;
  if (!order) return <><TopBar title="Order Detail" /><div style={{ padding: 40, color: "#94a3b8" }}>Order not found.</div></>;

  return (
    <>
      <TopBar title={`Order ${order.orderNumber}`} />
      <div className="main-content">
        <div style={{ marginBottom: 16 }}>
          <Link to="/orders" style={{ color: "#6c63ff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>← Back to Orders</Link>
        </div>

        <div className="order-detail-grid">
          {/* LEFT — main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Order Items */}
            <div className="card">
              <div className="card-header"><span style={{ fontWeight: 700 }}>Order Items</span></div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    {order.items?.map((item, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</td>
                        <td>₹{item.price}</td>
                        <td>{item.quantity}</td>
                        <td style={{ fontWeight: 700, color: "#22c55e" }}>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card">
              <div className="card-header"><span style={{ fontWeight: 700 }}>Shipping Address</span></div>
              <div className="card-body">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, fontSize: 14 }}>
                  {[["Name", order.shippingAddress?.name], ["Phone", order.shippingAddress?.phone], ["Street", order.shippingAddress?.street], ["City", order.shippingAddress?.city], ["State", order.shippingAddress?.state], ["Pincode", order.shippingAddress?.pincode]].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontWeight: 600 }}>{value || "—"}</div>
                    </div>
                  ))}
                </div>
                {order.notes && <div style={{ marginTop: 14, padding: 12, background: "#f8fafc", borderRadius: 8, fontSize: 13, color: "#64748b" }}><strong>Customer Notes:</strong> {order.notes}</div>}
              </div>
            </div>

            {/* Status History */}
            <div className="card">
              <div className="card-header"><span style={{ fontWeight: 700 }}>Status History</span></div>
              <div className="card-body">
                {order.statusHistory?.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6c63ff", marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>{h.status}</div>
                      {h.note && <div style={{ fontSize: 12, color: "#64748b" }}>{h.note}</div>}
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(h.changedAt).toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Note */}
            <div className="card">
              <div className="card-header"><span style={{ fontWeight: 700 }}>Admin Note</span></div>
              <div className="card-body">
                {order.adminNote && <div style={{ background: "#fef3c7", borderRadius: 8, padding: 12, fontSize: 13, marginBottom: 12, color: "#92400e" }}>{order.adminNote}</div>}
                <textarea className="form-input" rows={3} placeholder="Add an internal note..." value={note} onChange={e => setNote(e.target.value)} style={{ resize: "vertical", borderRadius: 8 }} />
                <button className="btn-primary" style={{ marginTop: 10 }} onClick={handleNote} disabled={saving || !note}>{saving ? "Saving..." : "Save Note"}</button>
              </div>
            </div>
          </div>

          {/* RIGHT — summary sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Order Summary */}
            <div className="card">
              <div className="card-header"><span style={{ fontWeight: 700 }}>Order Summary</span></div>
              <div className="card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Items Total</span><span>₹{order.itemsTotal}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Shipping</span><span>{order.shippingCharge === 0 ? "Free" : `₹${order.shippingCharge}`}</span></div>
                  {order.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Discount</span><span style={{ color: "#ef4444" }}>-₹{order.discount}</span></div>}
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
                    <span>Grand Total</span><span style={{ color: "#22c55e" }}>₹{order.grandTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card">
              <div className="card-header"><span style={{ fontWeight: 700 }}>Payment</span></div>
              <div className="card-body">
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Method</div>
                  <div style={{ fontWeight: 600 }}>{order.paymentMethod}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Status</div>
                  <span className={`badge ${order.paymentStatus === "received" ? "badge-delivered" : "badge-pending"}`}>{order.paymentStatus === "received" ? "✓ Paid" : "⏳ COD Pending"}</span>
                </div>
                {order.paymentStatus !== "received" && <button className="btn-success" style={{ width: "100%" }} onClick={handleMarkPaid}>✓ Mark as Paid</button>}
              </div>
            </div>

            {/* Update Status */}
            <div className="card">
              <div className="card-header"><span style={{ fontWeight: 700 }}>Update Status</span></div>
              <div className="card-body">
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Current</div>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {STATUS_FLOW.filter(s => s !== order.status).map(s => (
                    <button key={s} className="btn-outline" onClick={() => handleStatus(s)} style={{ textAlign: "left", textTransform: "capitalize" }}>→ {s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
