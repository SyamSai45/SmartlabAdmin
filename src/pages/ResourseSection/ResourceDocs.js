// src/components/admin/ResourceDocs.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Upload, Loader2, CheckCircle, AlertCircle, Save, File, Download } from 'lucide-react';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

export default function ResourceDocs() {
  const [sectionData, setSectionData] = useState({ title: 'Downloads', tag: 'Resources', description: '', isActive: true });
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', file: null });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/pdfs', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSectionData({ title: data.data.title || 'Downloads', tag: data.data.tag || 'Resources', description: data.data.description || '', isActive: data.data.isActive !== false });
          setPdfs(data.data.pdfs || []);
        }
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const updateSection = async () => {
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/pdfs', {
        method: 'PUT',
        headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: sectionData.title, tag: sectionData.tag, description: sectionData.description, pdfs: pdfs, isActive: sectionData.isActive })
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: 'PDF section updated!' }); setTimeout(() => setMessage({ type: '', text: '' }), 3000); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to update' }); } finally { setSubmitting(false); }
  };

  const addPdf = async () => {
    if (!formData.name || !formData.file) { setMessage({ type: 'error', text: 'Please fill all fields' }); return; }
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('file', formData.file);
      const response = await fetch('http://31.97.228.17:5101/api/resources/pdfs/add', {
        method: 'POST',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        body: formDataToSend
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: 'PDF added!' }); fetchData(); setModalOpen(false); setFormData({ name: '', file: null }); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to add PDF' }); } finally { setSubmitting(false); }
  };

  const deletePdf = async (index) => {
    if (!window.confirm('Delete this PDF?')) return;
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://31.97.228.17:5101/api/resources/pdfs/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) { setMessage({ type: 'success', text: 'PDF deleted!' }); fetchData(); }
    } catch (err) { setMessage({ type: 'error', text: 'Failed to delete' }); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-blue-600" /></div>;

  return (
    <>
      <FontLink />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2"><div className="w-8 h-px bg-blue-600" /><span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">Resource Page</span></div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Documents & Downloads</h1>
          <p className="text-slate-500 mt-1">Manage brochures, datasheets, and other downloadable resources</p>
        </div>

        {message.text && <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}<span>{message.text}</span></div>}

        <div className="bg-white/80 rounded-2xl p-6 border shadow-lg mb-6">
          <h2 className="text-lg font-bold mb-4">Section Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" value={sectionData.title} onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })} placeholder="Section Title" className="px-4 py-2 rounded-xl border" />
            <input type="text" value={sectionData.tag} onChange={(e) => setSectionData({ ...sectionData, tag: e.target.value })} placeholder="Section Tag" className="px-4 py-2 rounded-xl border" />
            <textarea value={sectionData.description} onChange={(e) => setSectionData({ ...sectionData, description: e.target.value })} placeholder="Section Description" rows={2} className="md:col-span-2 px-4 py-2 rounded-xl border" />
          </div>
          <div className="flex justify-end mt-4"><button onClick={updateSection} disabled={submitting} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold flex items-center gap-2">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Settings</button></div>
        </div>

        <div className="bg-white/80 rounded-2xl p-6 border shadow-lg">
          <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Documents ({pdfs.length})</h2><button onClick={() => setModalOpen(true)} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2"><Plus size={16} /> Add Document</button></div>
          <div className="space-y-2">
            {pdfs.map((pdf, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3"><File size={20} className="text-blue-600" /><div><p className="font-medium">{pdf.name}</p><p className="text-xs text-slate-400">{pdf.size || 'PDF Document'}</p></div></div>
                <div className="flex gap-2"><a href={pdf.file} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><Download size={16} /></a><button onClick={() => deletePdf(idx)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div>
              </div>
            ))}
            {pdfs.length === 0 && <p className="text-center text-slate-400 py-8">No documents yet.</p>}
          </div>
        </div>

        <AnimatePresence>{modalOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}><div className="p-4 border-b flex justify-between"><h3 className="text-xl font-bold">Add Document</h3><button onClick={() => setModalOpen(false)}><X size={20} /></button></div><div className="p-6 space-y-4"><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Document Name" className="w-full px-4 py-2 rounded-xl border" /><div className="border-2 border-dashed border-blue-200 rounded-xl p-3 text-center"><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} className="hidden" id="pdf-file" /><label htmlFor="pdf-file" className="cursor-pointer block"><Upload size={24} className="mx-auto text-blue-400 mb-1" /><p className="text-xs">Upload PDF/Document</p></label></div><button onClick={addPdf} disabled={submitting} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold">{submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Add Document'}</button></div></motion.div></motion.div>}</AnimatePresence>
      </div>
    </>
  );
}