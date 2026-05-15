// src/components/admin/AboutOverview.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Upload,
  Save,
  Trash2,
  X,
  Edit,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  ZoomIn,
  Plus,
  GripVertical,
  Award,
  Target,
  Heart,
  Star,
  Zap,
  Shield
} from "lucide-react";

const API = "https://smartlabtechbackend-p5h6.onrender.com/api/aboutpage/hero";

// Toast Notification Component
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
      <button onClick={onClose} className="hover:opacity-70">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// Image Preview Modal
const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-w-5xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white">
          <X size={24} />
        </button>
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
      </motion.div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
      <Icon size={22} className="text-white" />
    </div>
    <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
);

const AboutOverview = () => {
  const [form, setForm] = useState({
    title: "",
    tag: "",
    description: "",
    isActive: true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

 

  // ================= FETCH =================
  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setExists(true);
        setForm({
          title: data.title || "",
          tag: data.tag || "",
          description: data.description || "",
          isActive: data.isActive ?? true,
        });
        setPreview(data.image || "");
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.tag.trim() || !form.description.trim()) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("tag", form.tag);
      fd.append("description", form.description);
      fd.append("isActive", form.isActive);
      if (image) fd.append("image", image);

      if (exists) {
        await axios.put(API, fd, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        showToast("Overview updated successfully!");
      } else {
        await axios.post(API, fd, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        showToast("Overview created successfully!");
      }

      fetchOverview();
      setIsEditing(false);
      setImage(null);
    } catch (error) {
      console.log(error);
      showToast(error?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Delete About Overview?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(API, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setExists(false);
      setForm({
        title: "",
        tag: "",
        description: "",
        isActive: true,
      });
      setPreview("");
      setImage(null);
      showToast("Overview deleted successfully!");
    } catch (error) {
      console.log(error);
      showToast("Error deleting overview", "error");
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async () => {
    if (!exists) return;
    
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("tag", form.tag);
      fd.append("description", form.description);
      fd.append("isActive", !form.isActive);

      await axios.put(API, fd, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      fetchOverview();
      showToast(!form.isActive ? "Overview activated!" : "Overview deactivated!");
    } catch (error) {
      console.log(error);
      showToast("Error toggling status", "error");
    }
  };

  const stats = [
    { label: 'Status', value: form.isActive ? 'Active' : 'Inactive', color: form.isActive ? 'green' : 'slate' },
    { label: 'Last Updated', value: exists && form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : 'Not set', color: 'blue' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && preview && (
          <ImagePreviewModal imageUrl={preview} onClose={() => setShowPreviewModal(false)} />
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)'
        }} />
        
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">
              About Page Management
            </span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Company <span className="text-emerald-200">Overview</span>
          </h2>
          <p className="text-white/70 text-sm">
            Manage the main overview section of your about page
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-xl ${
              stat.color === 'green' ? 'bg-emerald-50' : 
              stat.color === 'blue' ? 'bg-blue-50' : 'bg-slate-50'
            } flex items-center justify-center mb-3`}>
              {stat.label === 'Status' ? (
                form.isActive ? <CheckCircle size={18} className="text-emerald-600" /> : <EyeOff size={18} className="text-slate-600" />
              ) : (
                <Sparkles size={18} className="text-blue-600" />
              )}
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-3">
            {exists && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Overview
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={toggleStatus}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    form.isActive 
                      ? 'bg-amber-500 text-white hover:bg-amber-600' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {form.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  {form.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </>
            )}
          </div>
          
          {exists && !isEditing && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              form.isActive 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {form.isActive ? '● Active' : '○ Inactive'}
            </span>
          )}
        </div>

        {/* View Mode */}
        {exists && !isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overview Preview */}
            <div className="grid md:grid-cols-2 gap-6">
              {preview && (
                <div className="relative rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={preview}
                    alt="Overview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white transition-all"
                  >
                    <ZoomIn size={16} className="text-slate-700" />
                  </button>
                </div>
              )}
              <div className="space-y-4">
                <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  {form.tag}
                </span>
                <h3 className="text-2xl font-bold text-slate-800">{form.title}</h3>
                <p className="text-slate-600 leading-relaxed">{form.description}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Tag
                </label>
                <p className="text-slate-800 font-medium">{form.tag}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Title
                </label>
                <p className="text-slate-800 font-medium">{form.title}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Description
                </label>
                <p className="text-slate-600 text-sm">{form.description}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Edit/Create Form */
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Tag Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tag *
              </label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Enter tag (e.g., Our Story)"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              />
              <p className="text-xs text-slate-400 mt-1">
                A short label that appears above the title
              </p>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter overview title"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter company overview description"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Overview Image {!preview && '*'}
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 mb-2">
                  Click to upload or drag and drop
                </p>
                <label className="cursor-pointer inline-flex px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm">
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (!file.type.startsWith('image/')) {
                          showToast("Please select an image file", "error");
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          showToast("Image size should be less than 5MB", "error");
                          return;
                        }
                        setImage(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
                <p className="text-xs text-slate-400 mt-2">
                  PNG, JPG, GIF up to 5MB (Recommended: 800x600)
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    setImage(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Active Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <span className="text-sm font-semibold text-slate-700">Active Status</span>
                <p className="text-xs text-slate-500 mt-1">Display this overview section on about page</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              {exists && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchOverview();
                    setImage(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {exists ? 'Update Overview' : 'Create Overview'}
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {/* Empty State */}
      {!exists && !isEditing && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Sparkles size={32} className="text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-600">No Overview Section Found</p>
          <p className="text-sm text-slate-400 mt-1">Create an overview section for your about page</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all mt-4 inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Create Overview Section
          </button>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Award size={18} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Tips for an Effective Overview Section</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Tell your brand story in a compelling and authentic way</li>
              <li>• Highlight your unique value proposition and key differentiators</li>
              <li>• Use high-quality images that reflect your brand personality</li>
              <li>• Keep the description concise but informative (150-200 words)</li>
              <li>• Include social proof like years of experience or certifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOverview;