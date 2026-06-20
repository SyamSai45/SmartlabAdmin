// src/pages/admin/application/ApplicationServices.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Loader, X, Save, ChevronDown, ChevronUp
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://31.97.228.17:5101/api';

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ServicesForm = ({ services, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    tag: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    if (services) {
      setFormData({
        tag: services.tag || '',
        title: services.title || '',
        description: services.description || ''
      });
    }
  }, [services]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Title is required');
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
          placeholder="e.g., Our Services"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
        <textarea
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
          {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {services ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

const ServiceCardForm = ({ card, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        description: card.description || ''
      });
    }
  }, [card]);

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
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
          {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {card ? 'Update' : 'Add'} Card
        </button>
      </div>
    </form>
  );
};

export function ApplicationServices() {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingServices, setEditingServices] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedServices, setExpandedServices] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [selectedServicesId, setSelectedServicesId] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/applicationpage/services');
      setServicesList(data.data || []);
    } catch (error) {
      console.error('Fetch services error:', error);
      alert('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSaveServices = async (formData) => {
    try {
      setSubmitting(true);
      if (editingServices) {
        await apiClient.put(`/applicationpage/services/${editingServices._id}`, formData);
        alert('Services updated successfully');
      } else {
        await apiClient.post('/applicationpage/services', formData);
        alert('Services created successfully');
      }
      setShowForm(false);
      setEditingServices(null);
      fetchServices();
    } catch (error) {
      console.error('Save services error:', error);
      alert(error?.response?.data?.message || 'Failed to save services');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteServices = async (id) => {
    if (!window.confirm('Are you sure you want to delete this services section? All cards will be deleted.')) return;
    try {
      await apiClient.delete(`/applicationpage/services/${id}`);
      alert('Services deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Delete services error:', error);
      alert('Failed to delete services');
    }
  };

  const handleSaveCard = async (formData) => {
    try {
      setSubmitting(true);
      if (editingCard) {
        await apiClient.put(`/applicationpage/services/${selectedServicesId}/cards/${editingCard._id}`, formData);
        alert('Card updated successfully');
      } else {
        await apiClient.post(`/applicationpage/services/${selectedServicesId}/cards`, formData);
        alert('Card added successfully');
      }
      setShowCardForm(false);
      setEditingCard(null);
      setSelectedServicesId(null);
      fetchServices();
    } catch (error) {
      console.error('Save card error:', error);
      alert(error?.response?.data?.message || 'Failed to save card');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (servicesId, cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await apiClient.delete(`/applicationpage/services/${servicesId}/cards/${cardId}`);
      alert('Card deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Delete card error:', error);
      alert('Failed to delete card');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Services Sections</h2>
          <p className="text-sm text-gray-500 mt-1">Manage services sections and their cards</p>
        </div>
        <button
          onClick={() => {
            setEditingServices(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Services Section
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{editingServices ? 'Edit Services Section' : 'Create New Services Section'}</h3>
          <ServicesForm
            services={editingServices}
            onSave={handleSaveServices}
            onCancel={() => {
              setShowForm(false);
              setEditingServices(null);
            }}
            isLoading={submitting}
          />
        </div>
      )}

      {showCardForm && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{editingCard ? 'Edit Service Card' : 'Add New Service Card'}</h3>
          <ServiceCardForm
            card={editingCard}
            onSave={handleSaveCard}
            onCancel={() => {
              setShowCardForm(false);
              setEditingCard(null);
              setSelectedServicesId(null);
            }}
            isLoading={submitting}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size={36} className="animate-spin text-blue-500" />
        </div>
      ) : servicesList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No services sections found. Create your first services section!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {servicesList.map((services) => (
            <div key={services._id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {services.tag && (
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                          {services.tag}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-800">{services.title}</h3>
                    </div>
                    {services.description && (
                      <p className="text-gray-600 mt-2">{services.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setExpandedServices(expandedServices === services._id ? null : services._id);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      {expandedServices === services._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingServices(services);
                        setShowForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteServices(services._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {expandedServices === services._id && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-700">Service Cards</h4>
                      <button
                        onClick={() => {
                          setSelectedServicesId(services._id);
                          setEditingCard(null);
                          setShowCardForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                      >
                        <Plus size={14} /> Add Card
                      </button>
                    </div>
                    
                    {services.cards && services.cards.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.cards.map((card) => (
                          <div key={card._id} className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-gray-800">{card.title}</h5>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedServicesId(services._id);
                                    setEditingCard(card);
                                    setShowCardForm(true);
                                  }}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(services._id, card._id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">{card.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No cards yet. Click "Add Card" to get started.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}