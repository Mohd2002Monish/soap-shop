import { useState, useEffect, useRef } from "react";
import { fetchProducts, updateProduct, deleteProduct, createProduct, fetchCategories, uploadImage } from "../api/admin.api.js";
import { TopBar } from "../components/Layout.jsx";

/* ─── Image Uploader ─── */
const ImageUploader = ({ images, onImagesUpload, onImageRemove, isUploading, uploadCount }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return alert("Please select image files only.");
    onImagesUpload(imageFiles);
  };

  return (
    <div>
      {/* Uploaded Previews */}
      {images?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
              <img
                src={img.url} alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10, border: "2px solid #e2e8f0", display: "block" }}
              />
              {/* Order badge */}
              <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.55)", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "1px 5px" }}>
                {i === 0 ? "Main" : `#${i + 1}`}
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onImageRemove(i); }}
                style={{
                  position: "absolute", top: -7, right: -7,
                  background: "#ef4444", color: "white", border: "2px solid white",
                  borderRadius: "50%", width: 22, height: 22, fontSize: 12,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, lineHeight: 1
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragActive ? "var(--accent)" : "#cbd5e1"}`,
          borderRadius: 12, padding: "22px 16px", textAlign: "center",
          background: dragActive ? "rgba(108,99,255,0.04)" : "#fafbfc",
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple ref={fileInputRef} style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
        {isUploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#64748b" }}>
            <div className="spinner" style={{ width: 22, height: 22 }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Uploading {uploadCount > 1 ? `${uploadCount} images` : "image"}…</span>
          </div>
        ) : (
          <div style={{ color: "#94a3b8" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>🖼️</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>
              {images?.length ? "Add more images" : "Upload product images"}
            </div>
            <div style={{ fontSize: 11, marginTop: 3 }}>Drag & drop or click · JPG, PNG, WebP · Multiple allowed</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Section Header ─── */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(108,99,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{subtitle}</div>}
    </div>
  </div>
);

/* ─── Field ─── */
const Field = ({ label, required, children, span = 1 }) => (
  <div style={{ gridColumn: `span ${span}` }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0",
  borderRadius: 8, fontSize: 14, fontFamily: "Inter, sans-serif",
  outline: "none", transition: "border-color 0.2s", background: "white",
  color: "#1e293b"
};

/* ─── Toggle Switch ─── */
const Toggle = ({ label, sublabel, checked, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1.5px solid #e2e8f0" }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{sublabel}</div>}
    </div>
    <div
      onClick={onChange}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
        background: checked ? "var(--accent)" : "#cbd5e1",
        position: "relative"
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "white",
        position: "absolute", top: 3, left: checked ? 21 : 3,
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
      }} />
    </div>
  </div>
);

/* ─── Products Page ─── */
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
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

  const blankForm = () => ({
    name: "", price: "", discountPrice: "", stock: 0,
    category: categories[0]?._id || "", shortDescription: "",
    description: "", ingredients: "", weight: "", scent: "",
    isActive: true, isFeatured: false, images: []
  });

  const handleAddClick = () => { setEditing("new"); setForm(blankForm()); };

  const handleEditClick = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, price: p.price, discountPrice: p.discountPrice || "",
      stock: p.stock, category: p.category?._id || p.category || "",
      shortDescription: p.shortDescription || "", description: p.description || "",
      ingredients: p.ingredients || "", weight: p.weight || "", scent: p.scent || "",
      isActive: p.isActive, isFeatured: p.isFeatured, images: p.images || []
    });
  };

  const handleImagesUpload = async (files) => {
    setUploadingImage(true); setUploadCount(files.length);
    try {
      const results = await Promise.all(files.map(file => {
        const fd = new FormData(); fd.append("image", file); return uploadImage(fd);
      }));
      setForm(f => ({ ...f, images: [...(f.images || []), ...results.map(r => ({ url: r.url, publicId: r.publicId }))] }));
    } catch (e) { alert("Upload failed: " + (e.response?.data?.message || e.message)); }
    finally { setUploadingImage(false); setUploadCount(0); }
  };

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

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const renderForm = () => (
    <div style={{
      background: "white", borderRadius: 16, border: "1px solid #e2e8f0",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 24, overflow: "hidden"
    }}>
      {/* Form Header */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to right, #fafbff, #f8fafc)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(108,99,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {editing === "new" ? "✨" : "✏️"}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
              {editing === "new" ? "Add New Product" : "Edit Product"}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
              {editing === "new" ? "Fill in the details below to create a product" : form.name}
            </div>
          </div>
        </div>
        <button
          onClick={() => setEditing(null)}
          style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#64748b", transition: "all 0.15s" }}
        >×</button>
      </div>

      <div style={{ padding: 24 }}>
        <div className="product-form-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 28 }}>

          {/* LEFT COLUMN – Images */}
          <div>
            <SectionHeader icon="🖼️" title="Product Images" subtitle="First image is the main display" />
            <ImageUploader
              images={form.images}
              onImagesUpload={handleImagesUpload}
              onImageRemove={(i) => setF("images", form.images.filter((_, idx) => idx !== i))}
              isUploading={uploadingImage}
              uploadCount={uploadCount}
            />
          </div>

          {/* RIGHT COLUMN – Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Basic Info */}
            <div>
              <SectionHeader icon="📝" title="Basic Information" />
              <div className="form-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Field label="Product Name" required span={2}>
                  <input style={inputStyle} value={form.name} onChange={e => setF("name", e.target.value)} placeholder="e.g. Lavender Dream Bar" onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
                <Field label="Category" required>
                  <select style={inputStyle} value={form.category} onChange={e => setF("category", e.target.value)}>
                    <option value="">Select…</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Short Description" span={3}>
                  <input style={inputStyle} value={form.shortDescription} onChange={e => setF("shortDescription", e.target.value)} placeholder="One-line teaser for product cards…" onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
                <Field label="Full Description" span={3}>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.description} onChange={e => setF("description", e.target.value)} placeholder="Detailed product description…" onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div>
              <SectionHeader icon="💰" title="Pricing & Inventory" />
              <div className="form-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Field label="Price (₹)" required>
                  <input style={inputStyle} type="number" min="0" value={form.price} onChange={e => setF("price", Number(e.target.value))} placeholder="399" onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
                <Field label="Sale Price (₹)">
                  <input style={inputStyle} type="number" min="0" value={form.discountPrice} onChange={e => setF("discountPrice", Number(e.target.value))} placeholder="349 (optional)" onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
                <Field label="Stock Quantity" required>
                  <input style={inputStyle} type="number" min="0" value={form.stock} onChange={e => setF("stock", Number(e.target.value))} onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
                {/* Discount % preview */}
                {form.discountPrice && form.price && form.discountPrice < form.price && (
                  <div style={{ gridColumn: "span 3" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#166534", fontWeight: 600 }}>
                      ✓ {Math.round((1 - form.discountPrice / form.price) * 100)}% discount applied
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <SectionHeader icon="🌿" title="Product Details" subtitle="Optional but recommended for the storefront" />
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Weight / Size">
                  <input style={inputStyle} value={form.weight} onChange={e => setF("weight", e.target.value)} placeholder="e.g. 100g" onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
                <Field label="Scent Profile">
                  <input style={inputStyle} value={form.scent} onChange={e => setF("scent", e.target.value)} placeholder="e.g. Warm & Floral" onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
                <Field label="Ingredients (comma separated)" span={2}>
                  <input style={inputStyle} value={form.ingredients} onChange={e => setF("ingredients", e.target.value)} placeholder="e.g. Goat Milk, Saffron, Shea Butter, Castor Oil" onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </Field>
              </div>
            </div>

            {/* Visibility Toggles */}
            <div>
              <SectionHeader icon="⚙️" title="Visibility & Tags" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Toggle
                  label="Active (Visible on store)"
                  sublabel={form.isActive ? "Customers can see this product" : "Hidden from storefront"}
                  checked={form.isActive}
                  onChange={() => setF("isActive", !form.isActive)}
                />
                <Toggle
                  label="Featured Product"
                  sublabel={form.isFeatured ? "Shown in featured sections" : "Not featured"}
                  checked={form.isFeatured}
                  onChange={() => setF("isFeatured", !form.isFeatured)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: "16px 24px", borderTop: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fafbfc"
      }}>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          {form.images?.length
            ? `${form.images.length} image${form.images.length > 1 ? "s" : ""} attached`
            : "No images yet — add at least one for the storefront"}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setEditing(null)}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#64748b", transition: "all 0.2s" }}
          >Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || uploadingImage}
            style={{
              padding: "9px 24px", borderRadius: 8, border: "none",
              background: saving || uploadingImage ? "#a5b4fc" : "var(--accent)",
              color: "white", fontSize: 14, fontWeight: 700, cursor: saving || uploadingImage ? "not-allowed" : "pointer",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8
            }}
          >
            {saving ? (
              <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />Saving…</>
            ) : (
              <>{editing === "new" ? "✓ Create Product" : "✓ Save Changes"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TopBar title="Products" />
      <div className="main-content">
        {/* Add form rendered outside card at top */}
        {editing === "new" && renderForm()}

        <div className="card">
          <div className="card-header">
            <div>
              <span style={{ fontWeight: 700, display: "block" }}>All Products</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{products.length} product{products.length !== 1 ? "s" : ""} in your store</span>
            </div>
            <button className="btn-primary" onClick={handleAddClick} disabled={editing === "new"} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>+</span> Add Product
            </button>
          </div>

          <div style={{ padding: "0" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th><th>SKU</th><th>Price</th><th>Sale</th><th>Stock</th><th>Status</th><th>Featured</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        {editing === product._id ? (
                          <td colSpan={8} style={{ padding: 20, background: "#f8fafc" }}>{renderForm()}</td>
                        ) : (
                          <>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {product.images?.[0]?.url
                                    ? <img src={product.images[0].url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <span style={{ fontSize: 20 }}>🧼</span>}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{product.name}</div>
                                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{product.category?.name || "Uncategorized"}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{product.sku || "—"}</td>
                            <td style={{ fontWeight: 700, color: "#1e293b" }}>₹{product.price}</td>
                            <td style={{ fontWeight: 600, color: product.discountPrice ? "#22c55e" : "#94a3b8" }}>
                              {product.discountPrice ? `₹${product.discountPrice}` : "—"}
                            </td>
                            <td>
                              <span style={{ fontWeight: 700, fontSize: 14, color: product.stock === 0 ? "#ef4444" : product.stock < 5 ? "#f59e0b" : "#22c55e" }}>
                                {product.stock}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleToggleActive(product)}
                                style={{
                                  padding: "4px 12px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                  background: product.isActive ? "#dcfce7" : "#fee2e2",
                                  color: product.isActive ? "#166534" : "#991b1b"
                                }}
                              >
                                {product.isActive ? "● Active" : "○ Inactive"}
                              </button>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {product.isFeatured
                                ? <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⭐ Yes</span>
                                : <span style={{ color: "#cbd5e1", fontSize: 13 }}>—</span>}
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button
                                  onClick={() => handleEditClick(product)}
                                  style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #e2e8f0", background: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569", transition: "all 0.15s" }}
                                >Edit</button>
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  style={{ padding: "5px 12px", borderRadius: 7, border: "none", background: "#fee2e2", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#991b1b" }}
                                >Delete</button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
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
