// src/components/admin/HomeTestimonialsDetails.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit, Save, X, Sparkles, RefreshCw, Loader2, CheckCircle,
  AlertCircle, AlertTriangle, Plus, Trash2, MessageSquare,
  ToggleLeft, ToggleRight, Star, Quote, Camera, ZoomIn,
  Users, ImagePlus, Tag, BarChart3
} from 'lucide-react';

const BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com/api/homepage';

/* ─── Toast ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const cfg = {
    success: { bg: 'bg-emerald-500', icon: <CheckCircle size={18} /> },
    error: { bg: 'bg-red-500', icon: <AlertCircle size={18} /> },
    warning: { bg: 'bg-amber-500', icon: <AlertTriangle size={18} /> },
    info: { bg: 'bg-blue-500', icon: <Sparkles size={18} /> },
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

/* ─── Image Preview Modal ─── */
const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-w-5xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
      </motion.div>
    </div>
  );
};

/* ─── Star Rating Display ─── */
const StarRating = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size}
        className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
    ))}
  </div>
);

/* ─── Testimonial Form ─── */
const TestimonialForm = ({ initial, onSave, onCancel, submitting, isNew }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    rating: initial?.rating || '5',
    role: initial?.role || '',
    review: initial?.review || '',
    isActive: initial?.isActive !== false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    typeof initial?.image === 'string' ? initial.image : initial?.image?.url || null
  );

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    const r = new FileReader();
    r.onloadend = () => setImagePreview(r.result);
    r.readAsDataURL(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form, imageFile);
  };

  return (
    <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200">

      <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
        <MessageSquare size={14} className="text-violet-500" />
        {isNew ? 'Add New Testimonial' : 'Edit Testimonial'}
      </h3>

      {/* Avatar upload */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
          {imagePreview
            ? <img src={imagePreview} alt="avatar" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Camera size={20} className="text-slate-400" /></div>}
        </div>
        <div>
          <label className="btn btn-secondary text-xs cursor-pointer gap-1.5">
            <ImagePlus size={13} /> {imagePreview ? 'Change Photo' : 'Upload Photo'}<span className='text-red-500 text-xl'>*</span>
            <input type="file" className="sr-only" accept="image/*" onChange={handleFile} />
          </label>
          <p className="text-[11px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Users size={11} className="text-violet-500" /> Name <span className='text-red-500 text-xl'>*</span>
          </label>
          <input type="text" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Vijay Kumar" className="input w-full text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Tag size={11} className="text-violet-500" /> Role / Title
          </label>
          <input type="text" value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. Laboratory Manager" className="input w-full text-sm" />
        </div>
      </div>

      {/* Star rating picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
          <Star size={11} className="text-amber-500" /> Rating
        </label>
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} type="button" onClick={() => setForm({ ...form, rating: String(s) })}
              className="p-1 transition-transform hover:scale-110">
              <Star size={22} className={
                s <= Number(form.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 hover:text-amber-300'
              } />
            </button>
          ))}
          <span className="text-sm font-semibold text-slate-600 ml-1">{form.rating} / 5</span>
        </div>
      </div>

      {/* Review */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
          <Quote size={11} className="text-slate-400" /> Review
        </label>
        <textarea value={form.review}
          onChange={e => setForm({ ...form, review: e.target.value })}
          placeholder="Excellent products and support..."
          className="input w-full min-h-[80px] resize-y text-sm" />
      </div>

      {/* isActive toggle */}
      <div>
        <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
          className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {form.isActive
            ? <ToggleRight size={24} className="text-emerald-500" />
            : <ToggleLeft size={24} className="text-slate-400" />}
          {form.isActive ? 'Visible on site' : 'Hidden from site'}
        </button>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
          <X size={14} /> Cancel
        </button>
        <button type="submit" disabled={submitting || !form.name.trim()} className="btn btn-primary flex-1">
          {submitting
            ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
            : <><Save size={14} /> {isNew ? 'Add Testimonial' : 'Update Testimonial'}</>}
        </button>
      </div>
    </motion.form>
  );
};

/* ─── Testimonial Card ─── */
const TestimonialCard = ({ item, index, onEdit, onDelete, onPreview, submitting }) => {
  const imgSrc = typeof item.image === 'string' ? item.image : item.image?.url || item.image;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      className="relative p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow group">

      {/* Active badge */}
      <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
        {item.isActive !== false ? 'Active' : 'Hidden'}
      </span>

      <div className="flex items-center gap-3 mb-3">
        {imgSrc ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border-2 border-slate-100"
            onClick={() => onPreview(imgSrc)}>
            <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center">
              <ZoomIn size={12} className="text-white opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-violet-400" />
          </div>
        )}
        <div className="min-w-0 pr-10">
          <p className="font-semibold text-slate-800 text-sm truncate">{item.name || '—'}</p>
          <p className="text-xs text-slate-500 truncate">{item.role || '—'}</p>
          <StarRating rating={Number(item.rating) || 0} />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Quote size={14} className="text-slate-300 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-3">{item.review || '—'}</p>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
        <button onClick={() => onEdit(index)}
          className="btn btn-secondary text-xs flex-1 py-1.5 gap-1">
          <Edit size={12} /> Edit
        </button>
        <button onClick={() => onDelete(index)} disabled={submitting}
          className="btn btn-secondary !text-red-600 hover:!bg-red-50 text-xs flex-1 py-1.5 gap-1">
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─── */
export function HomeReviews() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [toast, setToast] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const getToken = () => sessionStorage.getItem('token');

  /* ── Fetch ── */
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/testimonials`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success && data.data) {
        setTestimonials(data.data.testimonials || []);
      } else {
        setTestimonials([]);
      }
    } catch (err) {
      console.error('fetchTestimonials:', err);
      showToast('Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  /* ── Add ── */
  const handleAdd = async (form, imageFile) => {
    try {
      setSubmitting(true);
      const body = new FormData();
      body.append('name', form.name);
      body.append('rating', form.rating);
      body.append('role', form.role);
      body.append('review', form.review);
      body.append('isActive', String(form.isActive));
      if (imageFile) body.append('image', imageFile);

      const res = await fetch(`${BASE_URL}/testimonials/add`, {
        method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body,
      });
      const data = await res.json();
      if (data.success) {
        showToast('Testimonial added!', 'success');
        await fetchTestimonials();
        setAddingItem(false);
      } else showToast(data.message || 'Failed to add', 'error');
    } catch (err) { showToast('Failed to add testimonial', 'error'); }
    finally { setSubmitting(false); }
  };

  /* ── Update ── */
  const handleUpdate = async (index, form, imageFile) => {
    try {
      setSubmitting(true);
      const body = new FormData();
      body.append('name', form.name);
      body.append('rating', form.rating);
      body.append('role', form.role);
      body.append('review', form.review);
      body.append('isActive', String(form.isActive));
      if (imageFile) body.append('image', imageFile);

      const res = await fetch(`${BASE_URL}/testimonials/${index}`, {
        method: 'PUT', headers: { Authorization: `Bearer ${getToken()}` }, body,
      });
      const data = await res.json();
      if (data.success) {
        showToast('Testimonial updated!', 'success');
        await fetchTestimonials();
        setEditingIdx(null);
      } else showToast(data.message || 'Failed to update', 'error');
    } catch (err) { showToast('Failed to update testimonial', 'error'); }
    finally { setSubmitting(false); }
  };

  /* ── Delete ── */
  const handleDelete = async (index) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/testimonials/${index}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Testimonial deleted!', 'success');
        await fetchTestimonials();
      } else showToast(data.message || 'Failed to delete', 'error');
    } catch (err) { showToast('Failed to delete testimonial', 'error'); }
    finally { setSubmitting(false); }
  };

  const total = testimonials.length;
  const active = testimonials.filter(t => t.isActive !== false).length;
  const avgRating = total
    ? (testimonials.reduce((s, t) => s + (Number(t.rating) || 0), 0) / total).toFixed(1)
    : '—';

  const statCards = [
    { label: 'Total Reviews', value: total, icon: MessageSquare, color: 'violet' },
    { label: 'Active', value: active, icon: CheckCircle, color: 'green' },
    { label: 'Hidden', value: total - active, icon: ToggleLeft, color: 'slate' },
    { label: 'Avg Rating', value: avgRating, icon: Star, color: 'amber' },
  ];

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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }} />
        <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.6) 0%, transparent 60%)' }} />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="dot dot-white animate-pulse2" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Homepage Management</span>
            <Quote size={14} className="text-white/70 ml-1" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Testimonial <span className="text-purple-200">Details</span>
          </h2>
          <p className="text-white/75 text-sm">Add, edit and manage individual client reviews</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color === 'violet' ? 'bg-violet-50' :
                  s.color === 'green' ? 'bg-emerald-50' :
                    s.color === 'amber' ? 'bg-amber-50' : 'bg-slate-50'
                }`}>
                <s.icon size={18} className={
                  s.color === 'violet' ? 'text-violet-600' :
                    s.color === 'green' ? 'text-emerald-600' :
                      s.color === 'amber' ? 'text-amber-600' : 'text-slate-400'
                } />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value ?? '—'}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="card p-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Loading testimonials...</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex gap-3 flex-wrap">
                {!addingItem && editingIdx === null && (
                  <button onClick={() => setAddingItem(true)} className="btn btn-primary">
                    <Plus size={15} /> Add Testimonial
                  </button>
                )}
                <button onClick={fetchTestimonials} disabled={loading} className="btn btn-secondary">
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
              {total > 0 && (
                <span className="text-sm text-slate-500">{total} review{total !== 1 ? 's' : ''}</span>
              )}
            </div>

            {/* Add Form */}
            <AnimatePresence>
              {addingItem && (
                <div className="mb-6">
                  <TestimonialForm
                    isNew
                    onSave={handleAdd}
                    onCancel={() => setAddingItem(false)}
                    submitting={submitting}
                  />
                </div>
              )}
            </AnimatePresence>

            {/* Grid */}
            {total > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {testimonials.map((item, idx) =>
                    editingIdx === idx ? (
                      <motion.div key={idx} className="sm:col-span-2 lg:col-span-3"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <TestimonialForm
                          initial={item}
                          onSave={(form, file) => handleUpdate(idx, form, file)}
                          onCancel={() => setEditingIdx(null)}
                          submitting={submitting}
                        />
                      </motion.div>
                    ) : (
                      <TestimonialCard
                        key={idx}
                        item={item}
                        index={idx}
                        onEdit={i => { setAddingItem(false); setEditingIdx(i); }}
                        onDelete={handleDelete}
                        onPreview={setPreviewImage}
                        submitting={submitting}
                      />
                    )
                  )}
                </AnimatePresence>
              </div>
            ) : (
              !addingItem && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-violet-50 flex items-center justify-center">
                    <Quote size={32} className="text-violet-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-600">No Testimonials Yet</p>
                  <p className="text-sm text-slate-400 mt-1">Add your first client review to get started</p>
                  <button onClick={() => setAddingItem(true)} className="btn btn-primary mt-4">
                    <Plus size={16} /> Add First Testimonial
                  </button>
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Tips */}
      <div className="card p-5 bg-gradient-to-r from-violet-50 to-purple-50 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Star size={18} className="text-violet-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Tips for Compelling Testimonials</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Use real photos — testimonials with faces get significantly more trust</li>
              <li>• Include the client's role and organisation for credibility</li>
              <li>• Keep reviews concise — 2–3 sentences is the sweet spot</li>
              <li>• Toggle individual testimonials on/off without deleting them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}