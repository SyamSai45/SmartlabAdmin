// src/components/admin/SupportCta.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, X, Sparkles, Eye, Loader2, CheckCircle, AlertCircle, EyeOff, Trash2, Phone, Mail, RefreshCw } from 'lucide-react';

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

export function SupportCta() {
  const [cta, setCta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ title: '', tag: '', description: '', email: '', phoneNumber: '', isActive: true });

  useEffect(() => { fetchCta(); }, []);

  const fetchCta = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/cta', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 404) { setCta(null); return; }
      const data = await response.json();
      if (data.success && data.data) {
        setCta(data.data);
        setFormData({ title: data.data.title || '', tag: data.data.tag || '', description: data.data.description || '', email: data.data.email || '', phoneNumber: data.data.phoneNumber || '', isActive: data.data.isActive || false });
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) { showToast('Please fill required fields', 'error'); return; }
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) { showToast('CTA section updated'); fetchCta(); setIsEditing(false); }
    } catch (error) { showToast('Update failed', 'error'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete CTA section?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/cta', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCta(null); showToast('CTA section deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  const toggleStatus = async () => {
    if (!cta) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, isActive: !formData.isActive })
      });
      fetchCta(); showToast(!formData.isActive ? 'Activated!' : 'Deactivated!');
    } catch (error) { showToast('Status update failed', 'error'); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /><span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Support Page Management</span><Sparkles size={14} className="text-yellow-300" /></div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Support <span className="text-rose-200">CTA</span></h2>
          <p className="text-white/70 text-sm">Manage call to action section</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div> : (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div className="flex gap-3">
                {cta && !isEditing && <><button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl"><Edit size={16} className="inline mr-2" />Edit CTA</button><button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} className="inline mr-2" />Delete</button><button onClick={toggleStatus} className={`px-4 py-2 rounded-xl ${cta.isActive ? 'bg-amber-500' : 'bg-emerald-500'} text-white`}>{cta.isActive ? <EyeOff size={16} className="inline mr-2" /> : <Eye size={16} className="inline mr-2" />}{cta.isActive ? 'Deactivate' : 'Activate'}</button></>}
              </div>
              {cta && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cta.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{cta.isActive ? '● Active' : '○ Inactive'}</span>}
            </div>

            {cta && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs mb-4">{cta.tag || 'Get in Touch'}</span>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">{cta.title}</h3>
                <p className="text-slate-600 max-w-2xl mx-auto mb-6">{cta.description}</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"><Phone size={16} className="text-red-500" /><span className="text-slate-700">{cta.phoneNumber}</span></div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"><Mail size={16} className="text-red-500" /><span className="text-slate-700">{cta.email}</span></div>
                </div>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-sm font-semibold mb-2">Tag (optional)</label><input type="text" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} placeholder="e.g., Get in Touch" className="w-full px-4 py-2 border rounded-xl" /></div>
                <div><label className="block text-sm font-semibold mb-2">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div>
                <div><label className="block text-sm font-semibold mb-2">Description *</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div>
                <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-semibold mb-2">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div><div><label className="block text-sm font-semibold mb-2">Phone Number *</label><input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div></div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><div><span className="text-sm font-semibold">Active Status</span></div><button type="button" onClick={() => setFormData({...formData, isActive: !formData.isActive})} className={`relative inline-flex h-6 w-11 items-center rounded-full ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                <div className="flex gap-3">{cta && <button type="button" onClick={() => { setIsEditing(false); fetchCta(); }} className="flex-1 px-4 py-2 border rounded-xl">Cancel</button>}<button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl">{submitting ? <Loader2 className="animate-spin inline" /> : <RefreshCw size={16} className="inline mr-2" />}{cta ? 'Update CTA' : 'Create CTA'}</button></div>
              </motion.form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SupportCta;