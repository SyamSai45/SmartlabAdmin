// src/components/admin/BlogForm.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, X, Sparkles, Loader2, CheckCircle, AlertCircle,
  Upload, Trash2, Plus, User, Mail, Calendar, Clock,
  Tag, BookOpen, Quote, FileText, Image as ImageIcon
} from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
        type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
      } text-white min-w-[300px]`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose}><X size={16} /></button>
    </motion.div>
  );
};

export function BlogForm({ blog, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
    shortDescription: '',
    longDescription: '',
    quote: '',
    tags: [],
    isFeatured: false,
    bgImage: null,
    mainImage: null,
    author: { name: '', role: '', image: null }
  });
  
  const [previews, setPreviews] = useState({
    bgImage: '',
    mainImage: '',
    authorImage: ''
  });
  const [imageFiles, setImageFiles] = useState({
    bgImage: null,
    mainImage: null,
    authorImage: null
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (blog) {
      setFormData({
        title: blog.title || '',
        category: blog.category || '',
        duration: blog.duration || '',
        date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        shortDescription: blog.shortDescription || '',
        longDescription: blog.longDescription || '',
        quote: blog.quote || '',
        tags: blog.tags || [],
        isFeatured: blog.isFeatured || false,
        bgImage: null,
        mainImage: null,
        author: {
          name: blog.author?.name || '',
          role: blog.author?.role || '',
          image: null
        }
      });
      setPreviews({
        bgImage: blog.bgImage || '',
        mainImage: blog.mainImage || '',
        authorImage: blog.author?.image || ''
      });
    }
  }, [blog]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/blogs/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/blogs/tags', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setTags(data.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleImageChange = (field, file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      setImageFiles(prev => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [field]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { showToast('Title is required', 'error'); return; }
    if (!formData.category) { showToast('Category is required', 'error'); return; }
    if (!formData.shortDescription.trim()) { showToast('Short description is required', 'error'); return; }
    if (!formData.longDescription.trim()) { showToast('Long description is required', 'error'); return; }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('category', formData.category);
      fd.append('duration', formData.duration);
      fd.append('date', formData.date);
      fd.append('shortDescription', formData.shortDescription);
      fd.append('longDescription', formData.longDescription);
      fd.append('quote', formData.quote);
      fd.append('tags', JSON.stringify(formData.tags));
      fd.append('isFeatured', formData.isFeatured);
      fd.append('author', JSON.stringify(formData.author));
      
      if (imageFiles.bgImage) fd.append('bgImage', imageFiles.bgImage);
      if (imageFiles.mainImage) fd.append('mainImage', imageFiles.mainImage);
      if (imageFiles.authorImage) fd.append('authorImage', imageFiles.authorImage);
      
      const url = blog ? `https://smartlabtechbackend-p5h6.onrender.com/api/blogs/${blog._id}` : 'https://smartlabtechbackend-p5h6.onrender.com/api/blogs';
      const method = blog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(blog ? 'Blog updated successfully!' : 'Blog created successfully!', 'success');
        setTimeout(() => onSuccess(), 1500);
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      showToast('Failed to save blog', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Blogs Management</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">{blog ? 'Edit' : 'Create'} <span className="text-emerald-200">Blog</span></h2>
          <p className="text-white/70 text-sm">{blog ? 'Update your blog post' : 'Write a new blog post'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><FileText size={18} />Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-2">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input w-full" required /></div>
            <div><label className="block text-sm font-semibold mb-2">Category *</label><input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} list="categories" className="input w-full" placeholder="e.g., Technology, Science" required /><datalist id="categories">{categories.map(c => <option key={c} value={c} />)}</datalist></div>
            <div><label className="block text-sm font-semibold mb-2">Read Duration</label><input type="text" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="input w-full" placeholder="e.g., 5 min read" /></div>
            <div><label className="block text-sm font-semibold mb-2">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="input w-full" /></div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><ImageIcon size={18} />Images</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold mb-2">Background Image *</label><div className="border-2 border-dashed rounded-xl p-4 text-center"><Upload className="mx-auto h-8 w-8 text-slate-400" /><label className="cursor-pointer text-blue-600 text-sm">Choose File<input type="file" hidden accept="image/*" onChange={(e) => handleImageChange('bgImage', e.target.files[0])} /></label></div>{previews.bgImage && <img src={previews.bgImage} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" />}</div>
            <div><label className="block text-sm font-semibold mb-2">Main Image *</label><div className="border-2 border-dashed rounded-xl p-4 text-center"><Upload className="mx-auto h-8 w-8 text-slate-400" /><label className="cursor-pointer text-blue-600 text-sm">Choose File<input type="file" hidden accept="image/*" onChange={(e) => handleImageChange('mainImage', e.target.files[0])} /></label></div>{previews.mainImage && <img src={previews.mainImage} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" />}</div>
          </div>
        </div>

        {/* Author Information */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><User size={18} />Author Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-2">Author Name</label><input type="text" value={formData.author.name} onChange={(e) => setFormData({...formData, author: {...formData.author, name: e.target.value}})} className="input w-full" /></div>
            <div><label className="block text-sm font-semibold mb-2">Author Role</label><input type="text" value={formData.author.role} onChange={(e) => setFormData({...formData, author: {...formData.author, role: e.target.value}})} className="input w-full" placeholder="e.g., Senior Technical Writer" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold mb-2">Author Image</label><div className="border-2 border-dashed rounded-xl p-4 text-center"><Upload className="mx-auto h-8 w-8 text-slate-400" /><label className="cursor-pointer text-blue-600 text-sm">Choose File<input type="file" hidden accept="image/*" onChange={(e) => handleImageChange('authorImage', e.target.files[0])} /></label></div>{previews.authorImage && <img src={previews.authorImage} alt="Author" className="mt-2 h-24 w-24 object-cover rounded-full mx-auto" />}</div>
          </div>
        </div>

        {/* Content */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><BookOpen size={18} />Content</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-semibold mb-2">Short Description *</label><textarea rows={3} value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} className="textarea w-full" maxLength="300" /></div>
            <div><label className="block text-sm font-semibold mb-2">Long Description *</label><textarea rows={10} value={formData.longDescription} onChange={(e) => setFormData({...formData, longDescription: e.target.value})} className="textarea w-full" /></div>
            <div><label className="block text-sm font-semibold mb-2">Quote</label><textarea rows={3} value={formData.quote} onChange={(e) => setFormData({...formData, quote: e.target.value})} className="textarea w-full" placeholder="An inspiring quote..." /></div>
          </div>
        </div>

        {/* Tags */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Tag size={18} />Tags</h3>
          <div className="flex gap-2 mb-3"><input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add a tag" className="input flex-1" /><button type="button" onClick={addTag} className="btn btn-secondary"><Plus size={14} />Add</button></div>
          <div className="flex flex-wrap gap-2">{formData.tags.map(tag => <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm flex items-center gap-1">{tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button></span>)}</div>
        </div>

        {/* Featured & Actions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6"><span className="text-sm font-semibold">Feature this blog</span><button type="button" onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isFeatured ? 'bg-purple-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${formData.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
          <div className="flex gap-3"><button type="button" onClick={onCancel} className="flex-1 btn btn-secondary">Cancel</button><button type="submit" disabled={loading} className="flex-1 btn btn-primary">{loading ? <Loader2 className="animate-spin" /> : <Save size={16} />}{blog ? 'Update' : 'Create'} Blog</button></div>
        </div>
      </form>
    </div>
  );
}