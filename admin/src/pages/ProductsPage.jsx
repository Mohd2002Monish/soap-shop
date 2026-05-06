import { useState, useEffect } from "react";
import { fetchProducts, updateProduct, deleteProduct, createProduct, fetchCategories, uploadImage } from "../api/admin.api.js";
import { TopBar } from "../components/Layout.jsx";
import ProductForm from "../components/ProductForm.jsx";

/* ─── Products Page ─── */
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | productId
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    Promise.all([fetchProducts({ limit: 50 }), fetchCategories()])
      .then(([pRes, cRes]) => { setProducts(pRes.products || []); setCategories(cRes || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Helpers ── */
  const blankForm = () => ({
    name: "", price: "", discountPrice: "", stock: 0,
    category: categories[0]?._id || "", shortDescription: "",
    description: "", ingredients: "", weight: "", scent: "",
    isActive: true, isFeatured: false, images: [],
  });

  const handleAddClick = () => { setEditing("new"); setForm(blankForm()); };

  const handleEditClick = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, price: p.price, discountPrice: p.discountPrice || "",
      stock: p.stock, category: p.category?._id || p.category || "",
      shortDescription: p.shortDescription || "", description: p.description || "",
      ingredients: p.ingredients || "", weight: p.weight || "", scent: p.scent || "",
      isActive: p.isActive, isFeatured: p.isFeatured, images: p.images || [],
    });
  };

  const handleImagesUpload = async (files) => {
    setUploadingImage(true); setUploadCount(files.length);
    try {
      const results = await Promise.all(
        files.map(file => { const fd = new FormData(); fd.append("image", file); return uploadImage(fd); })
      );
      setForm(f => ({ ...f, images: [...(f.images || []), ...results.map(r => ({ url: r.url, publicId: r.publicId }))] }));
    } catch (e) { alert("Upload failed: " + (e.response?.data?.message || e.message)); }
    finally { setUploadingImage(false); setUploadCount(0); }
  };

  const handleImageRemove = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.name?.trim()) return alert("Product name is required.");
    if (!form.price) return alert("Price is required.");
    if (!form.category) return alert("Please select a category.");
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.discountPrice) payload.discountPrice = null;
      if (!payload.slug) payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (editing === "new") {
        const created = await createProduct(payload);
        setProducts(prev => [created, ...prev]);
      } else {
        const updated = await updateProduct(editing, payload);
        setProducts(prev => prev.map(p => p._id === editing ? { ...p, ...updated } : p));
      }
      setEditing(null);
    } catch (e) { alert(e.response?.data?.message || "Failed to save product"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const handleToggleActive = async (product) => {
    const updated = await updateProduct(product._id, { isActive: !product.isActive });
    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: updated.isActive } : p));
  };

  /* ── Render ── */
  return (
    <>
      <TopBar title="Products" />
      <div className="main-content">

        {/* Shared Add / Edit form — rendered above the table */}
        {editing && (
          <ProductForm
            form={form}
            setForm={setForm}
            categories={categories}
            isNew={editing === "new"}
            saving={saving}
            uploadingImage={uploadingImage}
            uploadCount={uploadCount}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            onImagesUpload={handleImagesUpload}
            onImageRemove={handleImageRemove}
          />
        )}

        {/* Products table */}
        <div className="card">
          <div className="card-header">
            <div>
              <span style={{ fontWeight: 700, display: "block" }}>All Products</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{products.length} product{products.length !== 1 ? "s" : ""} in your store</span>
            </div>
            <button
              className="btn-primary"
              onClick={handleAddClick}
              disabled={!!editing}
              style={{ display: "flex", alignItems: "center", gap: 6, opacity: editing ? 0.5 : 1 }}
            >
              <span style={{ fontSize: 16 }}>+</span> Add Product
            </button>
          </div>

          <div style={{ padding: 0 }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="col-hide-mobile">SKU</th>
                      <th>Price</th>
                      <th className="col-hide-mobile">Sale</th>
                      <th>Stock</th>
                      <th className="col-hide-mobile">Status</th>
                      <th className="col-hide-mobile">Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      const isEditing = editing === product._id;
                      return (
                        <tr
                          key={product._id}
                          style={{
                            background: isEditing ? "rgba(108,99,255,0.04)" : undefined,
                            outline: isEditing ? "2px solid rgba(108,99,255,0.25)" : undefined,
                            outlineOffset: isEditing ? "-2px" : undefined,
                            transition: "background 0.2s",
                          }}
                        >
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {product.images?.[0]?.url
                                  ? <img src={product.images[0].url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  : <span style={{ fontSize: 18 }}>🧼</span>}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>{product.name}</div>
                                <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{product.category?.name || "Uncategorized"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="col-hide-mobile" style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{product.sku || "—"}</td>
                          <td style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>₹{product.price}</td>
                          <td className="col-hide-mobile" style={{ fontWeight: 600, color: product.discountPrice ? "#22c55e" : "#94a3b8" }}>
                            {product.discountPrice ? `₹${product.discountPrice}` : "—"}
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, fontSize: 13, color: product.stock === 0 ? "#ef4444" : product.stock < 5 ? "#f59e0b" : "#22c55e" }}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="col-hide-mobile">
                            <button
                              onClick={() => handleToggleActive(product)}
                              style={{ padding: "4px 12px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: product.isActive ? "#dcfce7" : "#fee2e2", color: product.isActive ? "#166534" : "#991b1b", transition: "all 0.2s" }}
                            >
                              {product.isActive ? "● Active" : "○ Inactive"}
                            </button>
                          </td>
                          <td className="col-hide-mobile" style={{ textAlign: "center" }}>
                            {product.isFeatured
                              ? <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⭐ Yes</span>
                              : <span style={{ color: "#cbd5e1", fontSize: 13 }}>—</span>}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 5 }}>
                              <button
                                onClick={() => isEditing ? setEditing(null) : handleEditClick(product)}
                                style={{ padding: "5px 11px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: isEditing ? "1.5px solid var(--accent)" : "1.5px solid #e2e8f0", background: isEditing ? "rgba(108,99,255,0.08)" : "white", color: isEditing ? "var(--accent)" : "#475569", transition: "all 0.15s", whiteSpace: "nowrap" }}
                                onMouseOver={e => { if (!isEditing) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; } }}
                                onMouseOut={e => { if (!isEditing) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; } }}
                              >
                                {isEditing ? "✕ Close" : "Edit"}
                              </button>
                              {!isEditing && (
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  style={{ padding: "5px 9px", borderRadius: 7, border: "none", background: "#fee2e2", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#991b1b", transition: "all 0.15s" }}
                                  onMouseOver={e => { e.currentTarget.style.background = "#fecaca"; }}
                                  onMouseOut={e => { e.currentTarget.style.background = "#fee2e2"; }}
                                >Del</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {products.length === 0 && !loading && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "60px 20px" }}>
                          <div style={{ fontSize: 32, marginBottom: 12 }}>🧼</div>
                          <div style={{ fontWeight: 600, color: "#475569", marginBottom: 6 }}>No products yet</div>
                          <div style={{ fontSize: 13, color: "#94a3b8" }}>Click "Add Product" above to get started</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
