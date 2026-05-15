// src/components/admin/HomeAchievements.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Trash2, Edit, Save, X, Sparkles, Eye, RefreshCw,
  Loader2, CheckCircle, AlertCircle, Award, Camera, ZoomIn,
  EyeOff, AlertTriangle, Plus, Trophy, Star, Users, Quote,
  ImagePlus, BarChart3
} from 'lucide-react';

const BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com/api/homepage';

/* ─── Toast ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const cfg = { success: { bg: 'bg-emerald-500', icon: <CheckCircle size={18} /> }, error: { bg: 'bg-red-500', icon: <AlertCircle size={18} /> }, warning: { bg: 'bg-amber-500', icon: <AlertTriangle size={18} /> }, info: { bg: 'bg-blue-500', icon: <Sparkles size={18} /> } };
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
        className="relative max-w-5xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"><X size={24} /></button>
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
      </motion.div>
    </div>
  );
};

/* ─── Achievement Images Manager ─── */
const ImagesManager = ({ images, onAdd, onUpdate, onDelete, submitting }) => {
  const [newFile, setNewFile] = useState(null);
  const [newPreview, setNewPreview] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [previewFull, setPreviewFull] = useState(null);

  const handleNewFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setNewFile(f);
    const r = new FileReader();
    r.onloadend = () => setNewPreview(r.result);
    r.readAsDataURL(f);
  };

  const handleEditFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setEditFile(f);
    const r = new FileReader();
    r.onloadend = () => setEditPreview(r.result);
    r.readAsDataURL(f);
  };

  const handleAdd = () => {
    if (!newFile) return;
    onAdd(newFile);
    setNewFile(null);
    setNewPreview(null);
  };

  const handleUpdate = () => {
    if (!editFile) return;
    onUpdate(editIdx, editFile);
    setEditIdx(null);
    setEditFile(null);
    setEditPreview(null);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {previewFull && <ImagePreviewModal imageUrl={previewFull} onClose={() => setPreviewFull(null)} />}
      </AnimatePresence>

      <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
        <ImagePlus size={15} className="text-amber-500" /> Achievement Images
        <span className="text-xs font-normal text-slate-400">({images?.length || 0} images)</span>
      </label>

      {/* Existing images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <AnimatePresence>
          {images?.map((img, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group rounded-xl overflow-hidden bg-slate-100 aspect-square border-2 border-slate-200">
              {editIdx === idx ? (
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-2 p-2">
                  {editPreview ? (
                    <img src={editPreview} alt="new" className="w-full h-20 object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-20 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Camera size={20} className="text-slate-400" />
                    </div>
                  )}
                  <label className="text-xs text-blue-300 cursor-pointer hover:text-blue-200 flex items-center gap-1">
                    <Camera size={12} /> Choose
                    <input type="file" className="sr-only" accept="image/*" onChange={handleEditFile} />
                  </label>
                  <div className="flex gap-1">
                    <button onClick={handleUpdate} disabled={!editFile || submitting}
                      className="btn-icon bg-emerald-500 hover:bg-emerald-600 text-white w-7 h-7">
                      <CheckCircle size={12} />
                    </button>
                    <button onClick={() => { setEditIdx(null); setEditFile(null); setEditPreview(null); }}
                      className="btn-icon bg-slate-600 hover:bg-slate-500 text-white w-7 h-7">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img src={typeof img === 'string' ? img : img?.url || img} alt={`Achievement ${idx}`}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                    <button onClick={() => setPreviewFull(typeof img === 'string' ? img : img?.url || img)}
                      className="btn-icon bg-white/90 hover:bg-white text-slate-700 w-7 h-7"><ZoomIn size={12} /></button>
                    <button onClick={() => { setEditIdx(idx); setEditPreview(typeof img === 'string' ? img : img?.url || img); }}
                      className="btn-icon bg-blue-500 hover:bg-blue-600 text-white w-7 h-7"><Edit size={12} /></button>
                    <button onClick={() => onDelete(idx)} disabled={submitting}
                      className="btn-icon bg-red-500 hover:bg-red-600 text-white w-7 h-7"><Trash2 size={12} /></button>
                  </div>
                  <span className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">#{idx}</span>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add new image slot */}
        <motion.div layout className="rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-400 transition-colors aspect-square flex flex-col items-center justify-center gap-2 bg-slate-50 cursor-pointer relative">
          {newPreview ? (
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <img src={newPreview} alt="new" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                <button onClick={handleAdd} disabled={submitting}
                  className="btn-icon bg-emerald-500 hover:bg-emerald-600 text-white w-8 h-8"><CheckCircle size={14} /></button>
                <button onClick={() => { setNewFile(null); setNewPreview(null); }}
                  className="btn-icon bg-red-500 hover:bg-red-600 text-white w-8 h-8"><X size={14} /></button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <Plus size={24} className="text-slate-400 mb-1" />
              <span className="text-xs text-slate-400">Add Image</span>
              <input type="file" className="sr-only" accept="image/*" onChange={handleNewFile} />
            </label>
          )}
        </motion.div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
export function HomeAchievements() {
  const [achieveData, setAchieveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({ yearsOfExperience: '', productsDelivered: '', clientSatisfaction: '', quote: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const getToken = () => sessionStorage.getItem('token');

  /* ── Fetch ── */
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/achievements`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success && data.data) {
        setAchieveData(data.data);
        setFormData({
          yearsOfExperience: data.data.yearsOfExperience || '',
          productsDelivered: data.data.productsDelivered || '',
          clientSatisfaction: data.data.clientSatisfaction || '',
          quote: data.data.quote || '',
        });
      } else {
        setAchieveData(null);
      }
    } catch (err) {
      console.error('fetchAchievements:', err);
      showToast('Failed to load achievements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAchievements(); }, []);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) showToast('Some files skipped (invalid type or >5MB)', 'warning');
    setImageFiles(valid);
    valid.forEach((f) => {
      const r = new FileReader();
      r.onloadend = () => setImagePreviews((prev) => [...prev, r.result]);
      r.readAsDataURL(f);
    });
  };

  /* ── Create / Update ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.yearsOfExperience.toString().trim()) { showToast('Years of experience is required', 'error'); return; }
    try {
      setSubmitting(true);
      const body = new FormData();
      body.append('yearsOfExperience', formData.yearsOfExperience);
      body.append('productsDelivered', formData.productsDelivered);
      body.append('clientSatisfaction', formData.clientSatisfaction);
      body.append('quote', formData.quote);
      imageFiles.forEach((f) => body.append('images', f));

      const method = achieveData ? 'PUT' : 'POST';
      const res = await fetch(`${BASE_URL}/achievements`, {
        method, headers: { Authorization: `Bearer ${getToken()}` }, body,
      });
      const data = await res.json();
      if (data.success) {
        showToast(achieveData ? 'Achievements updated!' : 'Achievements created!', 'success');
        await fetchAchievements();
        setIsEditing(false);
        setImageFiles([]);
        setImagePreviews([]);
      } else {
        showToast(data.message || 'Failed to save', 'error');
      }
    } catch (err) {
      console.error('handleSubmit:', err);
      showToast('Failed to save achievements', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!window.confirm('Delete the achievements section? This cannot be undone.')) return;
    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/achievements`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success) {
        showToast('Achievements deleted!', 'success');
        setAchieveData(null);
        setFormData({ yearsOfExperience: '', productsDelivered: '', clientSatisfaction: '', quote: '' });
        setIsEditing(false);
      } else showToast(data.message || 'Failed to delete', 'error');
    } catch (err) { showToast('Failed to delete', 'error'); }
    finally { setSubmitting(false); }
  };

  /* ── Add image ── */
  const handleAddImage = async (file) => {
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await fetch(`${BASE_URL}/achievements/images`, {
        method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body,
      });
      const data = await res.json();
      if (data.success) { showToast('Image added!', 'success'); await fetchAchievements(); }
      else showToast(data.message || 'Failed to add image', 'error');
    } catch (err) { showToast('Failed to add image', 'error'); }
  };

  /* ── Update image ── */
  const handleUpdateImage = async (index, file) => {
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await fetch(`${BASE_URL}/achievements/images/${index}`, {
        method: 'PUT', headers: { Authorization: `Bearer ${getToken()}` }, body,
      });
      const data = await res.json();
      if (data.success) { showToast('Image updated!', 'success'); await fetchAchievements(); }
      else showToast(data.message || 'Failed to update image', 'error');
    } catch (err) { showToast('Failed to update image', 'error'); }
  };

  /* ── Delete image ── */
  const handleDeleteImage = async (index) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      const res = await fetch(`${BASE_URL}/achievements/images/${index}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) { showToast('Image deleted!', 'success'); await fetchAchievements(); }
      else showToast(data.message || 'Failed to delete image', 'error');
    } catch (err) { showToast('Failed to delete image', 'error'); }
  };

  const cancelEdit = () => {
    if (achieveData) setFormData({ yearsOfExperience: achieveData.yearsOfExperience || '', productsDelivered: achieveData.productsDelivered || '', clientSatisfaction: achieveData.clientSatisfaction || '', quote: achieveData.quote || '' });
    setImageFiles([]);
    setImagePreviews([]);
    setIsEditing(false);
  };

  const statCards = achieveData ? [
    { label: 'Years of Experience', value: achieveData.yearsOfExperience, icon: Trophy, color: 'amber' },
    { label: 'Products Delivered', value: achieveData.productsDelivered, icon: BarChart3, color: 'blue' },
    { label: 'Client Satisfaction', value: achieveData.clientSatisfaction, icon: Star, color: 'green' },
    { label: 'Images', value: achieveData.images?.length ?? 0, icon: ImagePlus, color: 'purple' },
  ] : [];

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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }} />
        <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.6) 0%, transparent 60%)' }} />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="dot dot-white animate-pulse2" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Homepage Management</span>
            <Trophy size={14} className="text-white/70 ml-1" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Achievements <span className="text-yellow-100">Section</span>
          </h2>
          <p className="text-white/75 text-sm">Showcase your company's milestones and accomplishments</p>
        </div>
      </div>

      {/* Stats */}
      {statCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="stat-card group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  s.color === 'amber' ? 'bg-amber-50' : s.color === 'blue' ? 'bg-blue-50' : s.color === 'green' ? 'bg-emerald-50' : 'bg-purple-50'
                }`}>
                  <s.icon size={18} className={
                    s.color === 'amber' ? 'text-amber-600' : s.color === 'blue' ? 'text-blue-600' : s.color === 'green' ? 'text-emerald-600' : 'text-purple-600'
                  } />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{s.value || '—'}</div>
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
            <p className="text-slate-500">Loading achievements...</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex gap-3 flex-wrap">
                {achieveData && !isEditing && (
                  <>
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary"><Edit size={15} /> Edit</button>
                    <button onClick={handleDelete} className="btn btn-secondary !text-red-600 hover:!bg-red-50" disabled={submitting}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </>
                )}
                <button onClick={fetchAchievements} className="btn btn-secondary" disabled={loading}>
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
            </div>

            {/* View Mode */}
            {achieveData && !isEditing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Stats grid */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Years of Experience', value: achieveData.yearsOfExperience, icon: Trophy, accent: 'amber' },
                    { label: 'Products Delivered', value: achieveData.productsDelivered, icon: BarChart3, accent: 'blue' },
                    { label: 'Client Satisfaction', value: achieveData.clientSatisfaction, icon: Star, accent: 'green' },
                  ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-4 ${
                      s.accent === 'amber' ? 'bg-amber-50 border-amber-400' :
                      s.accent === 'blue' ? 'bg-blue-50 border-blue-400' : 'bg-emerald-50 border-emerald-400'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <s.icon size={14} className={s.accent === 'amber' ? 'text-amber-600' : s.accent === 'blue' ? 'text-blue-600' : 'text-emerald-600'} />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-800">{s.value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                {achieveData.quote && (
                  <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                    <Quote size={20} className="text-slate-300 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-700 italic text-sm leading-relaxed">{achieveData.quote}</p>
                  </div>
                )}

                {/* Images manager */}
                <ImagesManager
                  images={achieveData.images || []}
                  onAdd={handleAddImage}
                  onUpdate={handleUpdateImage}
                  onDelete={handleDeleteImage}
                  submitting={submitting}
                />
              </motion.div>
            )}

            {/* Edit / Create Form */}
            {(isEditing || !achieveData) && (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} className="space-y-5">

                <div className="grid sm:grid-cols-3 gap-5">
                  {/* Years */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Trophy size={13} className="text-amber-500" /> Years of Experience *
                    </label>
                    <input type="text" value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      placeholder="e.g. 15" className="input w-full" required />
                  </div>
                  {/* Products */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <BarChart3 size={13} className="text-blue-500" /> Products Delivered
                    </label>
                    <input type="text" value={formData.productsDelivered}
                      onChange={(e) => setFormData({ ...formData, productsDelivered: e.target.value })}
                      placeholder="e.g. 2500" className="input w-full" />
                  </div>
                  {/* Satisfaction */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Star size={13} className="text-emerald-500" /> Client Satisfaction
                    </label>
                    <input type="text" value={formData.clientSatisfaction}
                      onChange={(e) => setFormData({ ...formData, clientSatisfaction: e.target.value })}
                      placeholder="e.g. 98%" className="input w-full" />
                  </div>
                </div>

                {/* Quote */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Quote size={13} className="text-slate-400" /> Quote / Tagline
                  </label>
                  <textarea value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder='e.g. "Excellence in scientific innovation"'
                    className="input w-full min-h-[80px] resize-y" />
                </div>

                {/* Images upload (create/update bulk) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <ImagePlus size={13} className="text-amber-500" /> Achievement Images
                    <span className="text-xs font-normal text-slate-400">(select multiple)</span>
                  </label>
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-amber-400 transition-colors">
                    {imagePreviews.length > 0 ? (
                      <div className="w-full space-y-3">
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {imagePreviews.map((p, i) => (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                              <img src={p} alt={`img-${i}`} className="w-full h-full object-cover" />
                              <button type="button"
                                onClick={() => { setImagePreviews(imagePreviews.filter((_, j) => j !== i)); setImageFiles(imageFiles.filter((_, j) => j !== i)); }}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center">
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <label className="flex items-center justify-center gap-2 text-sm text-amber-600 cursor-pointer hover:text-amber-500">
                          <Plus size={14} /> Add more
                          <input type="file" className="sr-only" accept="image/*" multiple onChange={handleImagesChange} />
                        </label>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex justify-center text-sm text-slate-600">
                          <label className="cursor-pointer font-medium text-amber-600 hover:text-amber-500">
                            <span>Upload images</span>
                            <input type="file" className="sr-only" accept="image/*" multiple onChange={handleImagesChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">Select multiple — same field name <code className="bg-slate-100 px-1 rounded">images</code></p>
                      </div>
                    )}
                  </div>
                  {achieveData && (
                    <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                      <AlertTriangle size={11} className="text-amber-400" />
                      Uploading new images here will replace existing ones. Use the image manager above to add/edit individual images.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {achieveData && (
                    <button type="button" onClick={cancelEdit} className="btn btn-secondary flex-1">
                      <X size={15} /> Cancel
                    </button>
                  )}
                  <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                    {submitting ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> {achieveData ? 'Update Achievements' : 'Create Achievements'}</>}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Empty */}
            {!achieveData && !isEditing && !loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Trophy size={32} className="text-amber-400" />
                </div>
                <p className="text-lg font-medium text-slate-600">No Achievements Yet</p>
                <p className="text-sm text-slate-400 mt-1">Add your company's key milestones</p>
                <button onClick={() => setIsEditing(true)} className="btn btn-primary mt-4">
                  <Plus size={16} /> Create Achievements Section
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tips */}
      <div className="card p-5 bg-gradient-to-r from-amber-50 to-yellow-50 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Award size={18} className="text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Tips for a Compelling Achievements Section</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Use specific numbers — "2,500+ Products" is more powerful than "many products"</li>
              <li>• Client satisfaction should reflect a real metric (e.g. NPS or survey result)</li>
              <li>• Images are managed individually after creation — use the grid editor above</li>
              <li>• The quote should inspire trust and reinforce your brand voice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}