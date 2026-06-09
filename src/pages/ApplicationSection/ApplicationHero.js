// src/pages/admin/application/ApplicationHero.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Loader, X, Image as ImageIcon,
  AlertCircle, Eye, EyeOff, Save
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com/api';

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const HeroForm = ({ hero, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    metaTag: '',
    description: '',
    buttonText: 'Get Started',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        tag: hero.tag || '',
        metaTag: hero.metaTag || '',
        description: hero.description || '',
        buttonText: hero.buttonText || 'Get Started',
        imageUrl: hero.imageUrl || ''
      });
      setPreview(hero.imageUrl || '');
    }
  }, [hero]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setFormData({ ...formData, imageUrl: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('buttonText', formData.buttonText);
    if (formData.tag) submitData.append('tag', formData.tag);
    if (formData.metaTag) submitData.append('metaTag', formData.metaTag);
    
    if (imageFile) {
      submitData.append('heroImage', imageFile);
    } else if (formData.imageUrl && !hero) {
      submitData.append('imageUrl', formData.imageUrl);
    }
    
    onSave(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
          <input
            type="text"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Optional)</label>
        <input
          type="text"
          value={formData.tag}
          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Featured"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Tag (Optional)</label>
        <input
          type="text"
          value={formData.metaTag}
          onChange={(e) => setFormData({ ...formData, metaTag: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., SEO keywords"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          required
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
          <div className="space-y-1 text-center">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="mx-auto h-32 w-auto object-contain rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview('');
                    setImageFile(null);
                    setFormData({ ...formData, imageUrl: '' });
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {hero ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export function ApplicationHero() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/applicationpage/hero');
      setHeroes(data.data || []);
    } catch (error) {
      console.error('Fetch heroes error:', error);
      alert('Failed to fetch heroes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleSave = async (formData) => {
    try {
      setSubmitting(true);
      if (editingHero) {
        await apiClient.put(`/applicationpage/hero/${editingHero._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Hero updated successfully');
      } else {
        await apiClient.post('/applicationpage/hero', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Hero created successfully');
      }
      setShowForm(false);
      setEditingHero(null);
      fetchHeroes();
    } catch (error) {
      console.error('Save hero error:', error);
      alert(error?.response?.data?.message || 'Failed to save hero');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero?')) return;
    try {
      await apiClient.delete(`/applicationpage/hero/${id}`);
      alert('Hero deleted successfully');
      fetchHeroes();
    } catch (error) {
      console.error('Delete hero error:', error);
      alert('Failed to delete hero');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hero Sections</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hero banners for your application page</p>
        </div>
        <button
          onClick={() => {
            setEditingHero(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Hero
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{editingHero ? 'Edit Hero' : 'Create New Hero'}</h3>
          <HeroForm
            hero={editingHero}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingHero(null);
            }}
            isLoading={submitting}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size={36} className="animate-spin text-blue-500" />
        </div>
      ) : heroes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No heroes found. Create your first hero section!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {heroes.map((hero) => (
            <div key={hero._id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="md:flex">
                {hero.imageUrl && (
                  <div className="md:w-64 h-48 md:h-auto">
                    <img src={hero.imageUrl} alt={hero.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{hero.title}</h3>
                      {hero.tag && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded mt-2">
                          {hero.tag}
                        </span>
                      )}
                      <p className="text-gray-600 mt-2">{hero.description}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-500">
                        {hero.buttonText && <span>Button: {hero.buttonText}</span>}
                        {hero.metaTag && <span>Meta: {hero.metaTag}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingHero(hero);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(hero._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}