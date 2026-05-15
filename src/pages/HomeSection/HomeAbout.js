// src/components/admin/HomeAbout.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Trash2, Edit, Save, X, Sparkles, Eye, RefreshCw,
  Loader2, CheckCircle, AlertCircle, Award, Camera, ZoomIn,
  EyeOff, AlertTriangle, Plus, FileText, Tag, Type, AlignLeft,
  MousePointerClick, ListChecks, GripVertical
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
    <motion.div initial={{ opacity: 0, x: 20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${bg} text-white min-w-[300px]`}>
      {icon}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70"><X size={16} /></button>
    </motion.div>
  );
};

/* ─── Image Preview Modal ─── */
const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }} className="relative max-w-5xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
      </motion.div>
    </div>
  );
};

/* ─── Points Manager ─── */
const PointsManager = ({ points, onAdd, onUpdate, onDelete, submitting }) => {
  const [newPoint, setNewPoint] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState('');

  const handleAdd = () => {
    if (!newPoint.trim()) return;
    onAdd(newPoint.trim());
    setNewPoint('');
  };

  const handleUpdate = () => {
    if (!editVal.trim()) return;
    onUpdate(editIdx, editVal.trim());
    setEditIdx(null);
    setEditVal('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
        <ListChecks size={15} className="text-blue-500" /> Key Points
      </label>

      {/* Existing points */}
      <div className="space-y-2">
        <AnimatePresence>
          {points.map((p, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <GripVertical size={14} className="text-slate-300 flex-shrink-0" />
              {editIdx === idx ? (
                <>
                  <input value={editVal} onChange={(e) => setEditVal(e.target.value)}
                    className="input flex-1 py-1 text-sm" autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') handleUpdate(); if (e.key === 'Escape') setEditIdx(null); }} />
                  <button onClick={handleUpdate} disabled={submitting}
                    className="btn-icon bg-emerald-100 hover:bg-emerald-200 text-emerald-700">
                    <CheckCircle size={14} />
                  </button>
                  <button onClick={() => setEditIdx(null)} className="btn-icon bg-slate-100 hover:bg-slate-200 text-slate-600">
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-slate-700 flex-1">{p.point}</span>
                  <button onClick={() => { setEditIdx(idx); setEditVal(p.point); }}
                    className="btn-icon bg-blue-50 hover:bg-blue-100 text-blue-600">
                    <Edit size={13} />
                  </button>
                  <button onClick={() => onDelete(idx)} disabled={submitting}
                    className="btn-icon bg-red-50 hover:bg-red-100 text-red-600">
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add new */}
      <div className="flex gap-2">
        <input value={newPoint} onChange={(e) => setNewPoint(e.target.value)}
          placeholder="Add a new point..." className="input flex-1 text-sm"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }} />
        <button onClick={handleAdd} disabled={!newPoint.trim() || submitting}
          className="btn btn-primary btn-sm px-4">
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
export function HomeAbout() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    tag: '', title: '', description: '', buttonText: '', isActive: true,
  });
  const [pointsInput, setPointsInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const getToken = () => localStorage.getItem('token');

  /* ── Fetch ── */
  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/about`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success && data.data) {
        setAboutData(data.data);
        setFormData({
          tag: data.data.tag || '',
          title: data.data.title || '',
          description: data.data.description || '',
          buttonText: data.data.buttonText || '',
          isActive: data.data.isActive ?? true,
        });
        setImagePreview(data.data.image || null);
      } else {
        setAboutData(null);
      }
    } catch (err) {
      console.error('fetchAbout:', err);
      showToast('Failed to load about section', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAbout(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB', 'error'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── Create / Update ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { showToast('Title is required', 'error'); return; }
    if (!formData.description.trim()) { showToast('Description is required', 'error'); return; }
    if (!imageFile && !aboutData) { showToast('Please select an image', 'error'); return; }

    try {
      setSubmitting(true);
      const body = new FormData();
      body.append('tag', formData.tag);
      body.append('title', formData.title);
      body.append('description', formData.description);
      body.append('buttonText', formData.buttonText);
      body.append('isActive', formData.isActive);

      // Parse points from textarea
      const parsedPoints = pointsInput
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((p) => ({ point: p }));
      if (parsedPoints.length > 0) {
        body.append('points', JSON.stringify(parsedPoints));
      }

      if (imageFile) body.append('image', imageFile);

      const method = aboutData ? 'PUT' : 'POST';
      const res = await fetch(`${BASE_URL}/about`, {
        method, headers: { Authorization: `Bearer ${getToken()}` }, body,
      });
      const data = await res.json();
      if (data.success) {
        showToast(aboutData ? 'About section updated!' : 'About section created!', 'success');
        await fetchAbout();
        setIsEditing(false);
        setImageFile(null);
        setPointsInput('');
      } else {
        showToast(data.message || 'Failed to save', 'error');
      }
    } catch (err) {
      console.error('handleSubmit:', err);
      showToast('Failed to save about section', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete about ── */
  const handleDelete = async () => {
    if (!window.confirm('Delete the about section? This cannot be undone.')) return;
    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/about`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('About section deleted!', 'success');
        setAboutData(null);
        setFormData({ tag: '', title: '', description: '', buttonText: '', isActive: true });
        setImagePreview(null);
        setIsEditing(false);
      } else {
        showToast(data.message || 'Failed to delete', 'error');
      }
    } catch (err) {
      console.error('handleDelete:', err);
      showToast('Failed to delete', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Toggle active ── */
  const handleToggle = async () => {
    if (!aboutData) return;
    try {
      const body = new FormData();
      Object.entries({ tag: aboutData.tag, title: aboutData.title, description: aboutData.description,
        buttonText: aboutData.buttonText, isActive: !aboutData.isActive }).forEach(([k, v]) => body.append(k, v));
      const res = await fetch(`${BASE_URL}/about`, {
        method: 'PUT', headers: { Authorization: `Bearer ${getToken()}` }, body,
      });
      const data = await res.json();
      if (data.success) {
        showToast(aboutData.isActive ? 'Deactivated!' : 'Activated!', 'success');
        await fetchAbout();
      }
    } catch (err) { showToast('Failed to update status', 'error'); }
  };

  /* ── Add point ── */
  const handleAddPoint = async (point) => {
    try {
      const res = await fetch(`${BASE_URL}/about/points`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ point }),
      });
      const data = await res.json();
      if (data.success) { showToast('Point added!', 'success'); await fetchAbout(); }
      else showToast(data.message || 'Failed to add point', 'error');
    } catch (err) { showToast('Failed to add point', 'error'); }
  };

  /* ── Update point ── */
  const handleUpdatePoint = async (index, point) => {
    try {
      const res = await fetch(`${BASE_URL}/about/points/${index}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ point }),
      });
      const data = await res.json();
      if (data.success) { showToast('Point updated!', 'success'); await fetchAbout(); }
      else showToast(data.message || 'Failed to update point', 'error');
    } catch (err) { showToast('Failed to update point', 'error'); }
  };

  /* ── Delete point ── */
  const handleDeletePoint = async (index) => {
    if (!window.confirm('Delete this point?')) return;
    try {
      const res = await fetch(`${BASE_URL}/about/points/${index}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) { showToast('Point deleted!', 'success'); await fetchAbout(); }
      else showToast(data.message || 'Failed to delete point', 'error');
    } catch (err) { showToast('Failed to delete point', 'error'); }
  };

  const cancelEdit = () => {
    if (aboutData) {
      setFormData({ tag: aboutData.tag || '', title: aboutData.title || '',
        description: aboutData.description || '', buttonText: aboutData.buttonText || '',
        isActive: aboutData.isActive ?? true });
      setImagePreview(aboutData.image || null);
    }
    setImageFile(null);
    setPointsInput('');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {previewImage && <ImagePreviewModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }} />
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.5) 0%, transparent 60%)' }} />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="dot dot-white animate-pulse2" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Homepage Management</span>
            <FileText size={14} className="text-white/70 ml-1" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            About <span className="text-green-100">Section</span>
          </h2>
          <p className="text-white/70 text-sm">Manage your company's about section and key points</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Status', value: aboutData?.isActive ? 'Active' : aboutData ? 'Inactive' : 'Not Set', icon: aboutData?.isActive ? CheckCircle : EyeOff, color: aboutData?.isActive ? 'green' : 'slate' },
          { label: 'Key Points', value: aboutData?.points?.length ?? 0, icon: ListChecks, color: 'blue' },
          { label: 'Last Updated', value: aboutData?.updatedAt ? new Date(aboutData.updatedAt).toLocaleDateString() : '—', icon: Sparkles, color: 'purple' },
        ].map((s, i) => (
          <div key={i} className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color === 'green' ? 'bg-emerald-50' : s.color === 'blue' ? 'bg-blue-50' : s.color === 'purple' ? 'bg-purple-50' : 'bg-slate-50'}`}>
                <s.icon size={18} className={s.color === 'green' ? 'text-emerald-600' : s.color === 'blue' ? 'text-blue-600' : s.color === 'purple' ? 'text-purple-600' : 'text-slate-500'} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="card p-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Loading about section...</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex gap-3 flex-wrap">
                {aboutData && !isEditing && (
                  <>
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary"><Edit size={15} /> Edit</button>
                    <button onClick={handleToggle} className={`btn ${aboutData.isActive ? 'btn-warning' : 'btn-success'}`} disabled={submitting}>
                      {aboutData.isActive ? <><EyeOff size={15} /> Deactivate</> : <><Eye size={15} /> Activate</>}
                    </button>
                    <button onClick={handleDelete} className="btn btn-secondary !text-red-600 hover:!bg-red-50" disabled={submitting}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </>
                )}
                <button onClick={fetchAbout} className="btn btn-secondary" disabled={loading}>
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
              {aboutData && !isEditing && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${aboutData.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {aboutData.isActive ? '● Active' : '○ Inactive'}
                </span>
              )}
            </div>

            {/* View Mode */}
            {aboutData && !isEditing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image */}
                  {aboutData.image && (
                    <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-100 group">
                      <img src={aboutData.image} alt="About" className="w-full h-full object-cover" />
                      <button onClick={() => setPreviewImage(aboutData.image)}
                        className="absolute top-3 right-3 btn-icon bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn size={15} />
                      </button>
                    </div>
                  )}
                  {/* Details */}
                  <div className="space-y-3">
                    {[
                      { label: 'Tag', value: aboutData.tag, icon: Tag },
                      { label: 'Title', value: aboutData.title, icon: Type },
                      { label: 'Button Text', value: aboutData.buttonText, icon: MousePointerClick },
                    ].map((f, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1">
                          <f.icon size={12} className="text-slate-400" />
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{f.label}</span>
                        </div>
                        <p className="text-slate-800 font-medium text-sm">{f.value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Description */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlignLeft size={12} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{aboutData.description}</p>
                </div>

                {/* Points */}
                {aboutData.points?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <ListChecks size={15} className="text-blue-500" /> Key Points
                    </h4>
                    <PointsManager
                      points={aboutData.points}
                      onAdd={handleAddPoint}
                      onUpdate={handleUpdatePoint}
                      onDelete={handleDeletePoint}
                      submitting={submitting}
                    />
                  </div>
                )}
                {(!aboutData.points || aboutData.points.length === 0) && (
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-sm text-slate-400 text-center mb-3">No key points added yet</p>
                    <PointsManager
                      points={[]}
                      onAdd={handleAddPoint}
                      onUpdate={handleUpdatePoint}
                      onDelete={handleDeletePoint}
                      submitting={submitting}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Edit / Create Form */}
            {(isEditing || !aboutData) && (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} className="space-y-5">

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Tag */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Tag size={13} className="text-slate-400" /> Tag
                    </label>
                    <input type="text" value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder='e.g. "About Us"' className="input w-full" />
                  </div>
                  {/* Button Text */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <MousePointerClick size={13} className="text-slate-400" /> Button Text
                    </label>
                    <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      placeholder='e.g. "Read More"' className="input w-full" />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Type size={13} className="text-slate-400" /> Title *
                  </label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder='e.g. "Leading Laboratory Equipment Provider"' className="input w-full" required />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <AlignLeft size={13} className="text-slate-400" /> Description *
                  </label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter about section description..." className="input w-full min-h-[100px] resize-y" required />
                </div>

                {/* Points (bulk entry for create; per-item CRUD shown in view) */}
                {!aboutData && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <ListChecks size={13} className="text-slate-400" /> Key Points
                      <span className="text-xs font-normal text-slate-400">(one per line)</span>
                    </label>
                    <textarea value={pointsInput} onChange={(e) => setPointsInput(e.target.value)}
                      placeholder={"High Quality\n24/7 Support\nISO Certified"}
                      className="input w-full min-h-[100px] resize-y font-mono text-sm" />
                  </div>
                )}

                {/* Image */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    About Image {!aboutData && '*'}
                  </label>
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-emerald-400 transition-colors">
                    <div className="space-y-2 text-center">
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto object-cover rounded-lg" />
                          <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                            className="absolute top-2 right-2 btn-icon bg-red-500 hover:bg-red-600 text-white">
                            <X size={14} />
                          </button>
                          <label className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-600 cursor-pointer hover:text-emerald-500">
                            <Camera size={12} /> Change image
                            <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-slate-400" />
                          <div className="flex justify-center text-sm text-slate-600">
                            <label className="cursor-pointer font-medium text-emerald-600 hover:text-emerald-500">
                              <span>Upload a file</span>
                              <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Active Status</span>
                    <p className="text-xs text-slate-500 mt-1">Show this section on the homepage</p>
                  </div>
                  <button type="button" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {aboutData && (
                    <button type="button" onClick={cancelEdit} className="btn btn-secondary flex-1">
                      <X size={15} /> Cancel
                    </button>
                  )}
                  <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                    {submitting ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> {aboutData ? 'Update About' : 'Create About'}</>}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Empty */}
            {!aboutData && !isEditing && !loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <FileText size={32} className="text-slate-400" />
                </div>
                <p className="text-lg font-medium text-slate-600">No About Section Found</p>
                <p className="text-sm text-slate-400 mt-1">Create your company's about section</p>
                <button onClick={() => setIsEditing(true)} className="btn btn-primary mt-4">
                  <Plus size={16} /> Create About Section
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tips */}
      <div className="card p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Award size={18} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Tips for a Great About Section</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Keep the description concise — 2 to 3 sentences work best</li>
              <li>• Use key points to highlight your strongest differentiators</li>
              <li>• After creating, use the live point editor to add/edit/remove points individually</li>
              <li>• Use a professional team or facility image for authenticity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}