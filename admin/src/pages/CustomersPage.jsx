import { useState, useEffect } from "react";
import { fetchCustomers } from "../api/admin.api.js";
import { TopBar } from "../components/Layout.jsx";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers().then(d => setCustomers(Array.isArray(d) ? d : d.users || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar title="Customers" />
      <div className="main-content">
        <div className="card">
          <div className="card-header">
            <span style={{ fontWeight: 700 }}>Registered Customers ({customers.length})</span>
            <input
              className="form-input" style={{ width: 240, padding: "6px 12px" }}
              placeholder="Search by name or email..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Addresses</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>
                          {c.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "#64748b" }}>{c.email}</td>
                    <td style={{ color: "#64748b" }}>{c.phone || "—"}</td>
                    <td><span className={`badge ${c.role === "admin" ? "badge-processing" : "badge-confirmed"}`}>{c.role}</span></td>
                    <td style={{ color: "#64748b" }}>{c.addresses?.length || 0}</td>
                    <td style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: 30 }}>No customers found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomersPage;
