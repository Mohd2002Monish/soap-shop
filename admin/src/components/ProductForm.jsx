import { useState, useRef } from "react";

/* ─── Shared input style ─── */
const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0",
  borderRadius: 8, fontSize: 14, fontFamily: "Inter, sans-serif",
  outline: "none", transition: "border-color 0.2s", background: "white",
  color: "#1e293b",
};
const onFocus = (e) => (e.target.style.borderColor = "var(--accent)");
const onBlur  = (e) => (e.target.style.borderColor = "#e2e8f0");

/* ─── Image Uploader ─── */
const ImageUploader = ({ images, onImagesUpload, onImageRemove, isUploading, uploadCount }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!imgs.length) return alert("Please select image files only.");
    onImagesUpload(imgs);
  };

  return (
    <div>
      {/* Previews */}
      {images?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
              <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10, border: "2px solid #e2e8f0", display: "block" }} />
              <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.55)", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "1px 5px" }}>
                {i === 0 ? "Main" : `#${i + 1}`}
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onImageRemove(i); }}
                style={{ position: "absolute", top: -7, right: -7, background: "#ef4444", color: "white", border: "2px solid white", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, lineHeight: 1 }}
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
        style={{ border: `2px dashed ${dragActive ? "var(--accent)" : "#cbd5e1"}`, borderRadius: 12, padding: "22px 16px", textAlign: "center", background: dragActive ? "rgba(108,99,255,0.04)" : "#fafbfc", cursor: "pointer", transition: "all 0.2s" }}
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
            <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{images?.length ? "Add more images" : "Upload product images"}</div>
            <div style={{ fontSize: 11, marginTop: 3 }}>Drag & drop or click · JPG, PNG, WebP</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Section Header ─── */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(108,99,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{subtitle}</div>}
    </div>
  </div>
);

/* ─── Field ─── */
const Field = ({ label, required, children, span = 1 }) => (
  <div style={{ gridColumn: `span ${span}` }} className={span > 1 ? "field-span" : ""}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

/* ─── Toggle Switch ─── */
const Toggle = ({ label, sublabel, checked, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1.5px solid #e2e8f0" }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{sublabel}</div>}
    </div>
    <div
      onClick={onChange}
      style={{ width: 42, height: 24, borderRadius: 12, cursor: "pointer", transition: "background 0.2s", flexShrink: 0, background: checked ? "var(--accent)" : "#cbd5e1", position: "relative" }}
    >
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: checked ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  </div>
);

/* ════════════════════════════════════════
   ProductForm — shared Add / Edit form
   ════════════════════════════════════════
   Props:
     form         – current field values
     setForm      – state setter (or use onChange)
     categories   – array of category objects
     isNew        – true when adding, false when editing
     saving       – bool
     uploadingImage – bool
     uploadCount  – number
     onSave       – async () => void
     onCancel     – () => void
     onImagesUpload – async (files) => void
     onImageRemove  – (index) => void
*/
const ProductForm = ({
  form, setForm, categories,
  isNew, saving, uploadingImage, uploadCount,
  onSave, onCancel, onImagesUpload, onImageRemove,
}) => {
  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div style={{
      background: "white", borderRadius: 16, border: "1px solid #e2e8f0",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 20, overflow: "hidden",
      animation: "scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
    }}>

      {/* ── Header ── */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to right, #fafbff, #f8fafc)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(108,99,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {isNew ? "✨" : "✏️"}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{isNew ? "Add New Product" : "Edit Product"}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
              {isNew ? "Fill in the details below to create a product" : form.name}
            </div>
          </div>
        </div>
        <button
          onClick={onCancel}
          style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#64748b", transition: "all 0.15s" }}
        >×</button>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: 20 }}>
        <div className="product-form-grid" style={{ display: "grid", gap: 24 }}>

          {/* LEFT — Images */}
          <div>
            <SectionHeader icon="🖼️" title="Product Images" subtitle="First image is the main display" />
            <ImageUploader
              images={form.images}
              onImagesUpload={onImagesUpload}
              onImageRemove={onImageRemove}
              isUploading={uploadingImage}
              uploadCount={uploadCount}
            />
          </div>

          {/* RIGHT — Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Basic Info */}
            <div>
              <SectionHeader icon="📝" title="Basic Information" />
              <div className="form-grid-3" style={{ display: "grid", gap: 14 }}>
                <Field label="Product Name" required span={2}>
                  <input style={inputStyle} value={form.name} onChange={e => setF("name", e.target.value)} placeholder="e.g. Lavender Dream Bar" onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Category" required>
                  <select style={inputStyle} value={form.category} onChange={e => setF("category", e.target.value)}>
                    <option value="">Select…</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Short Description" span={3}>
                  <input style={inputStyle} value={form.shortDescription} onChange={e => setF("shortDescription", e.target.value)} placeholder="One-line teaser for product cards…" onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Full Description" span={3}>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.description} onChange={e => setF("description", e.target.value)} placeholder="Detailed product description…" onFocus={onFocus} onBlur={onBlur} />
                </Field>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div>
              <SectionHeader icon="💰" title="Pricing & Inventory" />
              <div className="form-grid-3" style={{ display: "grid", gap: 14 }}>
                <Field label="Price (₹)" required>
                  <input style={inputStyle} type="number" min="0" value={form.price} onChange={e => setF("price", Number(e.target.value))} placeholder="399" onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Sale Price (₹)">
                  <input style={inputStyle} type="number" min="0" value={form.discountPrice} onChange={e => setF("discountPrice", Number(e.target.value))} placeholder="349 (optional)" onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Stock Quantity" required>
                  <input style={inputStyle} type="number" min="0" value={form.stock} onChange={e => setF("stock", Number(e.target.value))} onFocus={onFocus} onBlur={onBlur} />
                </Field>
                {form.discountPrice && form.price && form.discountPrice < form.price && (
                  <div style={{ gridColumn: "span 3" }} className="field-span">
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
              <div className="form-grid-2" style={{ display: "grid", gap: 14 }}>
                <Field label="Weight / Size">
                  <input style={inputStyle} value={form.weight} onChange={e => setF("weight", e.target.value)} placeholder="e.g. 100g" onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Scent Profile">
                  <input style={inputStyle} value={form.scent} onChange={e => setF("scent", e.target.value)} placeholder="e.g. Warm & Floral" onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Ingredients (comma separated)" span={2}>
                  <input style={inputStyle} value={form.ingredients} onChange={e => setF("ingredients", e.target.value)} placeholder="e.g. Goat Milk, Saffron, Shea Butter" onFocus={onFocus} onBlur={onBlur} />
                </Field>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <SectionHeader icon="⚙️" title="Visibility & Tags" />
              <div className="form-grid-2" style={{ display: "grid", gap: 12 }}>
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

      {/* ── Footer ── */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafbfc", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          {form.images?.length
            ? `${form.images.length} image${form.images.length > 1 ? "s" : ""} attached`
            : "No images yet — add at least one for the storefront"}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#64748b", transition: "all 0.2s" }}
          >Cancel</button>
          <button
            onClick={onSave}
            disabled={saving || uploadingImage}
            style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: saving || uploadingImage ? "#a5b4fc" : "var(--accent)", color: "white", fontSize: 14, fontWeight: 700, cursor: saving || uploadingImage ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}
          >
            {saving
              ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />Saving…</>
              : <>{isNew ? "✓ Create Product" : "✓ Save Changes"}</>
            }
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductForm;
