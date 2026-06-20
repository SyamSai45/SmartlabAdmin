// src/components/admin/ResourceArticles.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, X, Upload, Loader2, CheckCircle, AlertCircle,
  Eye, EyeOff, Save, FileText, Calendar, Link as LinkIcon
} from 'lucide-react';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

export default function ResourceArticles() {
  const [sectionData, setSectionData] = useState({
    title: 'Latest Articles',
    tag: 'Insights & Updates',
    description: '',
    isActive: true
  });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '', tag: '', description: '', image: '', duration: '5 min read', link: '', isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/articles', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSectionData({
            title: data.data.title || 'Latest Articles',
            tag: data.data.tag || 'Insights & Updates',
            description: data.data.description || '',
            isActive: data.data.isActive !== false
          });
          setArticles(data.data.articles || []);
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async () => {
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/resources/articles', {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: sectionData.title,
          tag: sectionData.tag,
          description: sectionData.description,
          articles: articles,
          isActive: sectionData.isActive
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Articles section updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update section' });
    } finally {
      setSubmitting(false);
    }
  };

  const saveArticle = async () => {
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('tag', formData.tag);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('link', formData.link);
      formDataToSend.append('isActive', formData.isActive);
      if (selectedFile) formDataToSend.append('image', selectedFile);

      const url = editingIndex !== null 
        ? `http://31.97.228.17:5101/api/resources/articles/${editingIndex}`
        : 'http://31.97.228.17:5101/api/resources/articles/add';
      const method = editingIndex !== null ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        body: formDataToSend
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: editingIndex !== null ? 'Article updated!' : 'Article added!' });
        fetchData();
        closeModal();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save article' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteArticle = async (index) => {
    if (!window.confirm('Delete this article?')) return;
    
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://31.97.228.17:5101/api/resources/articles/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Article deleted!' });
        fetchData();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete article' });
    }
  };

  const openModal = (article = null, index = null) => {
    if (article) {
      setFormData({
        title: article.title || '',
        tag: article.tag || '',
        description: article.description || '',
        image: article.image || '',
        duration: article.duration || '5 min read',
        link: article.link || '',
        isActive: article.isActive !== false
      });
      setEditingIndex(index);
      if (article.image && !article.image.includes('placeholder')) setPreviewUrl(article.image);
    } else {
      setFormData({ title: '', tag: '', description: '', image: '', duration: '5 min read', link: '', isActive: true });
      setEditingIndex(null);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-blue-600" /></div>;
  }

  return (
    <>
      <FontLink />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-blue-600" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">Resource Page</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Articles Management</h1>
          <p className="text-slate-500 mt-1">Manage blog posts, insights, and educational content</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Section Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Section Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" value={sectionData.title} onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })} placeholder="Section Title" className="px-4 py-2 rounded-xl border border-slate-200" />
            <input type="text" value={sectionData.tag} onChange={(e) => setSectionData({ ...sectionData, tag: e.target.value })} placeholder="Section Tag" className="px-4 py-2 rounded-xl border border-slate-200" />
            <textarea value={sectionData.description} onChange={(e) => setSectionData({ ...sectionData, description: e.target.value })} placeholder="Section Description" rows={2} className="md:col-span-2 px-4 py-2 rounded-xl border border-slate-200" />
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={updateSection} disabled={submitting} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold flex items-center gap-2">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Settings
            </button>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Articles ({articles.length})</h2>
            <button onClick={() => openModal()} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700">
              <Plus size={16} /> Add Article
            </button>
          </div>

          <div className="space-y-3">
            {articles.map((article, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4 flex-1">
                  {article.image && <img src={article.image} alt={article.title} className="w-12 h-12 object-cover rounded-lg" />}
                  <div>
                    <p className="font-semibold text-slate-800">{article.title}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <Calendar size={10} /> {article.duration}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(article, idx)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><Edit size={16} /></button>
                  <button onClick={() => deleteArticle(idx)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {articles.length === 0 && <p className="text-center text-slate-400 py-8">No articles yet. Click "Add Article" to get started.</p>}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                  <h3 className="text-xl font-bold">{editingIndex !== null ? 'Edit Article' : 'Add Article'}</h3>
                  <button onClick={closeModal} className="p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Article Title" className="w-full px-4 py-2 rounded-xl border border-slate-200" />
                  <input type="text" value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} placeholder="Tag/Category" className="w-full px-4 py-2 rounded-xl border border-slate-200" />
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="Duration (e.g., 5 min read)" className="w-full px-4 py-2 rounded-xl border border-slate-200" />
                  <input type="url" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="External Link (optional)" className="w-full px-4 py-2 rounded-xl border border-slate-200" />
                  
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-3 text-center">
                    <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); const reader = new FileReader(); reader.onloadend = () => setPreviewUrl(reader.result); reader.readAsDataURL(file); } }} className="hidden" id="article-image" />
                    <label htmlFor="article-image" className="cursor-pointer block"><Upload size={24} className="mx-auto text-blue-400 mb-1" /><p className="text-xs text-slate-500">Upload Image</p></label>
                  </div>
                  {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}

                  <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active</label>

                  <button onClick={saveArticle} disabled={submitting} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold flex items-center justify-center gap-2">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {submitting ? 'Saving...' : 'Save Article'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}