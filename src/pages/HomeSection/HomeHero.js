// src/components/admin/HomeHero.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Upload, Trash2, Edit, Save, X, Sparkles,
  Eye, RefreshCw, Loader2, CheckCircle, AlertCircle,
  Award, Camera, ZoomIn, EyeOff, AlertTriangle, Plus
} from 'lucide-react';

const BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com/api/homepage';

/* ─── Toast ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };
  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Sparkles size={18} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        ${colors[type] || colors.info} text-white min-w-[300px]`}
    >
      {icons[type] || icons.info}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70"><X size={16} /></button>
    </motion.div>
  );
};

/* ─── Image Preview Modal ─── */
const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-w-5xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <img
          src={imageUrl}
          alt="Hero Preview"
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
        />
      </motion.div>
    </div>
  );
};

/* ─── Hero Form ─── */
const HeroForm = ({ initial, onSave, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    title: initial?.title || '',
    tag: initial?.tag || '',
    isActive: initial?.isActive ?? true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial?.image || null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    setError('');
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { setError('Title is required'); return; }
    if (!formData.tag.trim()) { setError('Tagline is required'); return; }
    if (!imageFile && !initial?.image) { setError('Please select an image'); return; }
    setError('');
    onSave({ formData, imageFile });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder='e.g. "Advanced Laboratory Solutions"'
          className="input w-full"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Tagline *</label>
        <input
          type="text"
          value={formData.tag}
          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
          placeholder='e.g. "SmartLab Technologies"'
          className="input w-full"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Hero Image {!initial?.image && '*'}
        </label>
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-400 transition-colors">
          <div className="space-y-2 text-center">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-48 w-auto object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  className="absolute top-2 right-2 btn-icon bg-red-500 hover:bg-red-600 text-white"
                >
                  <X size={14} />
                </button>
                <label className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-600 cursor-pointer hover:text-blue-500">
                  <Camera size={12} /> Change image
                  <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex justify-center text-sm text-slate-600">
                  <label className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
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
          <p className="text-xs text-slate-500 mt-1">Show this hero on the homepage</p>
        </div>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            formData.isActive ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
            <X size={15} /> Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
          {submitting
            ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
            : <><Save size={15} /> {initial ? 'Update Hero' : 'Create Hero'}</>
          }
        </button>
      </div>
    </motion.form>
  );
};

/* ─── Hero Card ─── */
const HeroCard = ({ hero, index, onEdit, onDelete, onToggle, onPreview, submitting }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="card overflow-hidden flex flex-col"
  >
    {/* Image */}
    <div className="relative h-52 bg-slate-100 flex-shrink-0">
      {hero.image ? (
        <>
          <img src={hero.image} alt={hero.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Image size={40} className="text-slate-300" />
        </div>
      )}

      {/* Index badge */}
      <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/50 text-white text-xs font-mono rounded-md">
        #{index}
      </span>

      {/* Status badge */}
      <span className={`absolute top-3 right-12 px-2.5 py-1 rounded-full text-xs font-semibold ${
        hero.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700/80 text-slate-200'
      }`}>
        {hero.isActive ? '● Active' : '○ Inactive'}
      </span>

      {/* Zoom */}
      {hero.image && (
        <button
          onClick={() => onPreview(hero.image)}
          className="absolute top-3 right-3 btn-icon bg-white/90 hover:bg-white shadow-md"
        >
          <ZoomIn size={14} />
        </button>
      )}
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-base font-bold text-slate-800 truncate mb-1">{hero.title}</h3>
      <p className="text-sm text-slate-500 truncate mb-4">{hero.tag}</p>

      <div className="flex gap-2 mt-auto flex-wrap">
        <button onClick={() => onEdit(index)} className="btn btn-primary btn-sm flex-1">
          <Edit size={13} /> Edit
        </button>
        <button
          onClick={() => onToggle(index, hero)}
          disabled={submitting}
          className={`btn btn-sm flex-1 ${hero.isActive ? 'btn-warning' : 'btn-success'}`}
        >
          {hero.isActive
            ? <><EyeOff size={13} /> Deactivate</>
            : <><Eye size={13} /> Activate</>
          }
        </button>
        <button
          onClick={() => onDelete(index, hero.title)}
          disabled={submitting}
          className="btn btn-secondary btn-sm !text-red-600 hover:!bg-red-50"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  </motion.div>
);

/* ─── Main Component ─── */
export function HomeHero() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // null = closed | 'create' = new form | number = editing that index
  const [formMode, setFormMode] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const getToken = () => localStorage.getItem('token');

  /* ── GET /hero ── */
  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/hero`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setHeroes(Array.isArray(data.data) ? data.data : data.data ? [data.data] : []);
      } else {
        setHeroes([]);
      }
    } catch (err) {
      console.error('fetchHeroes:', err);
      showToast('Failed to load hero sections', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeroes(); }, []);

  /* ── POST /hero ── */
  const handleCreate = async ({ formData, imageFile }) => {
    try {
      setSubmitting(true);
      const body = new FormData();
      body.append('title', formData.title);
      body.append('tag', formData.tag);
      body.append('isActive', formData.isActive);
      if (imageFile) body.append('image', imageFile);

      const res = await fetch(`${BASE_URL}/hero`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body,
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hero section created!', 'success');
        await fetchHeroes();
        setFormMode(null);
      } else {
        showToast(data.message || 'Failed to create', 'error');
      }
    } catch (err) {
      console.error('handleCreate:', err);
      showToast('Failed to create hero section', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── PUT /hero/:index ── */
  const handleUpdate = async ({ formData, imageFile }) => {
    if (typeof formMode !== 'number') return;
    try {
      setSubmitting(true);
      const body = new FormData();
      body.append('title', formData.title);
      body.append('tag', formData.tag);
      body.append('isActive', formData.isActive);
      if (imageFile) body.append('image', imageFile);

      const res = await fetch(`${BASE_URL}/hero/${formMode}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
        body,
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hero section updated!', 'success');
        await fetchHeroes();
        setFormMode(null);
      } else {
        showToast(data.message || 'Failed to update', 'error');
      }
    } catch (err) {
      console.error('handleUpdate:', err);
      showToast('Failed to update hero section', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── PUT /hero/:index (toggle only) ── */
  const handleToggle = async (index, hero) => {
    try {
      const body = new FormData();
      body.append('title', hero.title);
      body.append('tag', hero.tag);
      body.append('isActive', !hero.isActive);

      const res = await fetch(`${BASE_URL}/hero/${index}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
        body,
      });
      const data = await res.json();
      if (data.success) {
        showToast(hero.isActive ? 'Hero deactivated!' : 'Hero activated!', 'success');
        await fetchHeroes();
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('handleToggle:', err);
      showToast('Failed to update status', 'error');
    }
  };

  /* ── DELETE /hero/:index ── */
  const handleDelete = async (index, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/hero/${index}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hero section deleted!', 'success');
        if (formMode === index) setFormMode(null);
        await fetchHeroes();
      } else {
        showToast(data.message || 'Failed to delete', 'error');
      }
    } catch (err) {
      console.error('handleDelete:', err);
      showToast('Failed to delete hero section', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = heroes.filter((h) => h.isActive).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <ImagePreviewModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="dot dot-white animate-pulse2" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">
              Homepage Management
            </span>
            <Sparkles size={14} className="text-yellow-300 ml-1" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Hero <span className="text-yellow-200">Sections</span>
          </h2>
          <p className="text-white/70 text-sm">
            Manage all hero banners displayed on your homepage
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Heroes', value: heroes.length, icon: Image, color: 'blue' },
          { label: 'Active',       value: activeCount,   icon: CheckCircle, color: 'green' },
          { label: 'Inactive',     value: heroes.length - activeCount, icon: EyeOff, color: 'slate' },
        ].map((stat, idx) => (
          <div key={idx} className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                stat.color === 'green' ? 'bg-emerald-50' :
                stat.color === 'blue'  ? 'bg-blue-50' : 'bg-slate-50'
              }`}>
                <stat.icon size={18} className={
                  stat.color === 'green' ? 'text-emerald-600' :
                  stat.color === 'blue'  ? 'text-blue-600' : 'text-slate-500'
                } />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card p-4 flex items-center justify-between gap-3 flex-wrap">
        <button onClick={fetchHeroes} className="btn btn-secondary" disabled={loading}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
        <button
          onClick={() => setFormMode('create')}
          className="btn btn-primary"
          disabled={formMode === 'create'}
        >
          <Plus size={16} /> Add Hero Section
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {formMode === 'create' && (
          <motion.div
            key="create-form"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="card p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Plus size={18} className="text-blue-600" /> New Hero Section
            </h3>
            <HeroForm
              initial={null}
              onSave={handleCreate}
              onCancel={() => setFormMode(null)}
              submitting={submitting}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading ? (
        <div className="card p-12 text-center">
          <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
          <p className="text-slate-500">Loading hero sections...</p>
        </div>

      /* Empty */
      ) : heroes.length === 0 && formMode !== 'create' ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Image size={32} className="text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-600">No Hero Sections Yet</p>
          <p className="text-sm text-slate-400 mt-1">Create your first hero banner</p>
          <button onClick={() => setFormMode('create')} className="btn btn-primary mt-4">
            <Plus size={16} /> Add Hero Section
          </button>
        </div>

      /* Grid */
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {heroes.map((hero, index) =>
              formMode === index ? (
                <motion.div
                  key={`edit-${index}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card p-6 md:col-span-2 xl:col-span-3"
                >
                  <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Edit size={16} className="text-blue-600" />
                    Editing #{index}:&nbsp;
                    <span className="text-slate-500 font-normal truncate">{hero.title}</span>
                  </h3>
                  <HeroForm
                    initial={hero}
                    onSave={handleUpdate}
                    onCancel={() => setFormMode(null)}
                    submitting={submitting}
                  />
                </motion.div>
              ) : (
                <HeroCard
                  key={hero._id || index}
                  hero={hero}
                  index={index}
                  onEdit={(i) => setFormMode(i)}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  onPreview={setPreviewImage}
                  submitting={submitting}
                />
              )
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Tips */}
      <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Award size={18} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Tips for an Effective Hero Section</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Use high-quality images (1920×1080 recommended)</li>
              <li>• Keep titles concise and impactful (under 60 characters)</li>
              <li>• Tagline should highlight your unique value proposition</li>
              <li>• Optimise image size for fast loading</li>
              <li>• Heroes are identified by array index (#0, #1…) — order matters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}