import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  Edit,
  Building2,
  Globe,
  Search,
  Image as ImageIcon,
  X,
} from "lucide-react";

// ─── Axios instance ──────────────────────────────────────────────────────────
// Token is read fresh on every request via the interceptor, so it never goes stale.
const api = axios.create({ baseURL: "https://smartlabtechbackend-p5h6.onrender.com/api" });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Constants ───────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: "", description: "", website: "", logo: null };

// ─── Component ───────────────────────────────────────────────────────────────
const BrandsPage = () => {
  const [brands, setBrands]       = useState([]);
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [preview, setPreview]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [editId, setEditId]       = useState(null);
  const [search, setSearch]       = useState("");
  const [error, setError]         = useState("");
  const fileInputRef              = useRef(null);

  // ── API helpers ─────────────────────────────────────────────────────────────
  const fetchBrands = useCallback(async () => {
    try {
      const { data } = await api.get("/brands");
      setBrands(data.data ?? []);
    } catch (err) {
      console.error("Fetch brands failed:", err);
    }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  // ── Form handlers ────────────────────────────────────────────────────────────
  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleLogo = ({ target: { files } }) => {
    const file = files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, logo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setPreview("");
    setEditId(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("website", formData.website);
    if (formData.logo) fd.append("logo", formData.logo);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = buildFormData();
      if (editId) {
        await api.put(`/brands/${editId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/brands", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchBrands();
    } catch (err) {
      console.error("Submit failed:", err);
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    try {
      await api.delete(`/brands/${id}`);
      fetchBrands();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({ name: item.name, description: item.description, website: item.website, logo: null });
    setPreview(item.logo ? `https://smartlabtechbackend-p5h6.onrender.com/${item.logo.replace(/\\/g, "/")}` : "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const filteredBrands = useMemo(
    () => brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [brands, search]
  );

  const logoUrl = (logo) =>
    logo ? `https://smartlabtechbackend-p5h6.onrender.com/${logo.replace(/\\/g, "/")}` : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-700 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div>
            <h1 className="text-4xl font-bold mb-2">Principles Management</h1>
            <p className="text-slate-200">Manage all laboratory principles</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4">
            <h2 className="text-3xl font-bold">{brands.length}</h2>
            <p className="text-sm text-slate-200">Total Principles</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="text-sky-600" />
            <h2 className="text-2xl font-bold">{editId ? "Update Principle" : "Create Principle"}</h2>
          </div>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-700 transition-colors"
              title="Cancel edit"
            >
              <X size={22} />
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="font-semibold text-sm text-slate-600 block mb-2">Principle Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter principle name"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Website */}
          <div>
            <label className="font-semibold text-sm text-slate-600 block mb-2">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="font-semibold text-sm text-slate-600 block mb-2">Description</label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Logo */}
          <div className="md:col-span-2">
            <label className="font-semibold text-sm text-slate-600 block mb-2">Principle Logo</label>
            <label className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 transition-all">
              <ImageIcon className="text-slate-400 mb-3" />
              <p className="text-sm text-slate-500">Click to upload logo</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogo}
                className="hidden"
              />
            </label>
            {preview && (
              <div className="relative mt-4 w-32">
                <img
                  src={preview}
                  alt="preview"
                  className="w-32 h-32 object-contain rounded-2xl border"
                />
                <button
                  type="button"
                  onClick={() => { setPreview(""); setFormData((p) => ({ ...p, logo: null })); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  title="Remove logo"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-slate-900 to-sky-700 hover:scale-[1.02] transition-all duration-300 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg disabled:opacity-60"
            >
              <Plus size={18} />
              {loading ? "Processing..." : editId ? "Update Principle" : "Create Principle"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-slate-300 text-slate-600 hover:bg-slate-50 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex items-center gap-3">
        <Search className="text-slate-400 shrink-0" size={20} />
        <input
          type="text"
          placeholder="Search principles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Brands Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((item) => (
          <BrandCard
            key={item._id}
            item={item}
            logoUrl={logoUrl}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty */}
      {filteredBrands.length === 0 && (
        <div className="text-center py-16">
          <Building2 size={60} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-500">No Principles Found</h2>
        </div>
      )}
    </div>
  );
};

// ─── Sub-component: Brand Card ────────────────────────────────────────────────
const BrandCard = React.memo(({ item, logoUrl, onEdit, onDelete }) => {
  const url = logoUrl(item.logo);
  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300">
      <div className="h-40 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden mb-5">
        {url ? (
          <img src={url} alt={item.name} className="w-full h-full object-contain" />
        ) : (
          <Building2 size={60} className="text-slate-300" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{item.name}</h2>
      <p className="text-slate-500 text-sm mb-4 line-clamp-3">{item.description}</p>
      {item.website && (
        <a
          href={item.website}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sky-600 font-medium text-sm mb-5"
        >
          <Globe size={16} />
          Visit Website
        </a>
      )}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => onEdit(item)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-xl transition-all"
          title="Edit"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-xl transition-all"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
});

export default BrandsPage;