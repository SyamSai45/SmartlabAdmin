// src/components/admin/AboutChooseUs.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Plus, X, Sparkles, Save, Loader2, CheckCircle, AlertCircle, ZoomIn, EyeOff, Eye, Edit } from 'lucide-react';

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

function AboutChooseUs() {
  const [section, setSection] = useState(null);
  const [form, setForm] = useState({ title: '', tag: '', description: '', isActive: true });
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/why-choose-us', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setSection(data.data);
        setForm({
          title: data.data.title || '',
          tag: data.data.tag || '',
          description: data.data.description || '',
          isActive: data.data.isActive || false
        });
        setPoints(data.data.points || []);
        setImagePreview(data.data.image || '');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type) => setToast({ message, type });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('tag', form.tag);
      fd.append('description', form.description);
      fd.append('isActive', form.isActive);
      if (imageFile) fd.append('image', imageFile);

      const url = 'https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/why-choose-us';
      const method = section ? 'PUT' : 'POST';

      await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: fd });
      showToast(section ? 'Updated successfully' : 'Created successfully', 'success');
      fetchData();
      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      showToast('Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const addPoint = async () => {
    if (!newPoint.trim()) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/why-choose-us/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ point: newPoint })
      });
      setNewPoint('');
      fetchData();
      showToast('Point added', 'success');
    } catch (error) {
      showToast('Failed to add point', 'error');
    }
  };

  const deletePoint = async (index) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/why-choose-us/points/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
      showToast('Point deleted', 'success');
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  const deleteSection = async () => {
    if (!window.confirm('Delete this section?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/why-choose-us', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSection(null);
      setForm({ title: '', tag: '', description: '', isActive: true });
      setPoints([]);
      setImagePreview('');
      showToast('Section deleted', 'success');
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">About Page Management</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Why Choose <span className="text-amber-200">Us</span></h2>
          <p className="text-white/70 text-sm">Manage the why choose us section</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? (
          <div className="text-center py-12"><Loader2 size={40} className="mx-auto text-slate-400 animate-spin" /></div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                {section && !isEditing && <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl"><Edit size={16} className="inline mr-2" />Edit</button>}
                {section && <button onClick={deleteSection} className="px-4 py-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} className="inline mr-2" />Delete</button>}
              </div>
              {section && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${form.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{form.isActive ? 'Active' : 'Inactive'}</span>}
            </div>

            {section && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {imagePreview && <img src={imagePreview} alt="Section" className="rounded-xl w-full h-64 object-cover" />}
                  <div><span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs mb-3">{section.tag}</span><h3 className="text-2xl font-bold text-slate-800 mb-3">{section.title}</h3><p className="text-slate-600">{section.description}</p></div>
                </div>
                <div><h4 className="font-semibold text-slate-800 mb-3">Key Points</h4><div className="grid md:grid-cols-2 gap-3">{points.map((p, idx) => <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"><CheckCircle size={16} className="text-emerald-500" /><span>{p.point}</span></div>)}</div></div>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-sm font-semibold mb-2">Tag</label><input type="text" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div>
                <div><label className="block text-sm font-semibold mb-2">Title</label><input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div>
                <div><label className="block text-sm font-semibold mb-2">Description</label><textarea rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required /></div>
                <div><label className="block text-sm font-semibold mb-2">Image</label><div className="border-2 border-dashed rounded-xl p-6 text-center"><Upload className="mx-auto h-10 w-10 text-slate-400" /><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="img" /><label htmlFor="img" className="cursor-pointer text-blue-600">Choose file</label></div></div>
                {imagePreview && <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover rounded-xl" />}
                <div className="flex items-center gap-3"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} /><span>Active</span></div>
                <button type="submit" disabled={submitting} className="w-full py-3 bg-blue-600 text-white rounded-xl">{submitting ? <Loader2 className="animate-spin inline" /> : <Save className="inline mr-2" />}{section ? 'Update' : 'Create'}</button>
              </motion.form>
            )}

            {/* Points Management */}
            {(section && isEditing) || !section ? (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-slate-800 mb-4">Manage Points</h3>
                <div className="flex gap-3 mb-4"><input type="text" value={newPoint} onChange={(e) => setNewPoint(e.target.value)} placeholder="New point" className="flex-1 px-4 py-2 border rounded-xl" /><button onClick={addPoint} className="px-4 py-2 bg-emerald-600 text-white rounded-xl"><Plus size={16} /></button></div>
                <div className="space-y-2">{points.map((p, idx) => <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span>{p.point}</span><button onClick={() => deletePoint(idx)} className="text-red-500"><Trash2 size={16} /></button></div>)}</div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default AboutChooseUs;