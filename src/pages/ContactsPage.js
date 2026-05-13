// src/pages/ContactsPage.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, Mail, Phone, Building2,
  MessageCircle, CheckCircle, XCircle, Archive, Eye,
  Trash2, MoreVertical, User, Clock, Send, Reply,
  Sparkles, TrendingUp, AlertCircle, Check, X,
  Copy, ExternalLink, Calendar, Tag
} from 'lucide-react';
import { useAppData } from '../context/AppContext';
import { fmtDate, fmtTime } from '../utils/helpers';

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
      pending: 'badge-amber',
      replied: 'badge-green',
      archived: 'badge-slate',
      read: 'badge-green',
      unread: 'badge-blue',
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
export function ContactsPage() {
  const { contacts, markContactRead, updateContactStatus, deleteContact } = useAppData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalContacts = contacts.length;
  const pendingCount = contacts.filter(c => c.status === 'pending').length;
  const unreadCount = contacts.filter(c => !c.read).length;
  const repliedCount = contacts.filter(c => c.status === 'replied').length;

  const stats = [
    { label: 'Total Contacts', value: totalContacts, sub: 'All time submissions', Icon: MessageCircle, color: 'blue' },
    { label: 'Pending Reply', value: pendingCount, sub: `${unreadCount} unread messages`, Icon: Clock, color: 'amber' },
    { label: 'Replied', value: repliedCount, sub: `${Math.round((repliedCount/totalContacts)*100) || 0}% response rate`, Icon: CheckCircle, color: 'green' },
    { label: 'Archived', value: contacts.filter(c => c.status === 'archived').length, sub: 'Completed conversations', Icon: Archive, color: 'purple' },
  ];

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    if (!contact.read) {
      markContactRead(contact.id);
    }
    setDetailModalOpen(true);
  };

  const handleStatusChange = (id, status) => {
    updateContactStatus(id, status);
    if (selectedContact?.id === id) {
      setSelectedContact({ ...selectedContact, status });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id);
      if (selectedContact?.id === id) {
        setSelectedContact(null);
        setDetailModalOpen(false);
      }
    }
  };

  const handleSendReply = () => {
    if (replyText.trim() && selectedContact) {
      updateContactStatus(selectedContact.id, 'replied');
      setReplyText('');
      alert(`Reply sent to ${selectedContact.email}`);
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
            background: 'radial-gradient(circle at 30% 50%, rgba(14,165,233,0.4) 0%, transparent 60%)',
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
              <span className="dot dot-blue animate-pulse2" />
              <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
                Contact Management
              </span>
              <Sparkles size={14} className="text-amber-400 ml-1" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
              Customer <span className="text-sky-400">Inquiries</span>
            </h2>
            <p className="text-white/50 text-sm">
              Manage and respond to contact form submissions
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { v: totalContacts, l: 'Total', icon: MessageCircle },
              { v: pendingCount, l: 'Pending', icon: Clock },
              { v: unreadCount, l: 'Unread', icon: Mail },
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
              placeholder="Search by name, email, or company..."
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
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <button className="btn btn-secondary">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Contact</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Company</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        {!contact.read && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${!contact.read ? 'text-slate-900' : 'text-slate-600'}`}>
                          {contact.name}
                        </p>
                        <p className="text-xs text-slate-400">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">{contact.company || '—'}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-600">{fmtDate(contact.createdAt)}</p>
                    <p className="text-xs text-slate-400">{fmtTime(contact.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={contact.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleSelectContact(contact)} className="btn-icon" title="View Details">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleDelete(contact.id)} className="btn-icon hover:!text-red-500" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <MessageCircle size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-600">No contacts found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Contact Details">
        {selectedContact && (
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-slate-800">{selectedContact.name}</h3>
                <p className="text-slate-500 text-sm">{selectedContact.company || 'No company'}</p>
              </div>
              <Badge status={selectedContact.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <Phone size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{selectedContact.phone}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <Mail size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{selectedContact.email}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl sm:col-span-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{fmtDate(selectedContact.createdAt)} at {fmtTime(selectedContact.createdAt)}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</p>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700 leading-relaxed">{selectedContact.message}</p>
              </div>
            </div>

            {selectedContact.status === 'pending' && (
              <>
                <div className="flex gap-2 mb-6">
                  <button onClick={() => handleStatusChange(selectedContact.id, 'replied')} className="btn btn-primary flex-1">
                    <CheckCircle size={14} /> Mark as Replied
                  </button>
                  <button onClick={() => handleStatusChange(selectedContact.id, 'archived')} className="btn btn-secondary">
                    <Archive size={14} />
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Send Reply</p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="Type your reply..."
                    className="textarea mb-3"
                  />
                  <div className="flex justify-end">
                    <button onClick={handleSendReply} className="btn btn-primary">
                      <Send size={14} /> Send Reply
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}