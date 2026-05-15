// src/components/admin/SupportLifeCycle.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, X, Sparkles, Eye, Loader2, CheckCircle, AlertCircle, EyeOff, Trash2, Plus, List, Heart, RefreshCw } from 'lucide-react';

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

function SupportLifeCycle() {
  const [lifeCycle, setLifeCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ title: '', tag: '', description: '', metaTitle: '', metaDescription: '', isActive: true });
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState('');

  useEffect(() => { fetchLifeCycle(); }, []);

  const fetchLifeCycle = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/life-cycle', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 404) { setLifeCycle(null); return; }
      const data = await response.json();
      if (data.success && data.data) {
        setLifeCycle(data.data);
        setFormData({ title: data.data.title || '', tag: data.data.tag || '', description: data.data.description || '', metaTitle: data.data.metaTitle || '', metaDescription: data.data.metaDescription || '', isActive: data.data.isActive || false });
        setPoints(data.data.points || []);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const addPoint = async () => {
    if (!newPoint.trim()) { showToast('Please enter a point', 'error'); return; }
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/life-cycle/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ point: newPoint })
      });
      if (response.ok) { setNewPoint(''); fetchLifeCycle(); showToast('Point added'); }
    } catch (error) { showToast('Failed to add point', 'error'); }
  };

  const deletePoint = async (index) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/life-cycle/points/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchLifeCycle(); showToast('Point deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/life-cycle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) { showToast('Life cycle section updated'); fetchLifeCycle(); setIsEditing(false); }
    } catch (error) { showToast('Update failed', 'error'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete Life Cycle section?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/life-cycle', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLifeCycle(null); showToast('Life cycle section deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  const toggleStatus = async () => {
    if (!lifeCycle) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/life-cycle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, isActive: !formData.isActive })
      });
      fetchLifeCycle(); showToast(!formData.isActive ? 'Activated!' : 'Deactivated!');
    } catch (error) { showToast('Status update failed', 'error'); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /><span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Support Page Management</span><Sparkles size={14} className="text-yellow-300" /></div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Support <span className="text-emerald-200">Life Cycle</span></h2>
          <p className="text-white/70 text-sm">Manage equipment life cycle support process</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div> : (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div className="flex gap-3">
                {lifeCycle && !isEditing && <><button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl"><Edit size={16} className="inline mr-2" />Edit Section</button><button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} className="inline mr-2" />Delete</button><button onClick={toggleStatus} className={`px-4 py-2 rounded-xl ${lifeCycle.isActive ? 'bg-amber-500' : 'bg-emerald-500'} text-white`}>{lifeCycle.isActive ? <EyeOff size={16} className="inline mr-2" /> : <Eye size={16} className="inline mr-2" />}{lifeCycle.isActive ? 'Deactivate' : 'Activate'}</button></>}
              </div>
              {lifeCycle && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lifeCycle.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{lifeCycle.isActive ? '● Active' : '○ Inactive'}</span>}
            </div>

            {lifeCycle && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="text-center"><span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs mb-3">{lifeCycle.tag}</span><h2 className="text-3xl font-bold text-slate-800">{lifeCycle.title}</h2><p className="text-slate-500 mt-2 max-w-2xl mx-auto">{lifeCycle.description}</p></div>
                <div><h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Heart size={18} className="text-green-500" />Life Cycle Stages</h3><div className="grid md:grid-cols-2 gap-3">{points.map((p, idx) => <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"><CheckCircle size={16} className="text-green-500" /><span>{p.point}</span></div>)}</div></div>
                {lifeCycle.metaTitle && <div className="p-4 bg-slate-50 rounded-xl"><label className="text-xs font-semibold text-slate-500 uppercase">Meta Title</label><p className="text-slate-600 text-sm mt-1">{lifeCycle.metaTitle}</p></div>}
                {lifeCycle.metaDescription && <div className="p-4 bg-slate-50 rounded-xl"><label className="text-xs font-semibold text-slate-500 uppercase">Meta Description</label><p className="text-slate-600 text-sm mt-1">{lifeCycle.metaDescription}</p></div>}
              </motion.div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-sm font-semibold mb-2">Tag</label><input type="text" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-sm font-semibold mb-2">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-sm font-semibold mb-2">Description</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-semibold mb-2">Meta Title</label><input type="text" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div><div><label className="block text-sm font-semibold mb-2">Meta Description</label><textarea rows={2} value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div></div>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded-xl">{submitting ? <Loader2 className="animate-spin inline" /> : <RefreshCw size={16} className="inline mr-2" />}Update Section</button>
                </form>

                <div className="border-t pt-6"><h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18} />Manage Life Cycle Stages</h3><div className="flex gap-2 mb-4"><input type="text" value={newPoint} onChange={(e) => setNewPoint(e.target.value)} placeholder="New stage" className="flex-1 px-4 py-2 border rounded-xl" /><button onClick={addPoint} className="px-4 py-2 bg-emerald-600 text-white rounded-xl"><Plus size={16} /></button></div><div className="space-y-2">{points.map((p, idx) => <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span>{p.point}</span><button onClick={() => deletePoint(idx)} className="text-red-500"><Trash2 size={16} /></button></div>)}</div></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SupportLifeCycle;