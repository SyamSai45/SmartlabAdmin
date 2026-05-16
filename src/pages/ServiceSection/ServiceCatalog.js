// src/components/admin/ServiceCatalog.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, X, Sparkles, Eye, Loader2, CheckCircle, AlertCircle, EyeOff, Trash2, Plus, Grid, FolderOpen, Archive } from 'lucide-react';

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

function ServiceCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ title: '', tag: '', isActive: true });
  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState({ title: '', description: '', icon: '' });
  const [editingCardIndex, setEditingCardIndex] = useState(null);

  useEffect(() => { fetchCatalog(); }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-catalogue', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 404) { setCatalog(null); return; }
      const data = await response.json();
      if (data.success && data.data) {
        setCatalog(data.data);
        setFormData({ title: data.data.title || '', tag: data.data.tag || '', isActive: data.data.isActive || false });
        setCards(data.data.cards || []);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const addCard = async () => {
    if (!cardForm.title.trim() || !cardForm.description.trim()) { showToast('Title and description required', 'error'); return; }
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-catalogue/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cardForm)
      });
      if (response.ok) { setCardForm({ title: '', description: '', icon: '' }); fetchCatalog(); showToast('Card added'); }
    } catch (error) { showToast('Failed to add card', 'error'); }
  };

  const updateCard = async () => {
    if (editingCardIndex === null || !cardForm.title.trim()) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-catalogue/cards/${editingCardIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cardForm)
      });
      setEditingCardIndex(null); setCardForm({ title: '', description: '', icon: '' }); fetchCatalog(); showToast('Card updated');
    } catch (error) { showToast('Update failed', 'error'); }
  };

  const deleteCard = async (index) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-catalogue/cards/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCatalog(); showToast('Card deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-catalogue', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) { showToast('Catalog updated'); fetchCatalog(); setIsEditing(false); }
    } catch (error) { showToast('Update failed', 'error'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete Service Catalog?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/service-catalogue', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCatalog(null); showToast('Catalog deleted');
    } catch (error) { showToast('Delete failed', 'error'); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /><span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Services Page Management</span><Sparkles size={14} className="text-yellow-300" /></div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Service <span className="text-emerald-200">Catalog</span></h2>
          <p className="text-white/70 text-sm">Manage service catalog cards and offerings</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div> : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                {catalog && !isEditing && <><button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl"><Edit size={16} className="inline mr-2" />Edit Section</button><button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} className="inline mr-2" />Delete</button></>}
              </div>
              {catalog && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${catalog.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{catalog.isActive ? '● Active' : '○ Inactive'}</span>}
            </div>

            {catalog && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs mb-3">{catalog.tag}</span><h2 className="text-3xl font-bold text-slate-800">{catalog.title}</h2></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{cards.map((card, idx) => <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:shadow-md transition"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3"><Grid size={20} className="text-white" /></div><h3 className="font-semibold text-slate-800 mb-2">{card.title}</h3><p className="text-slate-600 text-sm">{card.description}</p></div>)}</div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-sm font-semibold mb-2">Section Tag</label><input type="text" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <div><label className="block text-sm font-semibold mb-2">Section Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-600 text-white rounded-xl">{submitting ? <Loader2 className="animate-spin inline" /> : <Save className="inline mr-2" />}Update Section</button>
                </form>

                <div className="border-t pt-6"><h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18} />Manage Service Cards</h3>
                  <div className="space-y-3 mb-6"><input type="text" placeholder="Card Title" value={cardForm.title} onChange={(e) => setCardForm({...cardForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /><textarea rows={3} placeholder="Card Description" value={cardForm.description} onChange={(e) => setCardForm({...cardForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /><input type="text" placeholder="Icon (optional)" value={cardForm.icon} onChange={(e) => setCardForm({...cardForm, icon: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /><button onClick={editingCardIndex !== null ? updateCard : addCard} className="px-4 py-2 bg-blue-600 text-white rounded-xl">{editingCardIndex !== null ? <Save size={16} className="inline mr-2" /> : <Plus size={16} className="inline mr-2" />}{editingCardIndex !== null ? 'Update Card' : 'Add Card'}</button></div>
                  <div className="space-y-2">{cards.map((card, idx) => <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><div><h4 className="font-medium">{card.title}</h4><p className="text-sm text-slate-500">{card.description.substring(0, 100)}</p></div><div className="flex gap-2"><button onClick={() => { setEditingCardIndex(idx); setCardForm({ title: card.title, description: card.description, icon: card.icon }); }} className="text-amber-600"><Edit size={16} /></button><button onClick={() => deleteCard(idx)} className="text-red-500"><Trash2 size={16} /></button></div></div>)}</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceCatalog;