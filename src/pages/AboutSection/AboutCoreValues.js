// src/components/admin/AboutCoreValues.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Sparkles, Loader2, CheckCircle, AlertCircle, Heart } from 'lucide-react';

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

function AboutCoreValues() {
  const [section, setSection] = useState({ title: '', tag: '' });
  const [values, setValues] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', icon: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/core-values', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSection({ title: data.data.title || '', tag: data.data.tag || '' });
        setValues(data.data.values || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type) => setToast({ message, type });

  const saveSection = async () => {
    if (!section.title || !section.tag) {
      showToast('Please fill both title and tag', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/core-values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: section.title, tag: section.tag })
      });
      showToast('Section saved', 'success');
    } catch (error) {
      showToast('Failed to save', 'error');
    }
  };

  const addValue = async () => {
    if (!form.title || !form.description) {
      showToast('Please fill title and description', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/core-values/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      setForm({ title: '', description: '', icon: '' });
      fetchData();
      showToast('Value added', 'success');
    } catch (error) {
      showToast('Failed to add', 'error');
    }
  };

  const deleteValue = async (index) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/core-values/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
      showToast('Value deleted', 'success');
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">About Page Management</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Core <span className="text-rose-200">Values</span></h2>
          <p className="text-white/70 text-sm">Manage company core values section</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        {/* Section Settings */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Section Settings</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input type="text" value={section.tag} onChange={(e) => setSection({...section, tag: e.target.value})} placeholder="Tag (e.g., Our Values)" className="px-4 py-2 border border-slate-300 rounded-xl" />
            <input type="text" value={section.title} onChange={(e) => setSection({...section, title: e.target.value})} placeholder="Title" className="px-4 py-2 border border-slate-300 rounded-xl" />
          </div>
          <button onClick={saveSection} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"><Save size={16} />Save Section</button>
        </div>

        {/* Add New Value */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Add Core Value</h3>
          <div className="space-y-4">
            <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Value Title" className="w-full px-4 py-2 border border-slate-300 rounded-xl" />
            <textarea rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" className="w-full px-4 py-2 border border-slate-300 rounded-xl" />
            <input type="text" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} placeholder="Icon name (optional)" className="w-full px-4 py-2 border border-slate-300 rounded-xl" />
            <button onClick={addValue} className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-2"><Plus size={16} />Add Value</button>
          </div>
        </div>

        {/* Values List */}
        {loading ? (
          <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((value, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-3">
                  <Heart size={24} className="text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{value.description}</p>
                <button onClick={() => deleteValue(idx)} className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-1"><Trash2 size={14} />Delete</button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AboutCoreValues;