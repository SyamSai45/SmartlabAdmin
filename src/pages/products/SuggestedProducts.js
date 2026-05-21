// src/components/admin/SuggestedProducts.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, Eye, Trash2, User, Clock, Sparkles, AlertCircle, Check, X,
  Calendar, Tag, Loader2, RefreshCw, Edit, Plus, FileText,
  BookOpen, Award, EyeOff, CheckCircle, XCircle, Archive,
  Heart, Share2, Link2, Quote, Star, TrendingUp, Package,
  DollarSign, ShoppingCart, Users, Zap, Flame, Target, Shield, Globe, Wifi, Bluetooth
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
        type === 'success' ? 'bg-emerald-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      } text-white min-w-[300px]`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70"><X size={16} /></button>
    </motion.div>
  );
};

const ProductCard = ({ product, onToggle, onRemove, onAdd, isSelected, onSelect, isSuggested }) => {
  const getIconComponent = (iconName) => {
    const icons = {
      zap: Zap,
      shield: Shield,
      globe: Globe,
      award: Award,
      wifi: Wifi,
      bluetooth: Bluetooth
    };
    return icons[iconName] || Star;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all group"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={product?.mainImage || product?.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-lg flex items-center gap-1">
              <Award size={10} /> Featured
            </span>
          </div>
        )}
        {isSuggested && product.isActive !== undefined && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs rounded-lg flex items-center gap-1 ${
              product.isActive !== false 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-500 text-white'
            }`}>
              <CheckCircle size={10} /> 
              {product.isActive !== false ? 'Active' : 'Inactive'}
            </span>
          </div>
        )}
        {onSelect && (
          <div className="absolute top-3 left-3 bg-white/90 rounded-lg p-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(product._id, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.brandName}
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {product.categoryName}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
          {product.shortDesc?.substring(0, 80)}...
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-slate-900">₹{product.discountedPrice?.toLocaleString() || product.price?.toLocaleString()}</span>
          {product.discountedPrice && product.discountedPrice < product.price && (
            <>
              <span className="text-sm text-slate-400 line-through">₹{product.price?.toLocaleString()}</span>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        
        {/* Highlights */}
        {product.highlights && product.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {product.highlights.slice(0, 2).map((highlight, idx) => {
              const IconComponent = getIconComponent(highlight.icon);
              return (
                <div key={idx} className="flex items-center gap-1 text-xs text-slate-500">
                  <IconComponent size={10} className="text-blue-500" />
                  <span>{highlight.label}</span>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-slate-700">{product.rating || 4.5}</span>
            <span className="text-xs text-slate-400">({product.reviews || 0})</span>
          </div>
          <div className="flex gap-2">
            {onToggle && (
              <button
                onClick={() => onToggle(product._id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  product.isActive !== false
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {product.isActive !== false ? 'Deactivate' : 'Activate'}
              </button>
            )}
            {onRemove && (
              <button
                onClick={() => onRemove(product._id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
              >
                Remove
              </button>
            )}
            {onAdd && (
              <button
                onClick={() => onAdd(product._id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function SuggestedProducts() {
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('suggested');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    fetchSuggestedProducts();
    fetchAllProducts();
  }, []);

  const fetchSuggestedProducts = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/products/suggestions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data?.products || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      showToast('Failed to load suggested products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAllProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const addToSuggestions = async (productId) => {
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/products/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      
      const data = await response.json();
      if (data.success) {
        showToast('Product added to suggestions successfully', 'success');
        fetchSuggestedProducts();
      } else {
        showToast(data.message || 'Failed to add', 'error');
      }
    } catch (error) {
      showToast('Failed to add product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const removeFromSuggestions = async (productId) => {
    if (!window.confirm('Remove this product from suggestions?')) return;
    
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/products/suggestions/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        showToast('Product removed from suggestions', 'success');
        fetchSuggestedProducts();
      } else {
        showToast(data.message || 'Failed to remove', 'error');
      }
    } catch (error) {
      showToast('Failed to remove product', 'error');
    }
  };

  const toggleSuggestionStatus = async (productId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/products/suggestions/${productId}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchSuggestedProducts();
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const bulkAddToSuggestions = async () => {
    if (selectedProducts.length === 0) {
      showToast('Please select at least one product', 'error');
      return;
    }
    
    if (!window.confirm(`Add ${selectedProducts.length} product(s) to suggestions?`)) return;
    
    try {
      setBulkLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/products/suggestions/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productIds: selectedProducts })
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(data.message, 'success');
        setSelectedProducts([]);
        fetchSuggestedProducts();
      } else {
        showToast(data.message || 'Bulk add failed', 'error');
      }
    } catch (error) {
      showToast('Failed to add products', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSelectProduct = (productId, isChecked) => {
    if (isChecked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredAvailableProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredAvailableProducts.map(p => p._id));
    }
  };

  const suggestionIds = new Set(suggestions.map(s => s.id));
  const availableProducts = allProducts.filter(p => !suggestionIds.has(p._id));
  
  const filteredSuggestedProducts = suggestions.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAvailableProducts = availableProducts.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Suggested Products', value: suggestions.length, icon: Star, color: 'purple' },
    { label: 'Available Products', value: availableProducts.length, icon: Package, color: 'blue' },
    { label: 'Total Products', value: allProducts.length, icon: ShoppingCart, color: 'green' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* Header Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600" />
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)'
        }} />
        
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">
              Product Management
            </span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Suggested <span className="text-purple-200">Products</span>
          </h2>
          <p className="text-white/70 text-sm">
            Manage products that appear in search suggestions and recommendations
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-xl ${stat.color === 'purple' ? 'bg-purple-50' : stat.color === 'blue' ? 'bg-blue-50' : 'bg-emerald-50'} flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.color === 'purple' ? 'text-purple-600' : stat.color === 'blue' ? 'text-blue-600' : 'text-emerald-600'} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-2xl">
        <div className="flex gap-1 px-6">
          <button
            onClick={() => setActiveTab('suggested')}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'suggested' ? 'text-purple-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star size={16} />
              Suggested Products
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">
                {suggestions.length}
              </span>
            </div>
            {activeTab === 'suggested' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'available' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={16} />
              Available Products
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
                {availableProducts.length}
              </span>
            </div>
            {activeTab === 'available' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            {activeTab === 'available' && selectedProducts.length > 0 && (
              <button
                onClick={bulkAddToSuggestions}
                disabled={bulkLoading}
                className="btn btn-primary flex items-center gap-2"
              >
                {bulkLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Add Selected ({selectedProducts.length})
              </button>
            )}
            {activeTab === 'available' && availableProducts.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="btn btn-secondary"
              >
                {selectedProducts.length === filteredAvailableProducts.length && filteredAvailableProducts.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            )}
            <button
              onClick={() => { fetchSuggestedProducts(); fetchAllProducts(); }}
              className="btn btn-secondary"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Products Tab */}
      {activeTab === 'suggested' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full text-center py-16">
              <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
              <p className="text-slate-500">Loading suggested products...</p>
            </div>
          ) : filteredSuggestedProducts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Star size={32} className="text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-600">No suggested products found</p>
              <p className="text-sm text-slate-400 mt-1">Add products from the "Available Products" tab</p>
            </div>
          ) : (
            filteredSuggestedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggle={toggleSuggestionStatus}
                onRemove={removeFromSuggestions}
                isSuggested={true}
                isActive={product.isActive !== false}
              />
            ))
          )}
        </div>
      )}

      {/* Available Products Tab */}
      {activeTab === 'available' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full text-center py-16">
              <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
              <p className="text-slate-500">Loading available products...</p>
            </div>
          ) : filteredAvailableProducts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Package size={32} className="text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-600">No available products found</p>
              <p className="text-sm text-slate-400 mt-1">All products are already in suggestions</p>
            </div>
          ) : (
            filteredAvailableProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  _id: product._id,
                  name: product.name,
                  brandName: product.brandName,
                  categoryName: product.categoryName,
                  price: product.price,
                  discountedPrice: product.discountedPrice,
                  mainImage: product.mainImage,
                  shortDesc: product.shortDesc,
                  highlights: product.highlights,
                  rating: product.rating,
                  reviews: product.reviews,
                  isFeatured: product.isFeatured,
                  isActive: product.isActive
                }}
                onAdd={addToSuggestions}
                onSelect={handleSelectProduct}
                isSelected={selectedProducts.includes(product._id)}
                isSuggested={false}
              />
            ))
          )}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">About Suggested Products</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Suggested products appear in search suggestions and quick recommendations</li>
              <li>• You can activate/deactivate individual suggestions without removing them</li>
              <li>• Use bulk selection to add multiple products at once</li>
              <li>• Products remain in the list until manually removed</li>
              <li>• Featured products are highlighted with a special badge</li>
              <li>• Product highlights (stabilization time, warranty, etc.) are displayed for quick reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}