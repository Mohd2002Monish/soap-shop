import { useState, useEffect } from "react";
import { fetchCategories, createCategory, deleteCategory } from "../api/admin.api.js";
import { TopBar } from "../components/Layout.jsx";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleNameChange = (val) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !slug) return;
    setSaving(true);
    setError("");
    try {
      const created = await createCategory({ name, slug, description: desc, isActive: true });
      setCategories(prev => [...prev, created]);
      setName(""); setSlug(""); setDesc("");
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await deleteCategory(id);
    setCategories(prev => prev.filter(c => c._id !== id));
  };

  return (
    <>
      <TopBar title="Categories" />
      <div className="main-content">
        <div className="categories-grid">
          {/* List */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontWeight: 700 }}>All Categories ({categories.length})</span>
              {/* Mobile add button */}
              <button
                className="btn-primary"
                onClick={() => setShowForm(f => !f)}
                style={{ display: "none" }}
                id="cat-add-mobile-btn"
              >
                + Add
              </button>
            </div>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Name</th><th className="col-hide-mobile">Slug</th><th className="col-hide-mobile">Description</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{cat.name}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", marginTop: 2 }} className="col-hide-desktop">{cat.slug}</div>
                        </td>
                        <td className="col-hide-mobile" style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{cat.slug}</td>
                        <td className="col-hide-mobile" style={{ fontSize: 13, color: "#64748b", maxWidth: 200 }}>{cat.description || "—"}</td>
                        <td><span className={`badge ${cat.isActive ? "badge-active" : "badge-inactive"}`}>{cat.isActive ? "Active" : "Inactive"}</span></td>
                        <td>
                          <button className="btn-danger" style={{ fontSize: 12 }} onClick={() => handleDelete(cat._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>No categories yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Create Form */}
          <div className="card" style={{ height: "fit-content" }}>
            <div className="card-header"><span style={{ fontWeight: 700 }}>Add Category</span></div>
            <div className="card-body">
              {error && <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 12 }}>{error}</div>}
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: 14 }}>
                  <label className="form-label">Category Name *</label>
                  <input className="form-input" value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Brightening" required />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="form-label">Slug (auto-generated)</label>
                  <input className="form-input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. brightening" style={{ fontFamily: "monospace", color: "#6c63ff" }} required />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description..." style={{ resize: "vertical" }} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={saving}>{saving ? "Creating..." : "Create Category"}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
