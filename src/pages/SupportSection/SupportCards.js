// src/components/admin/SupportCards.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Sparkles, Loader2, CheckCircle, AlertCircle, Grid } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm">{message}</span>
    </div>
  );
};

function SupportCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', icon: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/cards', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 404) {
        setCards([]);
        return;
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setCards(data.data);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCards(); }, []);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      showToast('Please fill title and description', 'error');
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      if (editingIndex !== null) {
        await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/cards/${editingIndex}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        showToast('Card updated successfully', 'success');
      } else {
        await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        showToast('Card added successfully', 'success');
      }
      setForm({ title: '', description: '', icon: '' });
      setEditingIndex(null);
      fetchCards();
    } catch (error) {
      showToast('Operation failed', 'error');
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Delete this card?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/supportpage/cards/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showToast('Card deleted', 'success');
      fetchCards();
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  const handleEdit = (card, index) => {
    setForm({ title: card.title, description: card.description, icon: card.icon || '' });
    setEditingIndex(index);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Support Page Management</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Support <span className="text-cyan-200">Cards</span></h2>
          <p className="text-white/70 text-sm">Manage support feature cards</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Card Title" className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            <input type="text" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} placeholder="Icon (optional)" className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Card Description" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
            {editingIndex !== null ? <Save size={16} /> : <Plus size={16} />}
            {editingIndex !== null ? 'Update Card' : 'Add Card'}
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3"><Grid size={20} className="text-white" /></div>
                <h3 className="font-semibold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(card, idx)} className="flex-1 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center gap-1"><Edit size={14} />Edit</button>
                  <button onClick={() => handleDelete(idx)} className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-1"><Trash2 size={14} />Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SupportCards;