// src/pages/ProductsPage.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Edit, Trash2, Eye, EyeOff, Package,
  Sparkles, TrendingUp, Filter, Grid, List, Tag,
  DollarSign, Box, Star, AlertCircle, Save, X,
  Image, Link, Truck, Shield, Award, Zap
} from 'lucide-react';
import { useAppData } from '../context/AppContext';
import { fmtPrice } from '../utils/helpers';

/* ─── Premium Stat Card ─── */
function StatCard({ label, value, sub, Icon, color }) {
  const gradients = {
    blue: 'from-blue-600 to-sky-500',
    amber: 'from-amber-500 to-orange-500',
    green: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-rose-500',
  };

  const bgColors = {
    blue: 'bg-blue-50',
    amber: 'bg-amber-50',
    green: 'bg-emerald-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
  };

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${bgColors[color]} flex items-center justify-center`}>
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg`}>
            <Icon size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
      <div className="text-sm font-semibold text-slate-700 mt-1.5">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}

/* ─── Premium Badge ─── */
const Badge = ({ status, children }) => {
  const getBadgeClass = (s) => {
    const map = {
      active: 'badge-green',
      hidden: 'badge-slate',
      'in-stock': 'badge-green',
      'out-of-stock': 'badge-red',
      featured: 'badge-amber',
    };
    return map[s] || 'badge-slate';
  };
  
  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {children || status}
    </span>
  );
};

/* ─── Premium Toggle ─── */
const Toggle = ({ checked, onChange }) => {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );
};

/* ─── Premium Modal ─── */
const Modal = ({ isOpen, onClose, title, maxWidth = '600px', children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-box" 
        style={{ maxWidth }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            {title}
          </h3>
          <button className="btn-icon !text-white/70 hover:!text-white hover:!bg-white/10" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

/* ─── Main Component ─── */
export function ProductsPage() {
  const { 
    products, categories, addProduct, updateProduct, deleteProduct,
    toggleProductStatus, toggleProductStock, toggleProductFeatured 
  } = useAppData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: '', sku: '', category: '', brand: '', price: '', stock: '',
    description: '', image: '', featured: false, inStock: true, status: 'active'
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;
  const featuredCount = products.filter(p => p.featured).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);

  const stats = [
    { label: 'Total Products', value: totalProducts, sub: `${categories.length} categories`, Icon: Package, color: 'blue' },
    { label: 'In Stock', value: inStockCount, sub: `${outOfStockCount} out of stock`, Icon: Box, color: 'green' },
    { label: 'Featured', value: featuredCount, sub: 'Premium listings', Icon: Star, color: 'amber' },
    { label: 'Inventory Value', value: fmtPrice(totalValue), sub: 'Total stock value', Icon: DollarSign, color: 'purple' },
  ];

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setProductForm({ name: '', sku: '', category: '', brand: '', price: '', stock: '', description: '', image: '', featured: false, inStock: true, status: 'active' });
    setModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm(product);
    setModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      updateProduct({ ...selectedProduct, ...productForm });
    } else {
      addProduct(productForm);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Premium Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #0a1628 0%, #1e3a8a 50%, #0369a1 100%)',
            boxShadow: '0 8px 32px rgba(10,22,40,0.2)'
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(14,165,233,0.4) 0%, transparent 60%)',
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 px-7 py-6 flex items-center justify-between gap-5 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="dot dot-green animate-pulse2" />
              <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
                Product Management
              </span>
              <Sparkles size={14} className="text-amber-400 ml-1" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
              Laboratory <span className="text-sky-400">Equipment</span>
            </h2>
            <p className="text-white/50 text-sm">
              Manage your product catalog and inventory
            </p>
          </div>

          <button onClick={handleAddProduct} className="btn-primary !bg-white !text-blue-900 hover:!bg-white/90">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="select w-44">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="select w-36">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500'}`}>
                <Grid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500'}`}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5 group hover:shadow-lg transition-all"
            >
              <div className="relative h-40 rounded-xl bg-gradient-to-br from-slate-100 to-blue-50 mb-4 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={40} className="text-slate-300" />
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                    <Star size={10} /> FEATURED
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Toggle checked={product.status === 'active'} onChange={() => toggleProductStatus(product.id)} />
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">
                    {product.brand}
                  </span>
                  <Badge status={product.inStock ? 'in-stock' : 'out-of-stock'}>
                    {product.inStock ? `${product.stock} in stock` : 'Out of Stock'}
                  </Badge>
                </div>
                <h3 className="font-display text-base font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{product.sku}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Price</p>
                  <p className="font-display text-lg font-bold text-slate-900">{fmtPrice(product.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEditProduct(product)} className="btn-icon">
                    <Edit size={15} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="btn-icon hover:!text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Product</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">SKU</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Category</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Price</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Stock</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Package size={16} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><code className="text-xs bg-slate-100 px-2 py-1 rounded">{product.sku}</code></td>
                    <td className="px-5 py-4"><span className="text-sm text-slate-600">{product.category}</span></td>
                    <td className="px-5 py-4"><span className="text-sm font-semibold text-slate-800">{fmtPrice(product.price)}</span></td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleProductStock(product.id)} className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                        {product.inStock ? `${product.stock} units` : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <Toggle checked={product.status === 'active'} onChange={() => toggleProductStatus(product.id)} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleProductFeatured(product.id)} className={`btn-icon ${product.featured ? '!text-amber-500' : ''}`}>
                          <Star size={15} fill={product.featured ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={() => handleEditProduct(product)} className="btn-icon"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(product.id)} className="btn-icon hover:!text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Package size={32} className="text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-600">No products found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Product Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedProduct ? 'Edit Product' : 'Add New Product'} maxWidth="700px">
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Product Name *</label>
              <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="input" placeholder="e.g., Analytical Balance" />
            </div>
            <div>
              <label className="form-label">SKU *</label>
              <input type="text" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} className="input" placeholder="e.g., SART-001" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category *</label>
              <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="select">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Brand *</label>
              <input type="text" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="input" placeholder="e.g., Sartorius" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Price (₹) *</label>
              <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="input" placeholder="0" />
            </div>
            <div>
              <label className="form-label">Stock Quantity *</label>
              <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="input" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} className="textarea" placeholder="Product description..." />
          </div>
          <div>
            <label className="form-label">Image URL</label>
            <input type="text" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className="input" placeholder="https://..." />
          </div>
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Featured Product</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={productForm.inStock} onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">In Stock</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
            <button onClick={handleSaveProduct} className="btn btn-primary flex-1">
              <Save size={14} /> {selectedProduct ? 'Update' : 'Create'} Product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}