// src/pages/admin/application/ApplicationMainCards.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, X, Save, GripVertical } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com/api';

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const CardForm = ({ card, onSave, onCancel, isLoading }) => {
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
          {card ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export function ApplicationMainCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/applicationpage/main-cards');
      setCards(data.data || []);
    } catch (error) {
      console.error('Fetch cards error:', error);
      alert('Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSave = async (formData) => {
    try {
      setSubmitting(true);
      if (editingCard) {
        await apiClient.put(`/applicationpage/main-cards/${editingCard._id}`, formData);
        alert('Card updated successfully');
      } else {
        await apiClient.post('/applicationpage/main-cards', formData);
        alert('Card created successfully');
      }
      setShowForm(false);
      setEditingCard(null);
      fetchCards();
    } catch (error) {
      console.error('Save card error:', error);
      alert(error?.response?.data?.message || 'Failed to save card');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await apiClient.delete(`/applicationpage/main-cards/${id}`);
      alert('Card deleted successfully');
      fetchCards();
    } catch (error) {
      console.error('Delete card error:', error);
      alert('Failed to delete card');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Main Cards</h2>
          <p className="text-sm text-gray-500 mt-1">Manage main feature cards for your application page</p>
        </div>
        <button
          onClick={() => {
            setEditingCard(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Card
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{editingCard ? 'Edit Card' : 'Create New Card'}</h3>
          <CardForm
            card={editingCard}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingCard(null);
            }}
            isLoading={submitting}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size={36} className="animate-spin text-blue-500" />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No cards found. Create your first card!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card._id} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCard(card);
                      setShowForm(true);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(card._id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}