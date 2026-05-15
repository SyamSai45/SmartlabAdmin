// src/components/admin/SupportFaq.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, X, Sparkles, Eye, Loader2, CheckCircle, AlertCircle, EyeOff, Trash2, Plus, HelpCircle, RefreshCw } from 'lucide-react';

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

function SupportFaq() {
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ title: '', tag: '', description: '', isActive: true });
  const [faqs, setFaqs] = useState([]);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [editingFaqIndex, setEditingFaqIndex] = useState(null);

  useEffect(() => { fetchFaq(); }, []);

  const fetchFaq = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/faq', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 404) { setFaq(null); return; }
      const data = await response.json();
      if (data.success && data.data) {
        setFaq(data.data);
        setFormData({ title: data.data.title || '', tag: data.data.tag || '', description: data.data.description || '', isActive: data.data.isActive || false });
        setFaqs(data.data.faqs || []);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const addFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) { showToast('Question and answer required', 'error'); return; }
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/faq/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(faqForm)
      });
      if (response.ok) { setFaqForm({ question: '', answer: '' }); fetchFaq(); showToast('FAQ added'); }
    } catch (error) { showToast('Failed to add FAQ', 'error'); }
  };

  const updateFaq = async () => {
    if (editingFaqIndex === null || !faqForm.question.trim()) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/faq/${editingFaqIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(faqForm)
      });
      setEditingFaqIndex(null); setFaqForm({ question: '', answer: '' }); fetchFaq(); showToast('FAQ updated');
    } catch (error) { showToast('Update failed', 'error'); }
  };

  const deleteFaq = async (index) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/faq/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchFaq(); showToast('FAQ deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) { showToast('FAQ section updated'); fetchFaq(); setIsEditing(false); }
    } catch (error) { showToast('Update failed', 'error'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete FAQ section?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/faq', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFaq(null); showToast('FAQ section deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  const toggleStatus = async () => {
    if (!faq) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, isActive: !formData.isActive })
      });
      fetchFaq(); showToast(!formData.isActive ? 'Activated!' : 'Deactivated!');
    } catch (error) { showToast('Status update failed', 'error'); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /><span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Support Page Management</span><Sparkles size={14} className="text-yellow-300" /></div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Support <span className="text-amber-200">FAQ</span></h2>
          <p className="text-white/70 text-sm">Manage frequently asked questions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div> : (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div className="flex gap-3">
                {faq && !isEditing && <><button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl"><Edit size={16} className="inline mr-2" />Edit Section</button><button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} className="inline mr-2" />Delete</button><button onClick={toggleStatus} className={`px-4 py-2 rounded-xl ${faq.isActive ? 'bg-amber-500' : 'bg-emerald-500'} text-white`}>{faq.isActive ? <EyeOff size={16} className="inline mr-2" /> : <Eye size={16} className="inline mr-2" />}{faq.isActive ? 'Deactivate' : 'Activate'}</button></>}
              </div>
              {faq && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${faq.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{faq.isActive ? '● Active' : '○ Inactive'}</span>}
            </div>

            {faq && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs mb-3">{faq.tag}</span><h2 className="text-3xl font-bold text-slate-800">{faq.title}</h2><p className="text-slate-500 mt-2">{faq.description}</p></div>
                <div className="space-y-4">{faqs.map((item, idx) => <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-200"><div className="flex items-start gap-3"><HelpCircle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" /><div><h3 className="font-semibold text-slate-800 mb-2">{item.question}</h3><p className="text-slate-600 text-sm">{item.answer}</p></div></div><button onClick={() => { setEditingFaqIndex(idx); setFaqForm({ question: item.question, answer: item.answer }); setIsEditing(true); }} className="mt-3 text-blue-600 text-sm hover:underline">Edit</button></div>)}</div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-sm font-semibold mb-2">Section Tag</label><input type="text" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-sm font-semibold mb-2">Section Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-sm font-semibold mb-2">Description</label><textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-yellow-600 text-white rounded-xl">{submitting ? <Loader2 className="animate-spin inline" /> : <RefreshCw size={16} className="inline mr-2" />}Update Section</button>
                </form>

                <div className="border-t pt-6"><h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18} />Manage FAQs</h3><div className="space-y-3 mb-6"><input type="text" placeholder="Question" value={faqForm.question} onChange={(e) => setFaqForm({...faqForm, question: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /><textarea rows={3} placeholder="Answer" value={faqForm.answer} onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /><button onClick={editingFaqIndex !== null ? updateFaq : addFaq} className="px-4 py-2 bg-amber-600 text-white rounded-xl">{editingFaqIndex !== null ? <Save size={16} className="inline mr-2" /> : <Plus size={16} className="inline mr-2" />}{editingFaqIndex !== null ? 'Update FAQ' : 'Add FAQ'}</button></div>
                  <div className="space-y-2">{faqs.map((item, idx) => <div key={idx} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg"><div className="flex-1"><h4 className="font-medium text-sm">{item.question}</h4><p className="text-xs text-slate-500 mt-1">{item.answer.substring(0, 100)}...</p></div><div className="flex gap-2 ml-2"><button onClick={() => { setEditingFaqIndex(idx); setFaqForm({ question: item.question, answer: item.answer }); }} className="text-amber-600"><Edit size={16} /></button><button onClick={() => deleteFaq(idx)} className="text-red-500"><Trash2 size={16} /></button></div></div>)}</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SupportFaq;