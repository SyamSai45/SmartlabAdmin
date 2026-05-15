// src/pages/ContactsPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Mail, Phone,
  MessageCircle, CheckCircle, Archive, Eye,
  Trash2, User, Clock, Sparkles, TrendingUp, AlertCircle, Check, X,
  Calendar, Tag, Loader2, RefreshCw,
  Plus, Edit, ToggleLeft, ToggleRight, FolderTree, ChevronDown
} from 'lucide-react';
import { fmtDate, fmtTime } from '../utils/helpers';

/* ─── Premium Stat Card ─── */
function StatCard({ label, value, sub, Icon, color, loading }) {
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
const Badge = ({ status, children }) => {
  const getBadgeClass = (s) => {
    const map = {
      pending: 'badge-amber',
      replied: 'badge-green',
      archived: 'badge-slate',
      read: 'badge-blue',
    };
    return map[s] || 'badge-slate';
  };
  
  const getBadgeText = (s) => {
    const map = {
      pending: 'Pending',
      replied: 'Replied',
      archived: 'Archived',
      read: 'Read',
    };
    return map[s] || s;
  };
  
  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {children || getBadgeText(status)}
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

/* ─── Toast Notification ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
        type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      } text-white`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : type === 'error' ? <AlertCircle size={18} /> : <Mail size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

/* ─── Status Dropdown ─── */
const StatusDropdown = ({ currentStatus, contactId, onStatusChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { value: 'read', label: 'Read', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    { value: 'replied', label: 'Replied', icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50' },
    { value: 'archived', label: 'Archived', icon: Archive, color: 'text-slate-600 bg-slate-50' }
  ];

  const currentStatusObj = statuses.find(s => s.value === currentStatus) || statuses[0];
  const CurrentIcon = currentStatusObj.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
      >
        <CurrentIcon size={14} className={currentStatusObj.color.split(' ')[0]} />
        <span>{currentStatusObj.label}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
            {statuses.map((status) => {
              const Icon = status.icon;
              return (
                <button
                  key={status.value}
                  onClick={() => {
                    onStatusChange(contactId, status.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    currentStatus === status.value
                      ? 'bg-slate-50 text-slate-900 font-medium'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon size={14} className={status.color.split(' ')[0]} />
                  {status.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
export function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
    archived: 0,
    bySubject: []
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({ name: '', description: '', isActive: true });
  const [activeTab, setActiveTab] = useState('contacts');

  // Fetch data on mount
  useEffect(() => {
    fetchContacts();
    fetchSubjects();
    fetchStats();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/contacts/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showToast('Failed to load contacts', 'error');
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/contacts/subjects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/contacts/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const updateContactStatus = async (id, status) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        // Update local state
        setContacts(prev => prev.map(contact => 
          contact._id === id ? { ...contact, status } : contact
        ));
        if (selectedContact?._id === id) {
          setSelectedContact(prev => ({ ...prev, status }));
        }
        await fetchStats();
        showToast(`Status updated to ${status}`, 'success');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(prev => prev.filter(contact => contact._id !== id));
        if (selectedContact?._id === id) {
          setSelectedContact(null);
          setDetailModalOpen(false);
        }
        await fetchStats();
        showToast('Contact deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast('Failed to delete contact', 'error');
    }
  };

  // Subject Management Functions
  const handleCreateSubject = async () => {
    if (!subjectForm.name.trim()) {
      showToast('Subject name is required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/contacts/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subjectForm)
      });
      const data = await response.json();
      if (data.success) {
        await fetchSubjects();
        showToast('Subject created successfully', 'success');
        setSubjectModalOpen(false);
        setSubjectForm({ name: '', description: '', isActive: true });
        setEditingSubject(null);
      }
    } catch (error) {
      console.error('Error creating subject:', error);
      showToast('Failed to create subject', 'error');
    }
  };

  const handleUpdateSubject = async () => {
    if (!subjectForm.name.trim()) {
      showToast('Subject name is required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/contacts/subjects/${editingSubject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subjectForm)
      });
      const data = await response.json();
      if (data.success) {
        await fetchSubjects();
        showToast('Subject updated successfully', 'success');
        setSubjectModalOpen(false);
        setSubjectForm({ name: '', description: '', isActive: true });
        setEditingSubject(null);
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      showToast('Failed to update subject', 'error');
    }
  };

  const handleToggleSubjectStatus = async (subject) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/contacts/subjects/${subject._id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        await fetchSubjects();
        showToast(`Subject ${subject.isActive ? 'deactivated' : 'activated'} successfully`, 'success');
      }
    } catch (error) {
      console.error('Error toggling subject:', error);
      showToast('Failed to toggle subject status', 'error');
    }
  };

  const handleDeleteSubject = async (subject) => {
    if (!window.confirm(`Are you sure you want to delete subject "${subject.name}"?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/contacts/subjects/${subject._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        await fetchSubjects();
        showToast('Subject deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      showToast('Failed to delete subject', 'error');
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statsCards = [
    { label: 'Total Contacts', value: stats.total, sub: 'All time submissions', Icon: MessageCircle, color: 'blue' },
    { label: 'Pending', value: stats.pending, sub: `${stats.pending} awaiting action`, Icon: Clock, color: 'amber' },
    { label: 'Replied', value: stats.replied, sub: `${Math.round((stats.replied/stats.total)*100) || 0}% response rate`, Icon: CheckCircle, color: 'green' },
    { label: 'Archived', value: stats.archived, sub: 'Completed conversations', Icon: Archive, color: 'purple' },
  ];

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setDetailModalOpen(true);
  };

  const openSubjectModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({ 
        name: subject.name, 
        description: subject.description || '', 
        isActive: subject.isActive 
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: '', description: '', isActive: true });
    }
    setSubjectModalOpen(true);
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
              { v: stats.total, l: 'Total', icon: MessageCircle },
              { v: stats.pending, l: 'Pending', icon: Clock },
              { v: stats.read, l: 'Read', icon: CheckCircle },
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
        {statsCards.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'contacts' 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={16} />
              Contacts
            </div>
            {activeTab === 'contacts' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'subjects' 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderTree size={16} />
              Subjects
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                {subjects.length}
              </span>
            </div>
            {activeTab === 'subjects' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        </div>
      </div>

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <>
          {/* Filters */}
          <div className="card p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
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
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                <button 
                  onClick={() => { fetchContacts(); fetchStats(); }} 
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
                  Refresh
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
                    <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Subject</th>
                    <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                    <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {!loading && filteredContacts.map((contact) => (
                    <tr key={contact._id} className="table-row hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center">
                              <User size={16} className="text-white" />
                            </div>
                            {contact.status === 'pending' && (
                              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{contact.name}</p>
                            <p className="text-xs text-slate-400">{contact.email}</p>
                          </div>
                        </div>
                       </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Tag size={12} className="text-slate-400" />
                          <p className="text-sm text-slate-600">{contact.subject?.name || '—'}</p>
                        </div>
                       </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600">{fmtDate(contact.createdAt)}</p>
                        <p className="text-xs text-slate-400">{fmtTime(contact.createdAt)}</p>
                       </td>
                      <td className="px-5 py-4">
                        <StatusDropdown 
                          currentStatus={contact.status}
                          contactId={contact._id}
                          onStatusChange={updateContactStatus}
                          disabled={updating}
                        />
                       </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleSelectContact(contact)} 
                            className="btn-icon" 
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            onClick={() => deleteContact(contact._id)} 
                            className="btn-icon hover:!text-red-500" 
                            title="Delete"
                          >
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
                <p className="text-slate-500">Loading contacts...</p>
              </div>
            )}

            {!loading && filteredContacts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <MessageCircle size={32} className="text-slate-400" />
                </div>
                <p className="text-lg font-medium text-slate-600">No contacts found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Subject Breakdown Section */}
          {stats.bySubject && stats.bySubject.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-slate-500" />
                <h3 className="font-display font-semibold text-slate-800">Inquiries by Subject</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {stats.bySubject.map((subject, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-sm font-medium text-slate-700">{subject._id}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{subject.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-800">Contact Subjects</h3>
              <p className="text-sm text-slate-500 mt-1">Manage categories for contact form inquiries</p>
            </div>
            <button onClick={() => openSubjectModal()} className="btn btn-primary">
              <Plus size={16} />
              Add Subject
            </button>
          </div>

          <div className="grid gap-3">
            {subjects.map((subject) => (
              <div key={subject._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Tag size={16} className="text-blue-500" />
                    <h4 className="font-semibold text-slate-800">{subject.name}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${subject.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {subject.description && (
                    <p className="text-sm text-slate-500 ml-7">{subject.description}</p>
                  )}
                  <p className="text-xs text-slate-400 ml-7 mt-1">
                    Created: {fmtDate(subject.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleSubjectStatus(subject)} 
                    className="btn-icon" 
                    title={subject.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {subject.isActive ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} className="text-slate-400" />}
                  </button>
                  <button 
                    onClick={() => openSubjectModal(subject)} 
                    className="btn-icon" 
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteSubject(subject)} 
                    className="btn-icon hover:!text-red-500" 
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {subjects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FolderTree size={28} className="text-slate-400" />
              </div>
              <p className="text-slate-500">No subjects created yet</p>
              <button onClick={() => openSubjectModal()} className="btn btn-primary mt-4">
                <Plus size={14} /> Create your first subject
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subject Modal */}
      <Modal isOpen={subjectModalOpen} onClose={() => setSubjectModalOpen(false)} title={editingSubject ? 'Edit Subject' : 'Create Subject'}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name *</label>
            <input
              type="text"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              placeholder="e.g., Technical Support"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={subjectForm.description}
              onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
              placeholder="Brief description of this subject category..."
              rows={3}
              className="textarea w-full"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <button
              onClick={() => setSubjectForm({ ...subjectForm, isActive: !subjectForm.isActive })}
              className="flex items-center gap-2"
            >
              {subjectForm.isActive ? (
                <><ToggleRight size={22} className="text-emerald-500" /><span className="text-sm text-emerald-600">Active</span></>
              ) : (
                <><ToggleLeft size={22} className="text-slate-400" /><span className="text-sm text-slate-500">Inactive</span></>
              )}
            </button>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setSubjectModalOpen(false)} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={editingSubject ? handleUpdateSubject : handleCreateSubject} className="btn btn-primary flex-1">
              {editingSubject ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </div>
      </Modal>

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
                <p className="text-slate-500 text-sm">{selectedContact.subject?.name || 'No subject'}</p>
              </div>
              <Badge status={selectedContact.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <Phone size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{selectedContact.phone || '—'}</span>
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

            <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Update Status
              </label>
              <div className="flex gap-2 flex-wrap">
                {['pending', 'read', 'replied', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateContactStatus(selectedContact._id, status)}
                    disabled={updating || selectedContact.status === status}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedContact.status === status
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}