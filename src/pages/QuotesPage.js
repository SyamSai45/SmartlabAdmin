// src/pages/QuotesPage.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, Mail, Phone, Building2,
  FileText, CheckCircle, XCircle, Clock, Eye,
  Trash2, User, Send, Sparkles, TrendingUp,
  Package, MapPin, Hash, Briefcase, DollarSign,
  Calendar, Tag, Truck, Shield, Award, Zap,
  MoreVertical, Download, Printer, Copy, AlertCircle,
  Check, X, Save
} from 'lucide-react';
import { useAppData } from '../context/AppContext';
import { fmtDate, fmtTime, fmtPrice } from '../utils/helpers';

/* ─── Premium Stat Card ─── */
function StatCard({ label, value, sub, Icon, trend, trendUp, color }) {
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
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          }`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
            {trend}%
          </div>
        )}
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
      pending: 'badge-amber',
      sent: 'badge-blue',
      approved: 'badge-green',
      rejected: 'badge-red',
      expired: 'badge-slate',
    };
    return map[s] || 'badge-slate';
  };
  
  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {children || status}
    </span>
  );
};

/* ─── Premium Modal ─── */
const Modal = ({ isOpen, onClose, title, maxWidth = '700px', children }) => {
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
export  function QuotesPage() {
  const { quotes, updateQuoteStatus, deleteQuote } = useAppData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [discount, setDiscount] = useState('');

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalQuotes = quotes.length;
  const pendingCount = quotes.filter(q => q.status === 'pending').length;
  const approvedCount = quotes.filter(q => q.status === 'approved').length;
  const sentCount = quotes.filter(q => q.status === 'sent').length;
  const totalValue = quotes.reduce((sum, q) => sum + (q.quotedPrice || 0), 0);
  const conversionRate = totalQuotes > 0 ? Math.round((approvedCount / totalQuotes) * 100) : 0;

  const stats = [
    { label: 'Total Quotes', value: totalQuotes, sub: `${sentCount} sent to clients`, Icon: FileText, trend: 18, trendUp: true, color: 'blue' },
    { label: 'Pending Review', value: pendingCount, sub: 'Awaiting response', Icon: Clock, color: 'amber' },
    { label: 'Approved', value: approvedCount, sub: `${conversionRate}% conversion rate`, Icon: CheckCircle, trend: 12, trendUp: true, color: 'green' },
    { label: 'Total Value', value: fmtPrice(totalValue), sub: 'Quoted amount', Icon: DollarSign, color: 'purple' },
  ];

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    setQuotePrice(quote.quotedPrice?.toString() || '');
    setDiscount('');
    setQuoteNotes('');
    setDetailModalOpen(true);
  };

  const handleStatusChange = (id, status) => {
    updateQuoteStatus(id, status);
    if (selectedQuote?.id === id) {
      setSelectedQuote({ ...selectedQuote, status });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quote request?')) {
      deleteQuote(id);
      if (selectedQuote?.id === id) {
        setSelectedQuote(null);
        setDetailModalOpen(false);
      }
    }
  };

  const handleSendQuote = () => {
    if (selectedQuote && quotePrice) {
      const finalPrice = discount ? parseFloat(quotePrice) * (1 - parseFloat(discount) / 100) : parseFloat(quotePrice);
      updateQuoteStatus(selectedQuote.id, 'sent', { quotedPrice: finalPrice });
      alert(`Quote sent to ${selectedQuote.email} for ${fmtPrice(finalPrice)}`);
      setDetailModalOpen(false);
    }
  };

  const calculateTotal = () => {
    if (!quotePrice) return 0;
    const price = parseFloat(quotePrice);
    const qty = parseInt(selectedQuote?.quantity) || 1;
    const subtotal = price * qty;
    if (discount) {
      return subtotal * (1 - parseFloat(discount) / 100);
    }
    return subtotal;
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
            background: 'radial-gradient(circle at 50% 40%, rgba(14,165,233,0.4) 0%, transparent 60%)',
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
              <span className="dot dot-amber animate-pulse2" />
              <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
                Quote Management
              </span>
              <Sparkles size={14} className="text-amber-400 ml-1" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
              Customer <span className="text-sky-400">Quotations</span>
            </h2>
            <p className="text-white/50 text-sm">
              Manage and respond to quote requests from customers
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { v: totalQuotes, l: 'Total', icon: FileText },
              { v: pendingCount, l: 'Pending', icon: Clock },
              { v: approvedCount, l: 'Approved', icon: CheckCircle },
            ].map(({ v, l, icon: Icon }) => (
              <div
                key={l}
                className="text-center px-5 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon size={14} className="text-white/60" />
                  <div className="font-display text-2xl font-bold text-white">{v}</div>
                </div>
                <div className="text-[11px] text-white/50 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
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
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="btn btn-secondary">
              <Filter size={14} /> Filter
            </button>
            <button className="btn btn-primary">
              <Download size={14} /> Export
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
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Qty</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Value</th>
                <th className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{quote.name}</p>
                        <p className="text-xs text-slate-400">{quote.company || quote.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">{quote.product}</p>
                    <p className="text-xs text-slate-400">{quote.usage}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-700">{quote.quantity} units</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-600">{fmtDate(quote.createdAt)}</p>
                    <p className="text-xs text-slate-400">{fmtTime(quote.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={quote.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-800">
                      {quote.quotedPrice ? fmtPrice(quote.quotedPrice) : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleSelectQuote(quote)} className="btn-icon" title="View Details">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleDelete(quote.id)} className="btn-icon hover:!text-red-500" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FileText size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-600">No quotes found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Quote Detail Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Quote Request Details">
        {selectedQuote && (
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-800">{selectedQuote.name}</h3>
                  <p className="text-slate-500 text-sm">{selectedQuote.company} • {selectedQuote.city}</p>
                </div>
              </div>
              <Badge status={selectedQuote.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Contact Information</p>
                <p className="text-sm text-slate-700 flex items-center gap-2 mb-1">
                  <Phone size={12} /> {selectedQuote.phone}
                </p>
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <Mail size={12} /> {selectedQuote.email}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Product Details</p>
                <p className="text-sm text-slate-700 flex items-center gap-2 mb-1">
                  <Package size={12} /> {selectedQuote.product}
                </p>
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <Hash size={12} /> Quantity: {selectedQuote.quantity} • {selectedQuote.usage}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Location</p>
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <MapPin size={12} /> {selectedQuote.city || 'Not specified'}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Submitted</p>
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <Calendar size={12} /> {fmtDate(selectedQuote.createdAt)} at {fmtTime(selectedQuote.createdAt)}
                </p>
              </div>
            </div>

            {selectedQuote.status === 'pending' && (
              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-display text-lg font-bold text-slate-800 mb-4">Generate Quote</h4>
                
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="form-label">Unit Price (₹)</label>
                    <input
                      type="number"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      placeholder="0"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Discount (%)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Delivery (weeks)</label>
                    <input type="text" placeholder="2-3" className="input" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Subtotal ({selectedQuote.quantity} units):</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {quotePrice ? fmtPrice(parseFloat(quotePrice) * parseInt(selectedQuote.quantity)) : '—'}
                    </span>
                  </div>
                  {discount && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-slate-600">Discount ({discount}%):</span>
                      <span className="text-sm text-green-600">
                        -{fmtPrice((parseFloat(quotePrice) * parseInt(selectedQuote.quantity) * parseFloat(discount) / 100))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                    <span className="font-semibold text-slate-800">Total:</span>
                    <span className="font-display text-xl font-bold text-blue-700">
                      {fmtPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    rows={2}
                    placeholder="Terms, conditions, or special instructions..."
                    className="textarea"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={handleSendQuote} className="btn btn-primary flex-1">
                    <Send size={14} /> Send Quote to Customer
                  </button>
                  <button className="btn btn-secondary">
                    <Printer size={14} /> Preview
                  </button>
                </div>
              </div>
            )}

            {selectedQuote.status === 'sent' && (
              <div className="border-t border-slate-200 pt-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="font-medium text-green-700">Quote Sent</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Quote was sent for {fmtPrice(selectedQuote.quotedPrice || 0)}. Awaiting customer response.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleStatusChange(selectedQuote.id, 'approved')} className="btn btn-primary flex-1">
                    <CheckCircle size={14} /> Mark as Approved
                  </button>
                  <button onClick={() => handleStatusChange(selectedQuote.id, 'rejected')} className="btn btn-danger">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            )}

            {selectedQuote.status === 'approved' && (
              <div className="border-t border-slate-200 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-700">Quote Approved</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    This quote has been approved for {fmtPrice(selectedQuote.quotedPrice || 0)}.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}