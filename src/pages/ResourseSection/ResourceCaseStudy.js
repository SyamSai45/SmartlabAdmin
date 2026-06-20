// src/components/admin/ResourceCaseStudy.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Upload, Loader2, CheckCircle, AlertCircle, Save, Eye } from 'lucide-react';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

export default function ResourceCaseStudy() {
  const [sectionData, setSectionData] = useState({ title: 'Case Studies', tag: 'Success Stories', description: '', isActive: true });
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ title: '', tag: '', description: '', image: '', link: '', isActive: true });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/case-studies', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSectionData({ title: data.data.title || 'Case Studies', tag: data.data.tag || 'Success Stories', description: data.data.description || '', isActive: data.data.isActive !== false });
          setCaseStudies(data.data.caseStudies || []);
        }
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const updateSection = async () => {
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/case-studies', {
        method: 'PUT',
        headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: sectionData.title, tag: sectionData.tag, description: sectionData.description, caseStudies: caseStudies, isActive: sectionData.isActive })
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: 'Case studies section updated!' }); setTimeout(() => setMessage({ type: '', text: '' }), 3000); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to update' }); } finally { setSubmitting(false); }
  };

  const saveCaseStudy = async () => {
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('tag', formData.tag);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('link', formData.link);
      formDataToSend.append('isActive', formData.isActive);
      if (selectedFile) formDataToSend.append('image', selectedFile);

      const url = editingIndex !== null ? `http://31.97.228.17:5101/api/resources/case-studies/${editingIndex}` : 'http://31.97.228.17:5101/api/resources/case-studies/add';
      const method = editingIndex !== null ? 'PUT' : 'POST';

      const response = await fetch(url, { method: method, headers: { 'Authorization': token ? `Bearer ${token}` : '' }, body: formDataToSend });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: editingIndex !== null ? 'Case study updated!' : 'Case study added!' }); fetchData(); closeModal(); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to save' }); } finally { setSubmitting(false); }
  };

  const deleteCaseStudy = async (index) => {
    if (!window.confirm('Delete this case study?')) return;
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://31.97.228.17:5101/api/resources/case-studies/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: 'Case study deleted!' }); fetchData(); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to delete' }); }
  };

  const openModal = (item = null, index = null) => {
    if (item) {
      setFormData({ title: item.title || '', tag: item.tag || '', description: item.description || '', image: item.image || '', link: item.link || '', isActive: item.isActive !== false });
      setEditingIndex(index);
      if (item.image) setPreviewUrl(item.image);
    } else {
      setFormData({ title: '', tag: '', description: '', image: '', link: '', isActive: true });
      setEditingIndex(null);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setSelectedFile(null); setPreviewUrl(null); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-blue-600" /></div>;

  return (
    <>
      <FontLink />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-px bg-blue-600" /><span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">Resource Page</span></div><h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Case Studies</h1><p className="text-slate-500 mt-1">Manage success stories and client case studies</p></div>

        {message.text && <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}<span>{message.text}</span></div>}

        <div className="bg-white/80 rounded-2xl p-6 border shadow-lg mb-6"><h2 className="text-lg font-bold mb-4">Section Settings</h2><div className="grid md:grid-cols-2 gap-4"><input type="text" value={sectionData.title} onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })} placeholder="Section Title" className="px-4 py-2 rounded-xl border" /><input type="text" value={sectionData.tag} onChange={(e) => setSectionData({ ...sectionData, tag: e.target.value })} placeholder="Section Tag" className="px-4 py-2 rounded-xl border" /><textarea value={sectionData.description} onChange={(e) => setSectionData({ ...sectionData, description: e.target.value })} placeholder="Section Description" rows={2} className="md:col-span-2 px-4 py-2 rounded-xl border" /></div><div className="flex justify-end mt-4"><button onClick={updateSection} disabled={submitting} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold flex items-center gap-2">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Settings</button></div></div>

        <div className="bg-white/80 rounded-2xl p-6 border shadow-lg"><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Case Studies ({caseStudies.length})</h2><button onClick={() => openModal()} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2"><Plus size={16} /> Add Case Study</button></div><div className="grid md:grid-cols-2 gap-4">{caseStudies.map((cs, idx) => (<div key={idx} className="bg-slate-50 rounded-xl p-4 border"><div className="flex gap-3"><img src={cs.image} alt={cs.title} className="w-20 h-20 object-cover rounded-lg" /><div className="flex-1"><p className="font-semibold">{cs.title}</p><p className="text-xs text-blue-600 mb-1">{cs.tag}</p><p className="text-xs text-slate-500 line-clamp-2">{cs.description}</p></div></div><div className="flex justify-end gap-2 mt-3"><button onClick={() => openModal(cs, idx)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"><Edit size={14} /></button><button onClick={() => deleteCaseStudy(idx)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={14} /></button></div></div>))}{caseStudies.length === 0 && <p className="text-center text-slate-400 py-8 col-span-2">No case studies yet.</p>}</div></div>

        <AnimatePresence>{modalOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeModal}><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="sticky top-0 bg-white border-b p-4 flex justify-between"><h3 className="text-xl font-bold">{editingIndex !== null ? 'Edit Case Study' : 'Add Case Study'}</h3><button onClick={closeModal}><X size={20} /></button></div><div className="p-6 space-y-4"><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Case Study Title" className="w-full px-4 py-2 rounded-xl border" /><input type="text" value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} placeholder="Category/Industry" className="w-full px-4 py-2 rounded-xl border" /><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-2 rounded-xl border" /><input type="url" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="Learn More Link (optional)" className="w-full px-4 py-2 rounded-xl border" /><div className="border-2 border-dashed border-blue-200 rounded-xl p-3 text-center"><input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); const reader = new FileReader(); reader.onloadend = () => setPreviewUrl(reader.result); reader.readAsDataURL(file); } }} className="hidden" id="cs-image" /><label htmlFor="cs-image" className="cursor-pointer block"><Upload size={24} className="mx-auto text-blue-400 mb-1" /><p className="text-xs">Upload Image</p></label></div>{previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}<label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active</label><button onClick={saveCaseStudy} disabled={submitting} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold flex items-center justify-center gap-2">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{submitting ? 'Saving...' : 'Save Case Study'}</button></div></motion.div></motion.div>}</AnimatePresence>
      </div>
    </>
  );
}