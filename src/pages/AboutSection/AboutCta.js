// src/components/admin/AboutCta.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Sparkles, Loader2, CheckCircle, AlertCircle, EyeOff, Eye } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm">{message}</span>
    </div>
  );
};

function AboutCta() {
  const [ctaData, setCtaData] = useState(null);
  const [form, setForm] = useState({ title: '', tag: '', description: '', isActive: true });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/cta', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCtaData(data.data);
        setForm({
          title: data.data.title || '',
          tag: data.data.tag || '',
          description: data.data.description || '',
          isActive: data.data.isActive || false
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type) => setToast({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.tag || !form.description) {
      showToast('Please fill all fields', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const url = 'https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/cta';
      const method = ctaData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        showToast(ctaData ? 'CTA updated!' : 'CTA created!', 'success');
        fetchData();
        setIsEditing(false);
      }
    } catch (error) {
      showToast('Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete CTA section?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/cta', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCtaData(null);
      setForm({ title: '', tag: '', description: '', isActive: true });
      showToast('CTA deleted', 'success');
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  const toggleStatus = async () => {
    if (!ctaData) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, isActive: !form.isActive })
      });
      fetchData();
      showToast(!form.isActive ? 'Activated!' : 'Deactivated!', 'success');
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">About Page Management</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Call to <span className="text-purple-200">Action</span></h2>
          <p className="text-white/70 text-sm">Manage the CTA section of your about page</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? (
          <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                {ctaData && !isEditing && <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2"><Save size={16} />Edit</button>}
                {ctaData && <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl flex items-center gap-2"><Trash2 size={16} />Delete</button>}
                {ctaData && <button onClick={toggleStatus} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${form.isActive ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>{form.isActive ? <EyeOff size={16} /> : <Eye size={16} />}{form.isActive ? 'Deactivate' : 'Activate'}</button>}
              </div>
              {ctaData && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${form.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{form.isActive ? 'Active' : 'Inactive'}</span>}
            </div>

            {ctaData && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs mb-4">{ctaData.tag}</span>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">{ctaData.title}</h3>
                <p className="text-slate-600 max-w-2xl mx-auto">{ctaData.description}</p>
                <div className="mt-6 inline-flex px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold">Get Started</div>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-sm font-semibold mb-2">Tag *</label><input type="text" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl" required /></div>
                <div><label className="block text-sm font-semibold mb-2">Title *</label><input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl" required /></div>
                <div><label className="block text-sm font-semibold mb-2">Description *</label><textarea rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl" required /></div>
                <div className="flex items-center gap-3"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} /><span>Active</span></div>
                <div className="flex gap-3">
                  {ctaData && <button type="button" onClick={() => { setIsEditing(false); setForm({...ctaData}); }} className="flex-1 px-4 py-2 border border-slate-300 rounded-xl">Cancel</button>}
                  <button type="submit" disabled={submitting} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl">{submitting ? <Loader2 className="animate-spin inline" /> : <Save className="inline mr-2" />}{ctaData ? 'Update' : 'Create'}</button>
                </div>
              </motion.form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AboutCta;