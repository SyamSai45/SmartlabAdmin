// src/components/admin/HomeTestimonials.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit, Save, X, Sparkles, RefreshCw, Loader2, CheckCircle,
  AlertCircle, AlertTriangle, Plus, Trash2, MessageSquare,
  ToggleLeft, ToggleRight, Tag, Type, FileText
} from 'lucide-react';

const BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com/api/homepage';

/* ─── Toast ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const cfg = {
    success: { bg: 'bg-emerald-500', icon: <CheckCircle size={18} /> },
    error:   { bg: 'bg-red-500',     icon: <AlertCircle size={18} /> },
    warning: { bg: 'bg-amber-500',   icon: <AlertTriangle size={18} /> },
    info:    { bg: 'bg-blue-500',    icon: <Sparkles size={18} /> },
  };
  const { bg, icon } = cfg[type] || cfg.info;
  return (
    <motion.div initial={{ opacity: 0, x: 20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 20, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${bg} text-white min-w-[300px]`}>
      {icon}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70"><X size={16} /></button>
    </motion.div>
  );
};

/* ─── Main Component ─── */
export function HomeTestimonialsDetails() {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [isEditing, setIsEditing]     = useState(false);
  const [toast, setToast]             = useState(null);

  const [form, setForm] = useState({
    tag: '', title: '', description: '', isActive: true,
  });

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const getToken  = () => sessionStorage.getItem('token');

  /* ── Fetch ── */
  const fetchSection = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${BASE_URL}/testimonials`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success && data.data) {
        setSectionData(data.data);
        setForm({
          tag:         data.data.tag         || '',
          title:       data.data.title       || '',
          description: data.data.description || '',
          isActive:    data.data.isActive    !== false,
        });
      } else {
        setSectionData(null);
      }
    } catch (err) {
      console.error('fetchSection:', err);
      showToast('Failed to load testimonials section', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSection(); }, []);

  /* ── Create / Update ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    try {
      setSubmitting(true);
      const method = sectionData ? 'PUT' : 'POST';
      const res    = await fetch(`${BASE_URL}/testimonials`, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast(sectionData ? 'Section updated!' : 'Section created!', 'success');
        await fetchSection();
        setIsEditing(false);
      } else showToast(data.message || 'Failed to save', 'error');
    } catch (err) {
      showToast('Failed to save section', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!window.confirm('Delete the entire Testimonials section? This cannot be undone.')) return;
    try {
      setSubmitting(true);
      const res  = await fetch(`${BASE_URL}/testimonials`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success) {
        showToast('Section deleted!', 'success');
        setSectionData(null);
        setForm({ tag: '', title: '', description: '', isActive: true });
        setIsEditing(false);
      } else showToast(data.message || 'Failed to delete', 'error');
    } catch (err) { showToast('Failed to delete', 'error'); }
    finally { setSubmitting(false); }
  };

  const cancelEdit = () => {
    if (sectionData) setForm({
      tag:         sectionData.tag         || '',
      title:       sectionData.title       || '',
      description: sectionData.description || '',
      isActive:    sectionData.isActive    !== false,
    });
    setIsEditing(false);
  };

  const statCards = sectionData ? [
    { label: 'Tag',            value: sectionData.tag   || '—', icon: Tag,     color: 'violet' },
    { label: 'Title',          value: sectionData.title || '—', icon: Type,    color: 'blue'   },
    { label: 'Section Status', value: sectionData.isActive !== false ? 'Live' : 'Hidden',
      icon: sectionData.isActive !== false ? ToggleRight : ToggleLeft,
      color: sectionData.isActive !== false ? 'green' : 'slate' },
    { label: 'Description',    value: sectionData.description ? '✓ Set' : '—', icon: FileText, color: 'slate' },
  ] : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }} />
        <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.6) 0%, transparent 60%)' }} />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="dot dot-white animate-pulse2" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Homepage Management</span>
            <MessageSquare size={14} className="text-white/70 ml-1" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Testimonials <span className="text-violet-200">Section</span>
          </h2>
          <p className="text-white/75 text-sm">Configure the testimonials section header and visibility</p>
        </div>
      </div>

      {/* Stats */}
      {statCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="stat-card group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  s.color === 'violet' ? 'bg-violet-50' :
                  s.color === 'blue'   ? 'bg-blue-50'   :
                  s.color === 'green'  ? 'bg-emerald-50' : 'bg-slate-50'
                }`}>
                  <s.icon size={18} className={
                    s.color === 'violet' ? 'text-violet-600' :
                    s.color === 'blue'   ? 'text-blue-600'   :
                    s.color === 'green'  ? 'text-emerald-600' : 'text-slate-400'
                  } />
                </div>
              </div>
              <div className="text-lg font-bold text-slate-900 truncate">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Card */}
      <div className="card p-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Loading section...</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex gap-3 flex-wrap">
                {sectionData && !isEditing && (
                  <>
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                      <Edit size={15} /> Edit
                    </button>
                    <button onClick={handleDelete} disabled={submitting}
                      className="btn btn-secondary !text-red-600 hover:!bg-red-50">
                      <Trash2 size={15} /> Delete
                    </button>
                  </>
                )}
                <button onClick={fetchSection} disabled={loading} className="btn btn-secondary">
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
            </div>

            {/* View Mode */}
            {sectionData && !isEditing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Tag',         value: sectionData.tag,         icon: Tag,      accent: 'violet' },
                    { label: 'Title',       value: sectionData.title,       icon: Type,     accent: 'blue'   },
                    { label: 'Description', value: sectionData.description, icon: FileText, accent: 'slate'  },
                  ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-4 ${
                      s.accent === 'violet' ? 'bg-violet-50 border-violet-400' :
                      s.accent === 'blue'   ? 'bg-blue-50 border-blue-400' :
                                             'bg-slate-50 border-slate-300'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <s.icon size={13} className={
                          s.accent === 'violet' ? 'text-violet-600' :
                          s.accent === 'blue'   ? 'text-blue-600'   : 'text-slate-500'
                        } />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800">{s.value || '—'}</p>
                    </div>
                  ))}
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  sectionData.isActive !== false
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {sectionData.isActive !== false
                    ? <><ToggleRight size={14} /> Section is Live</>
                    : <><ToggleLeft  size={14} /> Section is Hidden</>}
                </div>
              </motion.div>
            )}

            {/* Edit / Create Form */}
            {(isEditing || !sectionData) && (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} className="space-y-5">

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Tag size={13} className="text-violet-500" /> Tag
                    </label>
                    <input type="text" value={form.tag}
                      onChange={e => setForm({ ...form, tag: e.target.value })}
                      placeholder="e.g. Testimonials" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Type size={13} className="text-blue-500" /> Title *
                    </label>
                    <input type="text" value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. What Clients Say" className="input w-full" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <FileText size={13} className="text-slate-400" /> Description
                  </label>
                  <textarea value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. Trusted by laboratories worldwide"
                    className="input w-full min-h-[72px] resize-y" />
                </div>

                <div>
                  <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    {form.isActive
                      ? <ToggleRight size={24} className="text-emerald-500" />
                      : <ToggleLeft  size={24} className="text-slate-400"   />}
                    {form.isActive ? 'Section visible on site' : 'Section hidden from site'}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  {sectionData && (
                    <button type="button" onClick={cancelEdit} className="btn btn-secondary flex-1">
                      <X size={15} /> Cancel
                    </button>
                  )}
                  <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                    {submitting
                      ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                      : <><Save size={15} /> {sectionData ? 'Update Section' : 'Create Section'}</>}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Empty */}
            {!sectionData && !isEditing && !loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <MessageSquare size={32} className="text-violet-400" />
                </div>
                <p className="text-lg font-medium text-slate-600">No Testimonials Section Yet</p>
                <p className="text-sm text-slate-400 mt-1">Create the section header before adding reviews</p>
                <button onClick={() => setIsEditing(true)} className="btn btn-primary mt-4">
                  <Plus size={16} /> Create Testimonials Section
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tips */}
      <div className="card p-5 bg-gradient-to-r from-violet-50 to-purple-50 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={18} className="text-violet-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Section Settings Tips</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• The <strong>Tag</strong> appears as a small label above the title on the homepage</li>
              <li>• Use the <strong>isActive</strong> toggle to hide the entire section without deleting it</li>
              <li>• Manage individual client reviews in the <strong>Testimonial Details</strong> panel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}