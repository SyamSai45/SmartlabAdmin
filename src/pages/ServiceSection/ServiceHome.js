// src/components/admin/ServiceHome.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit, Save, X, Sparkles, Eye, RefreshCw, Loader2,
  CheckCircle, AlertCircle, EyeOff, Trash2, Upload,
  ZoomIn, AlertTriangle, Home, Image as ImageIcon
} from 'lucide-react';

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

const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-w-5xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white"><X size={24} /></button>
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
      </motion.div>
    </div>
  );
};

function ServiceHome() {
  const [serviceHome, setServiceHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    description: '',
    isActive: true,
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchServiceHome();
  }, []);

  const fetchServiceHome = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-home', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 404) {
        setServiceHome(null);
        return;
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setServiceHome(data.data);
        setFormData({
          title: data.data.title || '',
          tag: data.data.tag || '',
          description: data.data.description || '',
          isActive: data.data.isActive || false,
          image: null
        });
        setImagePreview(data.data.image || '');
      }
    } catch (error) {
      console.error('Error fetching service home:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.tag.trim() || !formData.description.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    
    if (!imageFile && !serviceHome) {
      showToast('Please select an image', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('tag', formData.tag);
      fd.append('description', formData.description);
      fd.append('isActive', formData.isActive);
      if (imageFile) fd.append('image', imageFile);
      
      const url = 'https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-home';
      const method = serviceHome ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(serviceHome ? 'Service Home updated successfully!' : 'Service Home created successfully!', 'success');
        await fetchServiceHome();
        setIsEditing(false);
        setImageFile(null);
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      showToast('Failed to save service home', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete Service Home section?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-home', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setServiceHome(null);
      setImagePreview('');
      showToast('Service Home deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete', 'error');
    }
  };

  const toggleStatus = async () => {
    if (!serviceHome) return;
    try {
      const token = sessionStorage.getItem('token');
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('tag', formData.tag);
      fd.append('description', formData.description);
      fd.append('isActive', !formData.isActive);
      
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-home', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      await fetchServiceHome();
      showToast(!formData.isActive ? 'Service Home activated!' : 'Service Home deactivated!', 'success');
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const stats = [
    { label: 'Status', value: serviceHome?.isActive ? 'Active' : 'Inactive', color: serviceHome?.isActive ? 'green' : 'slate' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <AnimatePresence>{showPreviewModal && imagePreview && <ImagePreviewModal imageUrl={imagePreview} onClose={() => setShowPreviewModal(false)} />}</AnimatePresence>

      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Services Page Management</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Service <span className="text-cyan-200">Home</span></h2>
          <p className="text-white/70 text-sm">Manage the main service home section</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-xl ${stat.color === 'green' ? 'bg-emerald-50' : 'bg-slate-50'} flex items-center justify-center mb-3`}>
              {stat.label === 'Status' ? (serviceHome?.isActive ? <CheckCircle size={18} className="text-emerald-600" /> : <EyeOff size={18} className="text-slate-600" />) : <Home size={18} className="text-blue-600" />}
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? (
          <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" /><p>Loading...</p></div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex gap-3">
                {serviceHome && !isEditing && (
                  <>
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"><Edit size={16} />Edit</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center gap-2"><Trash2 size={16} />Delete</button>
                    <button onClick={toggleStatus} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${serviceHome?.isActive ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      {serviceHome?.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      {serviceHome?.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </>
                )}
              </div>
              {serviceHome && !isEditing && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${serviceHome?.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{serviceHome?.isActive ? '● Active' : '○ Inactive'}</span>}
            </div>

            {serviceHome && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {imagePreview && (
                    <div className="relative rounded-xl overflow-hidden bg-slate-100">
                      <img src={imagePreview} alt="Service Home" className="w-full h-64 object-cover" />
                      <button onClick={() => setShowPreviewModal(true)} className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg shadow-lg"><ZoomIn size={16} /></button>
                    </div>
                  )}
                  <div className="space-y-4">
                    <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{serviceHome.tag}</span>
                    <h3 className="text-2xl font-bold text-slate-800">{serviceHome.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{serviceHome.description}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl"><label className="text-xs font-semibold text-slate-500 uppercase">Tag</label><p className="text-slate-800 mt-1">{serviceHome.tag}</p></div>
                  <div className="p-4 bg-slate-50 rounded-xl"><label className="text-xs font-semibold text-slate-500 uppercase">Title</label><p className="text-slate-800 mt-1">{serviceHome.title}</p></div>
                  <div className="p-4 bg-slate-50 rounded-xl md:col-span-2"><label className="text-xs font-semibold text-slate-500 uppercase">Description</label><p className="text-slate-600 mt-1">{serviceHome.description}</p></div>
                </div>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">Tag *</label><input type="text" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="e.g., Our Services" required /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Enter title" required /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label><textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Enter description" required /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">Image {!serviceHome && '*'}</label><div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors"><Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" /><label className="cursor-pointer inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Choose File<input type="file" hidden accept="image/*" onChange={handleImageChange} /></label></div></div>
                {imagePreview && <div className="relative"><img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" /><button type="button" onClick={() => { setImagePreview(''); setImageFile(null); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X size={14} /></button></div>}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><div><span className="text-sm font-semibold">Active Status</span><p className="text-xs text-slate-500">Display this section on services page</p></div><button type="button" onClick={() => setFormData({...formData, isActive: !formData.isActive})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                <div className="flex gap-3 pt-4">{serviceHome && <button type="button" onClick={() => { setIsEditing(false); fetchServiceHome(); setImageFile(null); }} className="flex-1 px-4 py-2 border border-slate-300 rounded-xl">Cancel</button>}<button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{serviceHome ? 'Update' : 'Create'}</button></div>
              </motion.form>
            )}
          </>
        )}
      </div>

      {!serviceHome && !isEditing && !loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center"><Home size={32} className="text-slate-400" /></div>
          <p className="text-lg font-medium text-slate-600">No Service Home Section Found</p>
          <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 mt-4 inline-flex items-center gap-2"><Edit size={16} />Create Service Home</button>
        </div>
      )}
    </div>
  );
}

export default ServiceHome;