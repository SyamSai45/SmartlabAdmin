import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, X, Save } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com/api';

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const CTAForm = ({ cta, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    tag: '',
    title: '',
    description: '',
    buttonText: 'Learn More'
  });

  useEffect(() => {
    if (cta) {
      setFormData({
        tag: cta.tag || '',
        title: cta.title || '',
        description: cta.description || '',
        buttonText: cta.buttonText || 'Learn More'
      });
    }
  }, [cta]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Title and description are required');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Optional)</label>
        <input
          type="text"
          value={formData.tag}
          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Ready to get started?"
        />
      </div>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          required
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
          {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {cta ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export function ApplicationCTA() {
  const [ctaList, setCtaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCTA, setEditingCTA] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCTA = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/applicationpage/cta');
      setCtaList(data.data || []);
    } catch (error) {
      console.error('Fetch CTA error:', error);
      alert('Failed to fetch CTA sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCTA();
  }, []);

  const handleSave = async (formData) => {
    try {
      setSubmitting(true);
      if (editingCTA) {
        await apiClient.put(`/applicationpage/cta/${editingCTA._id}`, formData);
        alert('CTA updated successfully');
      } else {
        await apiClient.post('/applicationpage/cta', formData);
        alert('CTA created successfully');
      }
      setShowForm(false);
      setEditingCTA(null);
      fetchCTA();
    } catch (error) {
      console.error('Save CTA error:', error);
      alert(error?.response?.data?.message || 'Failed to save CTA');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this CTA section?')) return;
    try {
      await apiClient.delete(`/applicationpage/cta/${id}`);
      alert('CTA deleted successfully');
      fetchCTA();
    } catch (error) {
      console.error('Delete CTA error:', error);
      alert('Failed to delete CTA');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">CTA Sections</h2>
          <p className="text-sm text-gray-500 mt-1">Manage Call-to-Action sections for your application page</p>
        </div>
        <button
          onClick={() => {
            setEditingCTA(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add CTA
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{editingCTA ? 'Edit CTA' : 'Create New CTA'}</h3>
          <CTAForm
            cta={editingCTA}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingCTA(null);
            }}
            isLoading={submitting}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size={36} className="animate-spin text-blue-500" />
        </div>
      ) : ctaList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No CTA sections found. Create your first CTA section!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {ctaList.map((cta) => (
            <div key={cta._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {cta.tag && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded mb-2">
                      {cta.tag}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{cta.title}</h3>
                  <p className="text-gray-600 mb-3">{cta.description}</p>
                  {cta.buttonText && (
                    <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg">
                      {cta.buttonText}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCTA(cta);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cta._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}