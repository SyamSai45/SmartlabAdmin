// src/components/admin/GetQuote.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, Mail, Phone, Building2,
  MessageCircle, CheckCircle, XCircle, Archive, Eye,
  Trash2, MoreVertical, User, Clock, Send, Reply,
  Sparkles, TrendingUp, AlertCircle, Check, X,
  Copy, ExternalLink, Calendar, Tag, Loader2, RefreshCw,
  DollarSign, Package, MapPin, Users, FileText, Briefcase,
  ShoppingCart, Percent, Star, Award, Truck, Shield, AlertTriangle
} from 'lucide-react';

// Helper functions
const fmtDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const fmtTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/* ─── Toast Notification ─── */
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
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${type === 'success' ? 'bg-emerald-500' :
          type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
        } text-white min-w-[300px]`}
    >
      {type === 'success' ? <CheckCircle size={18} /> :
        type === 'error' ? <AlertCircle size={18} /> :
          type === 'warning' ? <AlertTriangle size={18} /> : <Sparkles size={18} />}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <X size={16} />
      </button>
    </motion.div>
  );
};

/* ─── Premium Stat Card ─── */
function StatCard({ label, value, sub, Icon, color, loading }) {
  const gradients = {
    blue: 'from-blue-600 to-sky-500',
    amber: 'from-amber-500 to-orange-500',
    green: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-rose-500',
    indigo: 'from-indigo-600 to-purple-500',
    slate: 'from-slate-500 to-slate-600',
  };

  const bgColors = {
    blue: 'bg-blue-50',
    amber: 'bg-amber-50',
    green: 'bg-emerald-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
    indigo: 'bg-indigo-50',
    slate: 'bg-slate-50',
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
      {loading ? (
        <div className="h-9 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
      ) : (
        <div className="font-display text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
      )}
      <div className="text-sm font-semibold text-slate-700 mt-1.5">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}

/* ─── Premium Badge ─── */
const Badge = ({ status }) => {
  const getBadgeClass = () => {
    const map = {
      pending: 'badge-amber',
      processing: 'badge-blue',
      quoted: 'badge-purple',
      approved: 'badge-green',
      rejected: 'badge-red',
      completed: 'badge-slate',
    };
    return map[status] || 'badge-slate';
  };

  const getBadgeText = () => {
    const map = {
      pending: 'Pending',
      processing: 'Processing',
      quoted: 'Quoted',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
    };
    return map[status] || status;
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {getBadgeText()}
    </span>
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

/* ─── Status Dropdown - Fixed Overflow Issue ─── */
const StatusDropdown = ({ currentStatus, quoteId, onStatusChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const statuses = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { value: 'processing', label: 'Processing', icon: RefreshCw, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { value: 'quoted', label: 'Quoted', icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { value: 'completed', label: 'Completed', icon: Archive, color: 'text-slate-600', bgColor: 'bg-slate-50' }
  ];

  const currentStatusObj = statuses.find(s => s.value === currentStatus) || statuses[0];
  const CurrentIcon = currentStatusObj.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
      >
        <CurrentIcon size={14} className={currentStatusObj.color} />
        <span>{currentStatusObj.label}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
          {statuses.map((status) => {
            const Icon = status.icon;
            return (
              <button
                key={status.value}
                onClick={() => {
                  onStatusChange(quoteId, status.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${currentStatus === status.value
                    ? `${status.bgColor} text-slate-900 font-medium`
                    : 'hover:bg-slate-50 text-slate-600'
                  }`}
              >
                <Icon size={14} className={status.color} />
                {status.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
function GetQuote() {
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    quoted: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    recent: 0
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch quotes and stats on mount
  useEffect(() => {
    fetchQuotes();
    fetchStats();
  }, [filterStatus]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = 'https://smartlabtechbackend-p5h6.onrender.com/api/quotes/admin/quotes';

      if (filterStatus !== 'all') {
        url += `?status=${filterStatus}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setQuotes(data.data);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      showToast('Failed to load quotes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/quotes/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const updateQuoteStatus = async (id, status) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/quotes/admin/quotes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        setQuotes(prev => prev.map(quote =>
          quote._id === id ? { ...quote, status } : quote
        ));
        if (selectedQuote?._id === id) {
          setSelectedQuote(prev => ({ ...prev, status }));
        }
        await fetchStats();
        showToast(`Quote status updated to ${status}`, 'success');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const deleteQuote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote request?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/quotes/admin/quotes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setQuotes(prev => prev.filter(quote => quote._id !== id));
        if (selectedQuote?._id === id) {
          setSelectedQuote(null);
          setDetailModalOpen(false);
        }
        await fetchStats();
        showToast('Quote deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      showToast('Failed to delete quote', 'error');
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const statsCards = [
    { label: 'Total Requests', value: stats.total, sub: 'All time quotes', Icon: FileText, color: 'blue' },
    { label: 'Pending', value: stats.pending, sub: 'Awaiting action', Icon: Clock, color: 'amber' },
    { label: 'Processing', value: stats.processing, sub: 'In review', Icon: RefreshCw, color: 'indigo' },
    { label: 'Quoted', value: stats.quoted, sub: 'Price sent', Icon: DollarSign, color: 'purple' },
    { label: 'Approved', value: stats.approved, sub: `${Math.round((stats.approved / stats.total) * 100) || 0}% conversion`, Icon: CheckCircle, color: 'green' },
    { label: 'Completed', value: stats.completed, sub: 'Orders fulfilled', Icon: Archive, color: 'slate' },
  ];

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Premium Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.4) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="dot dot-purple animate-pulse2" />
            <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
              Quote Management
            </span>
            <Sparkles size={14} className="text-purple-300 ml-1" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Quote <span className="text-purple-300">Requests</span>
          </h2>
          <p className="text-white/50 text-sm">
            Manage and track customer quote requests
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        {statsCards.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, company, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select w-36"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="quoted">Quoted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={() => { fetchQuotes(); fetchStats(); }}
              className="btn btn-secondary"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Product</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Company / City</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Quantity</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && filteredQuotes.map((quote) => (
                <tr key={quote._id} className="table-row hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{quote.name}</p>
                        <p className="text-xs text-slate-400">{quote.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{quote.phoneNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">{quote.productName}</p>
                      <p className="text-xs text-slate-400">{quote.categoryName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">{quote.company || '—'}</p>
                    <p className="text-xs text-slate-400">{quote.city || '—'}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Package size={12} className="text-slate-400" />
                      <p className="text-sm text-slate-700">{quote.quantity} unit(s)</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-600">{fmtDate(quote.createdAt)}</p>
                    <p className="text-xs text-slate-400">{fmtTime(quote.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusDropdown
                      currentStatus={quote.status}
                      quoteId={quote._id}
                      onStatusChange={updateQuoteStatus}
                      disabled={updating}
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleSelectQuote(quote)} className="btn-icon" title="View Details">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => deleteQuote(quote._id)} className="btn-icon hover:!text-red-500" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="text-center py-16">
            <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Loading quote requests...</p>
          </div>
        )}

        {!loading && filteredQuotes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FileText size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-600">No quote requests found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Quote Detail Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Quote Request Details" maxWidth="800px">
        {selectedQuote && (
          <div className="p-6">
            {/* Customer Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-slate-800">{selectedQuote.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Mail size={12} />
                    <span>{selectedQuote.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Phone size={12} />
                    <span>{selectedQuote.phoneNumber}</span>
                  </div>
                </div>
              </div>
              <Badge status={selectedQuote.status} />
            </div>

            {/* Company Info */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <Building2 size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{selectedQuote.company || '—'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{selectedQuote.city || '—'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl sm:col-span-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{fmtDate(selectedQuote.createdAt)} at {fmtTime(selectedQuote.createdAt)}</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Product Information</p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="text-sm font-medium text-slate-800">{selectedQuote.categoryName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Product</p>
                    <p className="text-sm font-medium text-slate-800">{selectedQuote.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Quantity</p>
                    <p className="text-sm font-medium text-slate-800">{selectedQuote.quantity} unit(s)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Details */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Usage / Purpose</p>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700 leading-relaxed">{selectedQuote.usage}</p>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Update Quote Status
              </label>
              <div className="flex gap-2 flex-wrap">
                {['pending', 'processing', 'quoted', 'approved', 'rejected', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateQuoteStatus(selectedQuote._id, status)}
                    disabled={updating || selectedQuote.status === status}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${selectedQuote.status === status
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  window.location.href = `mailto:${selectedQuote.email}?subject=Quote Request - ${selectedQuote.productName}`;
                }}
                className="flex-1 btn btn-primary"
              >
                <Mail size={14} /> Send Email
              </button>
              <button
                onClick={() => deleteQuote(selectedQuote._id)}
                className="flex-1 btn btn-secondary !text-red-600 hover:!bg-red-50"
              >
                <Trash2 size={14} /> Delete Request
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default GetQuote;