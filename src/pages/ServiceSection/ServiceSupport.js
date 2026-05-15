// src/components/admin/ServiceSupport.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, X, Sparkles, Eye, Loader2, CheckCircle, AlertCircle, EyeOff, Trash2, Plus, Headphones, Shield } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}<span className="text-sm">{message}</span><button onClick={onClose}><X size={16} /></button>
    </motion.div>
  );
};

function ServiceSupport() {
  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ title: '', tag: '', description: '', isActive: true });
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState('');

  useEffect(() => { fetchSupport(); }, []);

  const fetchSupport = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-support', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 404) { setSupport(null); return; }
      const data = await response.json();
      if (data.success && data.data) {
        setSupport(data.data);
        setFormData({ title: data.data.title || '', tag: data.data.tag || '', description: data.data.description || '', isActive: data.data.isActive || false });
        setPoints(data.data.points || []);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const addPoint = async () => {
    if (!newPoint.trim()) { showToast('Please enter a point', 'error'); return; }
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-support/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ point: newPoint })
      });
      setNewPoint(''); fetchSupport(); showToast('Point added');
    } catch (error) { showToast('Failed to add point', 'error'); }
  };

  const deletePoint = async (index) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-support/points/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSupport(); showToast('Point deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      showToast('Support section updated'); fetchSupport(); setIsEditing(false);
    } catch (error) { showToast('Update failed', 'error'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete Service Support section?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-support', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSupport(null); showToast('Support section deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  const toggleStatus = async () => {
    if (!support) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, isActive: !formData.isActive })
      });
      fetchSupport(); showToast(!formData.isActive ? 'Activated!' : 'Deactivated!');
    } catch (error) { showToast('Status update failed', 'error'); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /><span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Services Page Management</span><Sparkles size={14} className="text-yellow-300" /></div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Service <span className="text-amber-200">Support</span></h2>
          <p className="text-white/70 text-sm">Manage customer support and service commitment section</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div> : (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div className="flex gap-3">
                {support && !isEditing && <><button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl"><Edit size={16} className="inline mr-2" />Edit</button><button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} className="inline mr-2" />Delete</button><button onClick={toggleStatus} className={`px-4 py-2 rounded-xl ${support.isActive ? 'bg-amber-500' : 'bg-emerald-500'} text-white`}>{support.isActive ? <EyeOff size={16} className="inline mr-2" /> : <Eye size={16} className="inline mr-2" />}{support.isActive ? 'Deactivate' : 'Activate'}</button></>}
              </div>
              {support && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${support.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{support.isActive ? '● Active' : '○ Inactive'}</span>}
            </div>

            {support && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div><span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs mb-3">{support.tag}</span><h3 className="text-2xl font-bold text-slate-800 mb-3">{support.title}</h3><p className="text-slate-600">{support.description}</p></div>
                <div><h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Headphones size={18} />Support Features</h4><div className="grid md:grid-cols-2 gap-3">{points.map((p, idx) => <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"><Shield size={16} className="text-amber-500" /><span>{p.point}</span></div>)}</div></div>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-sm font-semibold mb-2">Tag</label><input type="text" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div>
                <div><label className="block text-sm font-semibold mb-2">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div>
                <div><label className="block text-sm font-semibold mb-2">Description</label><textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div>
                
                <div><label className="block text-sm font-semibold mb-2">Support Features</label><div className="space-y-2">{points.map((p, idx) => <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span>{p.point}</span><button type="button" onClick={() => deletePoint(idx)} className="text-red-500"><Trash2 size={16} /></button></div>)}</div><div className="flex gap-2 mt-3"><input type="text" value={newPoint} onChange={(e) => setNewPoint(e.target.value)} placeholder="New support feature" className="flex-1 px-4 py-2 border rounded-xl" /><button type="button" onClick={addPoint} className="px-4 py-2 bg-emerald-600 text-white rounded-xl"><Plus size={16} /></button></div></div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><div><span className="text-sm font-semibold">Active Status</span></div><button type="button" onClick={() => setFormData({...formData, isActive: !formData.isActive})} className={`relative inline-flex h-6 w-11 items-center rounded-full ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                <div className="flex gap-3">{support && <button type="button" onClick={() => { setIsEditing(false); fetchSupport(); }} className="flex-1 px-4 py-2 border rounded-xl">Cancel</button>}<button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl">{submitting ? <Loader2 className="animate-spin inline" /> : <Save className="inline mr-2" />}Update Support</button></div>
              </motion.form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceSupport;