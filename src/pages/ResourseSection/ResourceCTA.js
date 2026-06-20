// src/components/admin/ResourceCTA.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, Save, Trash2, Eye, EyeOff } from 'lucide-react';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

export default function ResourceCTA() {
  const [ctaData, setCtaData] = useState({ title: '', description: '', buttonText: 'Contact Us', isActive: true });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => { fetchCTA(); }, []);

  const fetchCTA = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/cta', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) setCtaData(data.data);
      } else if (response.status !== 404) console.error('Failed to fetch CTA');
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/cta', {
        method: 'PUT',
        headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
        body: JSON.stringify(ctaData)
      });
      const data = await response.json();
      if (data.success) { setSuccess('CTA section saved successfully!'); setTimeout(() => setSuccess(null), 3000); }
      else setError(data.message || 'Failed to save CTA');
    } catch (err) { setError('Network error. Please try again.'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete the CTA section?')) return;
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/cta', {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) { setSuccess('CTA section deleted!'); setCtaData({ title: '', description: '', buttonText: 'Contact Us', isActive: true }); setTimeout(() => setSuccess(null), 3000); }
      else setError(data.message || 'Failed to delete CTA');
    } catch (err) { setError('Network error.'); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-blue-600" /></div>;

  return (
    <>
      <FontLink />
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-px bg-blue-600" /><span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">Resource Page</span></div><h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Call to Action (CTA)</h1><p className="text-slate-500 mt-1">Manage the call-to-action section at the bottom of the resources page</p></div>

        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2"><CheckCircle size={18} className="text-green-600" /><span className="text-green-700 text-sm">{success}</span></div>}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"><AlertCircle size={18} className="text-red-600" /><span className="text-red-700 text-sm">{error}</span></div>}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Title</label><input type="text" value={ctaData.title} onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea rows={3} value={ctaData.description} onChange={(e) => setCtaData({ ...ctaData, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label><input type="text" value={ctaData.buttonText} onChange={(e) => setCtaData({ ...ctaData, buttonText: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required /></div>
            <div className="flex items-center justify-between"><label className="flex items-center gap-2 cursor-pointer"><span className="text-sm font-medium text-slate-700">Active</span><button type="button" onClick={() => setCtaData({ ...ctaData, isActive: !ctaData.isActive })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ctaData.isActive ? 'bg-blue-600' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ctaData.isActive ? 'translate-x-6' : 'translate-x-1'}`} /></button></label></div>
            <div className="flex gap-3 pt-4"><button type="submit" disabled={submitting} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold hover:shadow-lg disabled:opacity-50">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{submitting ? 'Saving...' : 'Save CTA'}</button>{ctaData.title && <button type="button" onClick={handleDelete} disabled={submitting} className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>}</div>
          </form>
        </div>

        {/* Preview */}
        {ctaData.isActive && ctaData.title && (<div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl text-center text-white"><h3 className="text-xl font-bold">{ctaData.title}</h3><p className="text-white/80 text-sm mt-2">{ctaData.description}</p><button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-xl font-semibold text-sm">{ctaData.buttonText}</button><p className="text-xs text-white/50 mt-3 text-center">Preview of how the CTA will appear</p></div>)}
      </div>
    </>
  );
}