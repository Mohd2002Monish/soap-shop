import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchOrders, updateStatus, markPaid } from "../api/admin.api.js";
import { TopBar } from "../components/Layout.jsx";

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders({ page, limit: 15, search, status: statusFilter });
      setOrders(data.orders || []);
      setTotalPages(data.pages || 1);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadOrders(); }, [page, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); loadOrders(); };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    try {
      await updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) { alert("Failed to update status"); }
  };

  const handleMarkPaid = async (orderId) => {
    try {
      await markPaid(orderId);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: "received" } : o));
    } catch (e) { alert("Failed to mark paid"); }
  };

  return (
    <>
      <TopBar title="Orders" />
      <div className="main-content">
        {/* Filters */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <div className="filters-bar" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flex: 1, minWidth: 200 }}>
                <input
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Search order number..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-primary">Search</button>
              </form>
              <select
                className="form-select"
                style={{ width: 160, flexShrink: 0 }}
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">All Statuses</option>
                {STATUS_FLOW.map(s => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span style={{ fontWeight: 700 }}>All Orders ({orders.length})</span>
          </div>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="table-wrap" style={{ display: "block" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th className="col-hide-mobile">Items</th>
                      <th>Total</th>
                      <th className="col-hide-mobile">Payment</th>
                      <th>Status</th>
                      <th className="col-hide-mobile">Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>
                          <Link to={`/orders/${order._id}`} style={{ fontWeight: 700, color: "#6c63ff", textDecoration: "none", fontSize: 13 }}>
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{order.shippingAddress?.name || order.user?.name || "Guest"}</div>
                          <div style={{ color: "#94a3b8", fontSize: 12 }}>{order.shippingAddress?.phone}</div>
                          <div style={{ color: "#94a3b8", fontSize: 12 }}>{order.shippingAddress?.city}</div>
                        </td>
                        <td className="col-hide-mobile" style={{ fontSize: 13 }}>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</td>
                        <td style={{ fontWeight: 700, color: "#22c55e", fontSize: 14 }}>₹{order.grandTotal?.toLocaleString("en-IN")}</td>
                        <td className="col-hide-mobile">
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span className={`badge ${order.paymentStatus === "received" ? "badge-delivered" : "badge-pending"}`}>
                              {order.paymentStatus === "received" ? "Paid" : "COD"}
                            </span>
                            {order.paymentStatus !== "received" && order.status === "delivered" && (
                              <button className="btn-success" style={{ fontSize: 11, padding: "2px 8px" }} onClick={() => handleMarkPaid(order._id)}>Mark Paid</button>
                            )}
                          </div>
                        </td>
                        <td>
                          <select
                            className="form-select"
                            style={{ width: 120, padding: "5px 8px", fontSize: 12 }}
                            value={order.status}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                          >
                            {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="col-hide-mobile" style={{ fontSize: 12, color: "#94a3b8" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td>
                          <Link to={`/orders/${order._id}`}>
                            <button className="btn-outline" style={{ fontSize: 12 }}>View →</button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No orders found</div>}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: 16, borderTop: "1px solid #e2e8f0", flexWrap: "wrap" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding: "6px 12px", borderRadius: 6, border: "1.5px solid", borderColor: p === page ? "#6c63ff" : "#e2e8f0", background: p === page ? "#6c63ff" : "white", color: p === page ? "white" : "#64748b", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
