import { useEffect, useState } from "react";
import { fetchOrders, fetchProducts, fetchCustomers } from "../api/admin.api.js";
import { TopBar } from "../components/Layout.jsx";

const StatCard = ({ icon, label, value, sub, color, delay = 0 }) => (
  <div className="stat-card" style={{ animationDelay: `${delay}s` }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
      <div className="stat-icon" style={{ fontSize: 28, lineHeight: 1 }}>{icon}</div>
      <div style={{ background: color + "20", color, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>{sub}</div>
    </div>
    <div className="stat-value" style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", lineHeight: 1, animation: `countUp 0.6s ${0.2 + delay}s ease both`, opacity: 0, animationFillMode: "forwards" }}>{value}</div>
    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5, fontWeight: 500 }}>{label}</div>
  </div>
);

const statusColors = { pending: "#f59e0b", confirmed: "#3b82f6", processing: "#8b5cf6", shipped: "#06b6d4", delivered: "#22c55e", cancelled: "#ef4444" };

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchOrders({ limit: 50, timestamp: Date.now() }), fetchProducts({ limit: 20, timestamp: Date.now() }), fetchCustomers()])
      .then(([o, p, c]) => {
        setOrders(o.orders || []);
        setProducts(p.products || []);
        setCustomers(Array.isArray(c) ? c : c.users || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return (
    <>
      <TopBar title="Dashboard" />
      <div className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div className="spinner" />
      </div>
    </>
  );

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.grandTotal, 0);
  const pending = orders.filter(o => o.status === "pending").length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  const productRevenue = {};
  orders.filter(o => o.status !== "cancelled").forEach(o => {
    o.items?.forEach(item => {
      productRevenue[item.name] = (productRevenue[item.name] || 0) + item.price * item.quantity;
    });
  });
  const topProducts = Object.entries(productRevenue).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <>
      <TopBar
        title="Dashboard"
        rightContent={<button className="btn-outline" onClick={loadData} disabled={loading}>🔄 Refresh</button>}
      />
      <div className="main-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard icon="💰" label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="All time" color="#22c55e" delay={0.05} />
          <StatCard icon="📦" label="Total Orders" value={orders.length} sub={`${pending} pending`} color="#3b82f6" delay={0.1} />
          <StatCard icon="🧼" label="Products" value={products.length} sub="Active" color="#8b5cf6" delay={0.15} />
          <StatCard icon="👥" label="Customers" value={customers.length} sub="Registered" color="#f59e0b" delay={0.2} />
        </div>

        <div className="dashboard-two-col">
          {/* Order Status Distribution */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontWeight: 700, fontSize: 15 }}>Order Status</span>
            </div>
            <div className="card-body">
              {["pending","confirmed","processing","shipped","delivered","cancelled"].map((status, si) => {
                const count = orders.filter(o => o.status === status).length;
                const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                return (
                  <div key={status} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{status}</span>
                      <span style={{ fontSize: 13, color: "#64748b" }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ background: "#f1f5f9", borderRadius: 6, height: 8, overflow: "hidden" }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${pct}%`, height: "100%",
                          background: statusColors[status], borderRadius: 6,
                          transition: "width 0.6s ease",
                          animationDelay: `${si * 0.08}s`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontWeight: 700, fontSize: 15 }}>Top Products</span>
            </div>
            <div className="card-body">
              {topProducts.length === 0 ? (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "30px 0" }}>No orders yet</div>
              ) : topProducts.map(([name, rev], i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                    <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>₹{rev.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontWeight: 700, fontSize: 15 }}>Recent Orders</span>
            <a href="/orders" style={{ fontSize: 13, color: "#6c63ff", fontWeight: 600 }}>View all →</a>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th className="col-hide-mobile">Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="col-hide-mobile">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} style={{ cursor: "pointer" }} onClick={() => window.location.href = `/orders/${order._id}`}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</td>
                    <td style={{ fontSize: 13 }}>
                      <div style={{ fontWeight: 500 }}>{order.shippingAddress?.name || order.user?.name || "Guest"}</div>
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>{order.shippingAddress?.phone}</div>
                    </td>
                    <td className="col-hide-mobile" style={{ fontSize: 13 }}>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</td>
                    <td style={{ fontWeight: 700, color: "#22c55e" }}>₹{order.grandTotal?.toLocaleString("en-IN")}</td>
                    <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                    <td className="col-hide-mobile" style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
