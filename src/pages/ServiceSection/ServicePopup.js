// src/components/admin/ServicePopupManager.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, Upload, X, Eye, EyeOff, Loader2, AlertCircle, 
  CheckCircle, Trash2, Save, RefreshCw 
} from 'lucide-react';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

export default function ServicePopupManager() {
  const [popupData, setPopupData] = useState({
    image: '',
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch current popup data
  useEffect(() => {
    fetchPopupData();
  }, []);

  const fetchPopupData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/popup', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPopupData({
            image: data.data.image || '',
            isActive: data.data.isActive === true
          });
        }
      } else if (response.status !== 404) {
        console.error('Failed to fetch popup');
      }
    } catch (err) {
      console.error('Error fetching popup:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
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
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('isActive', popupData.isActive);

      const url = popupData.image && !selectedFile 
        ? 'https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/popup'
        : 'https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/popup';
      
      const method = popupData.image ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Popup image saved successfully!');
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchPopupData();
        
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to save popup');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the popup image?')) return;
    
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/servicepage/popup', {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Popup image deleted successfully!');
        setPopupData({ image: '', isActive: false });
        setSelectedFile(null);
        setPreviewUrl(null);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to delete popup');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = () => {
    setPopupData({ ...popupData, isActive: !popupData.isActive });
  };

  if (loading) {
    return (
      <>
        <FontLink />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <FontLink />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-blue-600" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">
              Admin Panel
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Service Popup Manager
          </h1>
          <p className="text-slate-500 mt-2">Manage the popup image that appears on the service page</p>
        </div>

        {/* Success/Error Messages */}
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-lg">
            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Popup Image
                </label>
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="popup-image"
                  />
                  <label htmlFor="popup-image" className="cursor-pointer block">
                    <Upload size={32} className="mx-auto text-blue-400 mb-2" />
                    <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </label>
                </div>
                {previewUrl && (
                  <div className="mt-3 relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {popupData.image && !previewUrl && (
                  <div className="mt-3 relative">
                    <img src={popupData.image} alt="Current popup" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              {/* Active Status Toggle */}
              <div className="mb-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-slate-700">Popup Active</span>
                  <button
                    type="button"
                    onClick={toggleActive}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      popupData.isActive ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        popupData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  When active, the popup will appear when users visit the services page
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {submitting ? 'Saving...' : 'Save Popup'}
                </button>
                {popupData.image && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-lg">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Eye size={18} className="text-blue-600" />
              Popup Preview
            </h3>
            <div className="relative rounded-xl overflow-hidden border border-slate-200">
              {(previewUrl || popupData.image) ? (
                <img 
                  src={previewUrl || popupData.image} 
                  alt="Popup preview" 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                  <Image size={32} className="text-slate-400" />
                  <p className="text-slate-400 text-sm ml-2">No image selected</p>
                </div>
              )}
              {popupData.isActive && (previewUrl || popupData.image) && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                  <EyeOff size={10} /> Active
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              This popup will appear when users first visit the services page
            </p>
          </div>
        </div>
      </div>
    </>
  );
}