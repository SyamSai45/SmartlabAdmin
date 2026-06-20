// src/pages/products/ViewProduct.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Star, Package, Loader, Edit, Trash2,
  CheckCircle, Zap, Shield, Globe, Award, Tag,
  Clock, Boxes, Wifi, ChevronDown, ChevronUp,
  ExternalLink, BadgeCheck, Info, Layers, FlaskConical,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// ─── Constants ─────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://31.97.228.17:5101/api';

// ─── Axios Instance ─────────────────────────────────────────────────────────
const apiClient = axios.create({ baseURL: API_BASE_URL });
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtPrice = (v) => {
  if (v == null || v === '') return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR',
    maximumFractionDigits: 0, minimumFractionDigits: 0,
  }).format(v);
};

const ICON_MAP = { zap: Zap, shield: Shield, globe: Globe, award: Award };
const HighlightIcon = ({ name }) => {
  const Icon = ICON_MAP[name?.toLowerCase()] ?? Zap;
  return <Icon size={18} className="text-white" />;
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: 'overview',       label: 'Overview',       Icon: Info },
  { key: 'specifications', label: 'Specifications',  Icon: Layers },
  { key: 'applications',  label: 'Applications',    Icon: FlaskConical },
  { key: 'faqs',          label: 'FAQs',            Icon: ChevronDown },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
const Badge = ({ ok, labels }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide
    ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
    {ok ? labels[0] : labels[1]}
  </span>
);

const Cert = ({ label }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
    <BadgeCheck size={12} /> {label}
  </span>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition"
      >
        <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-blue-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImage, setActiveImage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get(`/products/${id}`);
      const data = res.data.data;
      setProduct(data);
      setActiveImage(data.mainImage);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      setDeleteLoading(true);
      await apiClient.delete(`/products/${id}`);
      navigate('/dashboard/products');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Loading ──
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader size={36} className="animate-spin text-blue-500" />
        <p className="text-sm text-slate-400 font-medium">Loading product…</p>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
          <Package size={28} className="text-red-400" />
        </div>
        <p className="text-lg font-semibold text-slate-700">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-blue-600 hover:underline">
          Go back
        </button>
      </div>
    </div>
  );

  if (!product) return null;

  const allImages = [product.mainImage, ...(product.gallery ?? [])].filter(Boolean);
  const discount = product.price && product.discountedPrice && product.discountedPrice < product.price
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : null;

  const specs = product.specifications ? Object.entries(product.specifications) : [];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* ── Breadcrumb / Back ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Products
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/editproduct/${product._id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm hover:bg-blue-100 transition"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition disabled:opacity-50"
          >
            {deleteLoading ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-sky-800 shadow-xl">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #38bdf8 0%, transparent 60%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)' }} />
        <div className="relative z-10 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest">Product Detail</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{product.name}</h1>
            <p className="text-white/40 text-xs mt-1">{product.brandName} · {product.categoryName}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {product.isFeatured && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow">
                <Star size={11} fill="white" /> FEATURED
              </span>
            )}
            <Badge ok={product.inStock} labels={['In Stock', 'Out of Stock']} />
            <Badge ok={product.isActive} labels={['Active', 'Inactive']} />
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left: Images ── */}
        <div className="lg:col-span-2 space-y-3">
          {/* Main image */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100 shadow-sm aspect-square flex items-center justify-center">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={56} className="text-slate-300" />
            )}
            {discount && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow">
                -{discount}% OFF
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition
                    ${activeImage === img ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Info ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Brand + ratings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start gap-4 flex-wrap">
              {product.brand?.logo && (
                <img
                  src={product.brand.logo}
                  alt={product.brandName}
                  className="h-10 object-contain"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{product.brandName}</span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">{product.categoryName}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{product.shortDesc}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14}
                    className={s <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'}
                    fill={s <= Math.round(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviews} reviews)</span>
              {product.certifications?.map(c => <Cert key={c} label={c} />)}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Pricing</p>
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-bold text-slate-900">{fmtPrice(product.discountedPrice || product.price)}</span>
              {discount && (
                <>
                  <span className="text-lg text-slate-400 line-through">{fmtPrice(product.price)}</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Save {fmtPrice(product.price - product.discountedPrice)}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock size={14} className="text-blue-400" />
                <span>Lead time: <strong className="text-slate-800">{product.leadTime}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Boxes size={14} className="text-emerald-500" />
                <span>Warranty: <strong className="text-slate-800">{product.warranty}</strong></span>
              </div>
              {product.brand?.website && (
                <a
                  href={product.brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:underline font-semibold"
                >
                  <ExternalLink size={13} /> Brand Website
                </a>
              )}
            </div>
          </div>

          {/* Highlights */}
          {product.highlights?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.highlights.map((h) => (
                <div key={h._id} className="bg-gradient-to-br from-slate-900 via-blue-950 to-sky-900 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <HighlightIcon name={h.icon} />
                  </div>
                  <p className="text-white font-bold text-sm leading-tight">{h.label}</p>
                  <p className="text-white/50 text-[11px]">{h.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Tab nav */}
        <div className="flex overflow-x-auto border-b border-slate-100">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap transition border-b-2 -mb-px
                ${activeTab === key
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Full Description</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{product.fullDesc}</p>
              </div>
              {product.features?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Specifications */}
          {activeTab === 'specifications' && specs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-50">
                  {specs.map(([key, val]) => (
                    <tr key={key} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 pr-6 text-slate-500 font-semibold capitalize w-1/3 whitespace-nowrap">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className="py-3 text-slate-800 font-medium">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Applications */}
          {activeTab === 'applications' && (
            <div className="flex flex-wrap gap-2">
              {product.applications?.map((a, i) => (
                <span key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 text-blue-800 text-sm font-semibold rounded-xl">
                  <Tag size={13} className="text-blue-400" /> {a}
                </span>
              ))}
            </div>
          )}

          {/* FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-3 max-w-2xl">
              {product.faqs?.map((faq) => (
                <FaqItem key={faq._id} q={faq.q} a={faq.a} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Meta strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Created', value: new Date(product.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
          { label: 'Updated', value: new Date(product.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
          { label: 'Product ID', value: product._id?.slice(-8).toUpperCase() },
          { label: 'Slug', value: product.slug },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
          </div>
        ))}
      </div>

    </div>
  );
}