// src/pages/products/AllProducts.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, Plus, Edit, Trash2, Package, Sparkles,
  Grid, List, Star, DollarSign, Box, Loader, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ─── Constants ─────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:5000/api';
const STATIC_BASE_URL = 'http://localhost:5000';

// ─── Helper Functions ──────────────────────────────────────────────────────
const imgUrl = (path) => {
  if (!path) return null;
  const cleanPath = path.replace(/^[\\/]+/, '').replace(/\\/g, '/');
  return `${cleanPath}`;
};

const fmtPrice = (v) => {
  if (v == null || v === '') return '—';
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(v);
};

// ─── Axios Instance with Token ────────────────────────────────────────────
const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Sub-components ────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, disabled = false }) => (
  <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50" />
  </label>
);

const Badge = ({ ok, labels }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
    {ok ? labels[0] : labels[1]}
  </span>
);

const StatCard = ({ label, value, sub, Icon, gradient, bg }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
        <Icon size={16} className="text-white" />
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
    <div className="text-sm font-semibold text-slate-700 mt-1">{label}</div>
    <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
  </div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-20">
    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
      <Icon size={32} className="text-slate-400" />
    </div>
    <p className="text-lg font-semibold text-slate-600">{title}</p>
    <p className="text-sm text-slate-400 mt-1">{description}</p>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
export function AllProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('productViewMode') || 'grid';
  });

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/categories'),
        apiClient.get('/brands')
      ]);
      
      setProducts(productsRes.data.data ?? []);
      setCategories(categoriesRes.data.data ?? []);
      setBrands(brandsRes.data.data ?? []);
    } catch (err) {
      console.error('fetchData:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    localStorage.setItem('productViewMode', viewMode);
  }, [viewMode]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This action cannot be undone.')) return;
    try {
      setDeleteLoading(id);
      await apiClient.delete(`/products/${id}`);
      await fetchData();
    } catch (err) {
      console.error('delete:', err);
      alert(err?.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const patch = async (id, payload) => {
    try {
      await apiClient.patch(`/products/${id}`, payload);
      await fetchData();
    } catch (err) {
      console.error('patch:', err);
      alert(err?.response?.data?.message || 'Failed to update product');
    }
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const s = searchTerm.toLowerCase().trim();
      if (s && !p.name?.toLowerCase().includes(s) && !p.brandName?.toLowerCase().includes(s)) return false;
      if (filterCategory !== 'all' && p.category?._id !== filterCategory && p.category !== filterCategory) return false;
      if (filterBrand !== 'all' && p.brand?._id !== filterBrand && p.brand !== filterBrand) return false;
      if (filterStatus === 'active' && !p.isActive) return false;
      if (filterStatus === 'inactive' && p.isActive) return false;
      return true;
    });
  }, [products, searchTerm, filterCategory, filterBrand, filterStatus]);

  const stats = useMemo(() => [
    { label: 'Total Products', value: products.length, sub: `${categories?.length ?? 0} categories`, Icon: Package, gradient: 'from-blue-600 to-sky-400', bg: 'bg-blue-50' },
    { label: 'In Stock', value: products.filter(p => p.inStock).length, sub: `${products.filter(p => !p.inStock).length} out of stock`, Icon: Box, gradient: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50' },
    { label: 'Featured', value: products.filter(p => p.isFeatured).length, sub: 'Premium listings', Icon: Star, gradient: 'from-amber-500 to-orange-400', bg: 'bg-amber-50' },
    { label: 'Inventory Value', value: fmtPrice(products.reduce((s, p) => s + (p.price || 0), 0)), sub: 'Sum of all prices', Icon: DollarSign, gradient: 'from-violet-500 to-purple-400', bg: 'bg-violet-50' },
  ], [products, categories]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleAddProduct = () => {
    navigate('/dashboard/addproduct');
  };

  const handleEditProduct = (id) => {
    navigate(`/dashboard/editproduct/${id}`);
  };

  const handleViewProduct = (id) => {
    navigate(`/dashboard/viewproduct/${id}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-sky-800 shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #38bdf8 0%, transparent 60%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)' }} />
        <div className="relative z-10 px-5 sm:px-7 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest">Product Catalog</span>
              <Sparkles size={13} className="text-amber-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Laboratory <span className="text-sky-400">Equipment</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm mt-1">Manage your full product catalog</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-blue-900 font-bold text-sm rounded-xl hover:bg-white/90 transition shadow-lg w-full sm:w-auto justify-center"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or brand…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-1 sm:flex-none"
            >
              <option value="all">All Categories</option>
              {categories?.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-1 sm:flex-none"
            >
              <option value="all">All Brands</option>
              {brands?.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-1 sm:flex-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 ml-auto">
              {[
                ['grid', Grid, 'Grid View'],
                ['list', List, 'List View']
              ].map(([mode, Icon, title]) => (
                <button
                  key={mode}
                  onClick={() => handleViewModeChange(mode)}
                  title={title}
                  className={`p-2 rounded-lg transition ${viewMode === mode ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <Loader size={36} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              {/* Image */}
              <div
                className="relative h-44 bg-gradient-to-br from-slate-50 to-blue-50 cursor-pointer overflow-hidden"
                onClick={() => handleViewProduct(product._id)}
              >
                {imgUrl(product.mainImage) ? (
                  <img
                    src={imgUrl(product.mainImage)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={36} className="text-slate-300" />
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                    <Star size={9} fill="white" /> FEATURED
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Toggle
                    checked={!!product.isActive}
                    onChange={() => patch(product._id, { isActive: !product.isActive })}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full">
                    {product.brandName ?? product.brand?.name}
                  </span>
                  <Badge ok={product.inStock} labels={['In Stock', 'Out of Stock']} />
                </div>
                <h3
                  className="font-bold text-slate-800 line-clamp-2 cursor-pointer hover:text-blue-600 transition"
                  onClick={() => handleViewProduct(product._id)}
                >
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{product.categoryName ?? product.category?.name}</p>

                <div className="flex items-end justify-between mt-3">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Price</p>
                    <p className="text-lg font-bold text-slate-900">{fmtPrice(product.price)}</p>
                    {product.discountedPrice && product.discountedPrice < product.price && (
                      <p className="text-xs text-slate-400 line-through">{fmtPrice(product.discountedPrice)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditProduct(product._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deleteLoading === product._id}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                      title="Delete"
                    >
                      {deleteLoading === product._id ? <Loader size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === 'list' && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {imgUrl(product.mainImage)
                            ? <img src={imgUrl(product.mainImage)} alt="" className="w-full h-full object-cover" loading="lazy" />
                            : <Package size={16} className="text-slate-400" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="font-semibold text-slate-800 cursor-pointer hover:text-blue-600 transition truncate"
                            onClick={() => handleViewProduct(product._id)}
                          >{product.name}</p>
                          <p className="text-xs text-slate-400 truncate">{product.shortDesc?.slice(0, 50)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{product.brandName ?? product.brand?.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{product.categoryName ?? product.category?.name}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{fmtPrice(product.price)}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => patch(product._id, { inStock: !product.inStock })}
                        className={`text-xs font-bold ${product.inStock ? 'text-emerald-600' : 'text-red-500'} hover:underline transition`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <Toggle
                        checked={!!product.isActive}
                        onChange={() => patch(product._id, { isActive: !product.isActive })}
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => patch(product._id, { isFeatured: !product.isFeatured })}
                        className={`p-1.5 rounded-lg transition ${product.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-400'}`}
                        title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Star size={15} fill={product.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditProduct(product._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deleteLoading === product._id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === product._id ? <Loader size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={Package}
          title="No products found"
          description={searchTerm || filterCategory !== 'all' || filterBrand !== 'all' || filterStatus !== 'all'
            ? "Try adjusting your search or filters"
            : "Click 'Add Product' to get started"}
        />
      )}
    </div>
  );
}