// src/components/admin/BlogList.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, Mail, Phone, Building2,
  Eye, Trash2, User, Clock, Sparkles, AlertCircle, Check, X,
  Calendar, Tag, Loader2, RefreshCw, Edit, Plus, FileText,
  BookOpen, Award, EyeOff, CheckCircle, XCircle, Archive,
  Heart, Share2, Link2, Quote
} from 'lucide-react';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';

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
        type === 'success' ? 'bg-emerald-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      } text-white min-w-[300px]`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70"><X size={16} /></button>
    </motion.div>
  );
};

const fmtDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Badge = ({ status }) => {
  if (status === 'featured') {
    return <span className="badge badge-purple"><Award size={12} className="inline mr-1" />Featured</span>;
  }
  return <span className="badge badge-green"><CheckCircle size={12} className="inline mr-1" />Active</span>;
};

// Blog View Modal Component with fixed scrolling
const BlogViewModal = ({ blog, onClose }) => {
  const [copied, setCopied] = useState(false);
  const modalContentRef = useRef(null);
  
  // Prevent body scroll when modal is open - moved to top level
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  if (!blog) return null;

  const shareUrl = window.location.href;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(blog.title);
    let shareLink = '';
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Fixed at top */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all"
        >
          <X size={18} className="text-slate-700" />
        </button>

        {/* Scrollable Content */}
        <div 
          ref={modalContentRef}
          className="overflow-y-auto flex-1"
          style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: '#cbd5e1 #f1f5f9',
            maxHeight: 'calc(90vh - 0px)'
          }}
        >
          {/* Hero Image */}
          <div className="relative h-64 md:h-96">
            <img
              src={blog.bgImage || blog.mainImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Category and Featured Badge */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-full font-medium">
                {blog.category}
              </span>
              {blog.isFeatured && (
                <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full font-medium flex items-center gap-1">
                  <Award size={12} /> Featured
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {blog.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center overflow-hidden">
                  {blog.author?.image ? (
                    <img src={blog.author.image} alt={blog.author.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{blog.author?.name || 'Anonymous'}</p>
                  <p className="text-sm text-slate-500">{blog.author?.role || 'Contributor'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={14} />{fmtDate(blog.date)}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{blog.duration || '5 min read'}</span>
              </div>
            </div>

            {/* Short Description */}
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-l-4 border-emerald-500">
              <p className="text-slate-700 italic">{blog.shortDescription}</p>
            </div>

            {/* Long Description */}
            <div className="prose prose-slate max-w-none mb-8">
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {blog.longDescription}
              </div>
            </div>

            {/* Quote Section */}
            {blog.quote && (
              <div className="my-8 p-6 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                <div className="flex gap-3">
                  <Quote size={24} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-lg italic text-slate-700">"{blog.quote}"</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Share this article</h4>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaFacebook size={18} />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaTwitter size={18} />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaLinkedin size={18} />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center hover:scale-110 transition-transform relative"
                >
                  <Link2 size={18} />
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function BlogList({ onEdit }) {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [toast, setToast] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchTags();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = 'https://smartlabtechbackend-p5h6.onrender.com/api/blogs/all';
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory) params.append('category', filterCategory);
      if (filterTag) params.append('tag', filterTag);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showToast('Failed to load blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

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

  const deleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchBlogs();
        showToast('Blog deleted successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to delete blog', 'error');
    }
  };

  const viewBlog = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartlabtechbackend-p5h6.onrender.com/api/blogs/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setViewingBlog(data.data);
      }
    } catch (error) {
      showToast('Failed to load blog details', 'error');
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filterCategory, filterTag]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        {viewingBlog && <BlogViewModal blog={viewingBlog} onClose={() => setViewingBlog(null)} />}
      </AnimatePresence>

      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Blogs Management</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">All <span className="text-emerald-200">Blogs</span></h2>
          <p className="text-white/70 text-sm">Manage your blog posts</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select w-40"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="select w-40"
            >
              <option value="">All Tags</option>
              {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <button onClick={() => { setSearchTerm(''); setFilterCategory(''); setFilterTag(''); fetchBlogs(); }} className="btn btn-secondary">
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-16">
            <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <BookOpen size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-600">No blogs found</p>
            <button onClick={() => onEdit(null)} className="btn btn-primary mt-4"><Plus size={14} /> Create New Blog</button>
          </div>
        ) : (
          blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={blog.mainImage} alt={blog.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                {blog.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-lg flex items-center gap-1"><Award size={10} /> Featured</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{blog.category}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={10} />{fmtDate(blog.date)}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{blog.shortDescription}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-700">{blog.author?.name || 'Anonymous'}</p>
                    <p className="text-xs text-slate-400">{blog.duration || '5 min read'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => viewBlog(blog._id)} 
                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-1 flex-1"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button 
                    onClick={() => onEdit(blog)} 
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => deleteBlog(blog._id)} 
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}