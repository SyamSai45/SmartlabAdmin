// src/components/admin/ResourceFaqs.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Loader2, CheckCircle, AlertCircle, Save, ChevronDown } from 'lucide-react';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

export default function ResourceFaqs() {
  const [sectionData, setSectionData] = useState({ tag: 'FAQs', title: 'Frequently Asked Questions', description: '', isActive: true });
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '', isActive: true });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/resources/faqs', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSectionData({ tag: data.data.tag || 'FAQs', title: data.data.title || 'Frequently Asked Questions', description: data.data.description || '', isActive: data.data.isActive !== false });
          setFaqs(data.data.faqs || []);
        }
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const updateSection = async () => {
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/resources/faqs', {
        method: 'PUT',
        headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: sectionData.tag, title: sectionData.title, description: sectionData.description, faqs: faqs, isActive: sectionData.isActive })
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: 'FAQ section updated!' }); setTimeout(() => setMessage({ type: '', text: '' }), 3000); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to update' }); } finally { setSubmitting(false); }
  };

  const saveFaq = async () => {
    if (!formData.question || !formData.answer) { setMessage({ type: 'error', text: 'Please fill all fields' }); return; }
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const url = editingIndex !== null ? `https://smartlabtechbackend-p5h6.onrender.com/api/resources/faqs/${editingIndex}` : 'https://smartlabtechbackend-p5h6.onrender.com/api/resources/faqs/add';
      const method = editingIndex !== null ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: editingIndex !== null ? 'FAQ updated!' : 'FAQ added!' }); fetchData(); closeModal(); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to save' }); } finally { setSubmitting(false); }
  };

  const deleteFaq = async (index) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/resources/faqs/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: 'FAQ deleted!' }); fetchData(); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to delete' }); }
  };

  const openModal = (faq = null, index = null) => {
    if (faq) { setFormData({ question: faq.question || '', answer: faq.answer || '', isActive: faq.isActive !== false }); setEditingIndex(index); }
    else { setFormData({ question: '', answer: '', isActive: true }); setEditingIndex(null); }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-blue-600" /></div>;

  return (
    <>
      <FontLink />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-px bg-blue-600" /><span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">Resource Page</span></div><h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>FAQs Management</h1><p className="text-slate-500 mt-1">Manage frequently asked questions</p></div>

        {message.text && <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}<span>{message.text}</span></div>}

        <div className="bg-white/80 rounded-2xl p-6 border shadow-lg mb-6"><h2 className="text-lg font-bold mb-4">Section Settings</h2><div className="grid gap-4"><input type="text" value={sectionData.tag} onChange={(e) => setSectionData({ ...sectionData, tag: e.target.value })} placeholder="Section Tag/Badge" className="px-4 py-2 rounded-xl border" /><input type="text" value={sectionData.title} onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })} placeholder="Section Title" className="px-4 py-2 rounded-xl border" /><textarea value={sectionData.description} onChange={(e) => setSectionData({ ...sectionData, description: e.target.value })} placeholder="Section Description" rows={2} className="px-4 py-2 rounded-xl border" /></div><div className="flex justify-end mt-4"><button onClick={updateSection} disabled={submitting} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold flex items-center gap-2">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Settings</button></div></div>

        <div className="bg-white/80 rounded-2xl p-6 border shadow-lg"><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">FAQs ({faqs.length})</h2><button onClick={() => openModal()} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2"><Plus size={16} /> Add FAQ</button></div><div className="space-y-3">{faqs.map((faq, idx) => (<div key={idx} className="bg-slate-50 rounded-xl p-4 border"><div className="flex justify-between items-start"><div className="flex-1"><p className="font-semibold text-slate-800">{faq.question}</p><p className="text-sm text-slate-500 mt-1">{faq.answer}</p></div><div className="flex gap-2 ml-4"><button onClick={() => openModal(faq, idx)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"><Edit size={14} /></button><button onClick={() => deleteFaq(idx)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={14} /></button></div></div></div>))}{faqs.length === 0 && <p className="text-center text-slate-400 py-8">No FAQs yet.</p>}</div></div>

        <AnimatePresence>{modalOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeModal}><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}><div className="p-4 border-b flex justify-between"><h3 className="text-xl font-bold">{editingIndex !== null ? 'Edit FAQ' : 'Add FAQ'}</h3><button onClick={closeModal}><X size={20} /></button></div><div className="p-6 space-y-4"><input type="text" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} placeholder="Question" className="w-full px-4 py-2 rounded-xl border" /><textarea value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} placeholder="Answer" rows={3} className="w-full px-4 py-2 rounded-xl border" /><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active</label><button onClick={saveFaq} disabled={submitting} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold flex items-center justify-center gap-2">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{submitting ? 'Saving...' : 'Save FAQ'}</button></div></motion.div></motion.div>}</AnimatePresence>
      </div>
    </>
  );
}