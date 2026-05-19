// src/components/admin/ResourceHero.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, X, Loader2, AlertCircle, CheckCircle, Save, Trash2, Eye, EyeOff } from 'lucide-react';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

export default function ResourceHero() {
  const [heroData, setHeroData] = useState({
    title: '',
    tag: '',
    description: '',
    image: '',
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/resources/hero', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setHeroData(data.data);
        }
      } else if (response.status !== 404) {
        console.error('Failed to fetch hero');
      }
    } catch (err) {
      console.error('Error fetching hero:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = sessionStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', heroData.title);
      formData.append('tag', heroData.tag);
      formData.append('description', heroData.description);
      formData.append('isActive', heroData.isActive);
      if (selectedFile) formData.append('image', selectedFile);

      const method = heroData.title ? 'PUT' : 'POST';
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/resources/hero', {
        method: method,
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Hero section saved successfully!');
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchHero();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to save hero');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the hero section?')) return;
    
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/resources/hero', {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess('Hero section deleted successfully!');
        setHeroData({ title: '', tag: '', description: '', image: '', isActive: true });
        setSelectedFile(null);
        setPreviewUrl(null);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to delete hero');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <FontLink />
        <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-blue-600" /></div>
      </>
    );
  }

  return (
    <>
      <FontLink />
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-blue-600" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">Resource Page</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Hero Section</h1>
          <p className="text-slate-500 mt-1">Manage the main banner at the top of the resources page</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tag/Badge</label>
              <input
                type="text"
                value={heroData.tag}
                onChange={(e) => setHeroData({ ...heroData, tag: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={heroData.description}
                onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image</label>
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="hero-image" />
                <label htmlFor="hero-image" className="cursor-pointer block">
                  <Upload size={32} className="mx-auto text-blue-400 mb-2" />
                  <p className="text-sm text-slate-500">Click to upload image</p>
                </label>
              </div>
              {(previewUrl || heroData.image) && (
                <div className="mt-3 relative">
                  <img src={previewUrl || heroData.image} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                  {previewUrl && (
                    <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium text-slate-700">Active</span>
                <button
                  type="button"
                  onClick={() => setHeroData({ ...heroData, isActive: !heroData.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${heroData.isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${heroData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={submitting} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold hover:shadow-lg disabled:opacity-50">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {submitting ? 'Saving...' : 'Save Hero'}
              </button>
              {heroData.title && (
                <button type="button" onClick={handleDelete} disabled={submitting} className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}