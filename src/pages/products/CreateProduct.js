// src/pages/products/ProductForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Save, X, Plus, Loader, ChevronLeft,
  Package, Image as ImageIcon, AlertCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// ─── Constants ─────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:5000/api';
const STATIC_BASE_URL = 'http://localhost:5000';

// ─── Helper Functions ──────────────────────────────────────────────────────
const imgUrl = (path) => {
  if (!path) return null;
  // Handle Windows paths and clean them
  const cleanPath = path.replace(/^[\\/]+/, '').replace(/\\/g, '/');
  // Extract filename if path contains full Windows path
  const parts = cleanPath.split('/');
  const filename = parts[parts.length - 1];
  return `${STATIC_BASE_URL}/uploads/products/${filename}`;
};

// ─── Axios Instance with Token ────────────────────────────────────────────
const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Shared field components ────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const Input = React.forwardRef((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition ${props.className ?? ''}`}
  />
));
Input.displayName = 'Input';

const Textarea = React.forwardRef((props, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none transition ${props.className ?? ''}`}
  />
));
Textarea.displayName = 'Textarea';

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition ${props.className ?? ''}`}
  >
    {children}
  </select>
);

const TagList = ({ items, onRemove, colorClass = 'bg-blue-50 text-blue-700', getLabel = (item) => typeof item === 'string' ? item : item.label || item.q }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {items.map((item, i) => (
      <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 ${colorClass} rounded-full text-xs font-medium`}>
        {getLabel(item)}
        <button type="button" onClick={() => onRemove(i)} className="hover:text-red-500 transition">
          <X size={12} />
        </button>
      </span>
    ))}
  </div>
);

const AddRow = ({ placeholder, value, onChange, onAdd, onKeyDown }) => (
  <div className="flex gap-2">
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown ?? ((e) => e.key === 'Enter' && (e.preventDefault(), onAdd()))}
    />
    <button
      type="button"
      onClick={onAdd}
      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition flex-shrink-0"
    >
      <Plus size={15} />
    </button>
  </div>
);

// ─── Initial form state ─────────────────────────────────────────────────────
const EMPTY = {
  name: '', brand: '', category: '', shortDesc: '', fullDesc: '',
  price: '', discountedPrice: '', inStock: true, isFeatured: false,
  warranty: '', leadTime: '', rating: '', reviews: '',
  mainImage: null, gallery: [],
  specifications: {}, features: [], applications: [],
  certifications: [], highlights: [], faqs: [],
};

const TABS = ['Basic', 'Specifications', 'Media', 'Advanced'];

// ─── Main Component ────────────────────────────────────────────────────────
export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = id;

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [activeTab, setActiveTab] = useState('Basic');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Input states for array fields
  const [specsInput, setSpecsInput] = useState({ key: '', value: '' });
  const [featInput, setFeatInput] = useState('');
  const [appInput, setAppInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [hlInput, setHlInput] = useState({ icon: 'zap', label: '', desc: '' });
  const [faqInput, setFaqInput] = useState({ q: '', a: '' });

  // Image previews
  const [mainPreview, setMainPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const isEdit = Boolean(productId);

  // ── Fetch categories and brands ──────────────────────────────────────────
  const fetchCategoriesAndBrands = useCallback(async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/brands')
      ]);
      setCategories(categoriesRes.data.data ?? []);
      setBrands(brandsRes.data.data ?? []);
    } catch (err) {
      console.error('fetchCategoriesAndBrands:', err);
      setError('Failed to load categories and brands');
    }
  }, []);

  // ── Fetch existing product ───────────────────────────────────────────────
  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    try {
      setFetching(true);
      const { data } = await apiClient.get(`/products/${productId}`);
      const p = data.data;
      
      // Extract brand and category IDs from nested objects
      const brandId = p.brand?._id || p.brand || '';
      const categoryId = p.category?._id || p.category || '';
      
      setForm({
        name: p.name ?? '',
        brand: brandId,
        category: categoryId,
        shortDesc: p.shortDesc ?? '',
        fullDesc: p.fullDesc ?? '',
        price: p.price ?? '',
        discountedPrice: p.discountedPrice ?? '',
        inStock: p.inStock ?? false,
        isFeatured: p.isFeatured ?? false,
        warranty: p.warranty ?? '',
        leadTime: p.leadTime ?? '',
        rating: p.rating ?? '',
        reviews: p.reviews ?? '',
        mainImage: null,
        gallery: [],
        specifications: p.specifications ?? {},
        features: p.features ?? [],
        applications: p.applications ?? [],
        certifications: p.certifications ?? [],
        highlights: p.highlights ?? [],
        faqs: p.faqs ?? [],
      });
      
      // Set image previews
      if (p.mainImage) {
        setMainPreview(imgUrl(p.mainImage));
      }
      
    } catch (err) {
      console.error('fetchProduct:', err);
      setError('Failed to load product details.');
    } finally {
      setFetching(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchCategoriesAndBrands();
    if (isEdit) {
      fetchProduct();
    }
  }, [fetchCategoriesAndBrands, fetchProduct, isEdit]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const buildFormData = () => {
    const fd = new FormData();
    const scalar = ['name', 'brand', 'category', 'shortDesc', 'fullDesc', 'price',
      'discountedPrice', 'inStock', 'isFeatured', 'warranty', 'leadTime', 'rating', 'reviews'];
    scalar.forEach(k => {
      if (form[k] !== '' && form[k] != null) fd.append(k, form[k]);
    });
    const arrays = ['specifications', 'features', 'applications', 'certifications', 'highlights', 'faqs'];
    arrays.forEach(k => {
      const v = form[k];
      const isEmpty = Array.isArray(v) ? v.length === 0 : Object.keys(v).length === 0;
      if (!isEmpty) fd.append(k, JSON.stringify(v));
    });
    if (form.mainImage) fd.append('mainImage', form.mainImage);
    form.gallery.forEach(f => fd.append('gallery', f));
    return fd;
  };

  const validate = () => {
    const errors = {};
    if (!form.name?.trim()) errors.name = 'Product name is required';
    if (!form.brand) errors.brand = 'Brand is required';
    if (!form.category) errors.category = 'Category is required';
    if (!form.price) errors.price = 'Price is required';
    if (form.price && (isNaN(form.price) || Number(form.price) < 0)) errors.price = 'Price must be a valid positive number';
    if (form.discountedPrice && (isNaN(form.discountedPrice) || Number(form.discountedPrice) < 0)) errors.discountedPrice = 'Discounted price must be a valid positive number';
    if (form.discountedPrice && form.price && Number(form.discountedPrice) >= Number(form.price)) errors.discountedPrice = 'Discounted price must be less than regular price';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setError('Please fix the errors before submitting');
      return;
    }
    setError('');
    try {
      setLoading(true);
      const fd = buildFormData();
      if (isEdit) {
        await apiClient.put(`/products/${productId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await apiClient.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/dashboard/products');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to save product.';
      setError(message);
      if (err?.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Array mutators ────────────────────────────────────────────────────────
  const addSpec = () => {
    if (!specsInput.key.trim() || !specsInput.value.trim()) return;
    set('specifications', { ...form.specifications, [specsInput.key.trim()]: specsInput.value.trim() });
    setSpecsInput({ key: '', value: '' });
  };
  const removeSpec = (k) => {
    const s = { ...form.specifications };
    delete s[k];
    set('specifications', s);
  };

  const addToArray = (field, value, clear) => {
    if (!value?.trim()) return;
    set(field, [...form[field], value.trim()]);
    clear('');
  };
  const removeFromArray = (field, idx) => set(field, form[field].filter((_, i) => i !== idx));

  const addHighlight = () => {
    if (!hlInput.label.trim() || !hlInput.desc.trim()) return;
    set('highlights', [...form.highlights, { icon: hlInput.icon, label: hlInput.label.trim(), desc: hlInput.desc.trim() }]);
    setHlInput({ icon: 'zap', label: '', desc: '' });
  };

  const addFaq = () => {
    if (!faqInput.q.trim() || !faqInput.a.trim()) return;
    set('faqs', [...form.faqs, { q: faqInput.q.trim(), a: faqInput.a.trim() }]);
    setFaqInput({ q: '', a: '' });
  };

  const handleBack = () => {
    navigate('/dashboard/products');
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (mainPreview && mainPreview.startsWith('blob:')) URL.revokeObjectURL(mainPreview);
      galleryPreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
      });
    };
  }, [mainPreview, galleryPreviews]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader size={36} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {isEdit ? 'Edit Product' : 'New Product'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEdit ? 'Update product details' : 'Fill in the details below'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-gradient-to-r from-blue-700 to-sky-600 text-white font-bold text-sm rounded-xl hover:opacity-90 transition shadow disabled:opacity-60 w-full sm:w-auto"
        >
          {loading ? <Loader size={15} className="animate-spin" /> : <Save size={15} />}
          {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 transition">
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600 bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 space-y-5">

          {/* ── BASIC TAB ────────────────────────────────────────────── */}
          {activeTab === 'Basic' && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Product Name" required error={fieldErrors.name}>
                  <Input 
                    placeholder="e.g., Analytical Balance Pro" 
                    value={form.name} 
                    onChange={e => set('name', e.target.value)} 
                  />
                </Field>
                <Field label="Brand" required error={fieldErrors.brand}>
                  <Select value={form.brand} onChange={e => set('brand', e.target.value)}>
                    <option value="">Select Brand</option>
                    {brands?.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </Select>
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category" required error={fieldErrors.category}>
                  <Select value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">Select Category</option>
                    {categories?.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Price (₹)" required error={fieldErrors.price}>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={form.price} 
                    onChange={e => set('price', e.target.value)} 
                    min="0" 
                    step="1"
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Discounted Price (₹)" error={fieldErrors.discountedPrice}>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={form.discountedPrice} 
                    onChange={e => set('discountedPrice', e.target.value)} 
                    min="0" 
                    step="1"
                  />
                </Field>
                <Field label="Warranty">
                  <Input 
                    placeholder="e.g., 2 years" 
                    value={form.warranty} 
                    onChange={e => set('warranty', e.target.value)} 
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Lead Time">
                  <Input 
                    placeholder="e.g., 2–3 weeks" 
                    value={form.leadTime} 
                    onChange={e => set('leadTime', e.target.value)} 
                  />
                </Field>
                <Field label="Flags">
                  <div className="flex flex-wrap items-center gap-6 h-auto sm:h-[42px]">
                    {[
                      ['inStock', 'In Stock'],
                      ['isFeatured', 'Featured']
                    ].map(([k, lbl]) => (
                      <label key={k} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={form[k]} 
                          onChange={e => set(k, e.target.checked)} 
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600" 
                        />
                        <span className="text-sm text-slate-700 font-medium">{lbl}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
              <Field label="Short Description">
                <Textarea 
                  rows={2} 
                  placeholder="Brief product overview…" 
                  value={form.shortDesc} 
                  onChange={e => set('shortDesc', e.target.value)} 
                />
              </Field>
              <Field label="Full Description">
                <Textarea 
                  rows={5} 
                  placeholder="Detailed product description…" 
                  value={form.fullDesc} 
                  onChange={e => set('fullDesc', e.target.value)} 
                />
              </Field>
            </>
          )}

          {/* ── SPECIFICATIONS TAB ───────────────────────────────────── */}
          {activeTab === 'Specifications' && (
            <>
              <Field label="Technical Specifications">
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <Input 
                    placeholder="Key (e.g. Readability)" 
                    value={specsInput.key} 
                    onChange={e => setSpecsInput(s => ({ ...s, key: e.target.value }))} 
                  />
                  <Input 
                    placeholder="Value (e.g. 0.1 mg)" 
                    value={specsInput.value} 
                    onChange={e => setSpecsInput(s => ({ ...s, value: e.target.value }))} 
                  />
                  <button 
                    type="button" 
                    onClick={addSpec} 
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition flex-shrink-0"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(form.specifications).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl text-sm">
                      <span className="flex-1">
                        <span className="font-semibold text-slate-700">{k}:</span>{' '}
                        <span className="text-slate-500">{v}</span>
                      </span>
                      <button type="button" onClick={() => removeSpec(k)} className="text-slate-400 hover:text-red-500 transition ml-2">
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </Field>

              {[
                { label: 'Features', field: 'features', input: featInput, setInput: setFeatInput, colorClass: 'bg-blue-50 text-blue-700', placeholder: 'e.g., Auto internal calibration' },
                { label: 'Applications', field: 'applications', input: appInput, setInput: setAppInput, colorClass: 'bg-emerald-50 text-emerald-700', placeholder: 'e.g., Pharmaceutical QC' },
                { label: 'Certifications', field: 'certifications', input: certInput, setInput: setCertInput, colorClass: 'bg-violet-50 text-violet-700', placeholder: 'e.g., ISO 9001:2015' },
              ].map(({ label, field, input, setInput, colorClass, placeholder }) => (
                <Field key={field} label={label}>
                  <AddRow
                    placeholder={placeholder}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onAdd={() => addToArray(field, input, setInput)}
                  />
                  <TagList 
                    items={form[field]} 
                    onRemove={(i) => removeFromArray(field, i)} 
                    colorClass={colorClass}
                  />
                </Field>
              ))}
            </>
          )}

          {/* ── MEDIA TAB ────────────────────────────────────────────── */}
          {activeTab === 'Media' && (
            <>
              <Field label="Main Image">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 transition bg-slate-50/50 group overflow-hidden">
                  {mainPreview ? (
                    <img src={mainPreview} alt="main preview" className="w-full h-full object-contain rounded-2xl p-2" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-blue-500 transition">
                      <ImageIcon size={28} />
                      <span className="text-xs font-medium">Click to upload main image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files[0];
                      if (f) {
                        if (f.size > 5 * 1024 * 1024) {
                          setError('Image size should be less than 5MB');
                          return;
                        }
                        set('mainImage', f);
                        setMainPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                </label>
                {mainPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      set('mainImage', null);
                      if (mainPreview && mainPreview.startsWith('blob:')) URL.revokeObjectURL(mainPreview);
                      setMainPreview('');
                    }}
                    className="mt-2 text-xs text-red-500 hover:underline transition"
                  >
                    Remove image
                  </button>
                )}
              </Field>

              <Field label="Gallery Images">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 transition bg-slate-50/50">
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    <Package size={22} />
                    <span className="text-xs font-medium">Click to upload multiple images (max 10MB each)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      const validFiles = files.filter(f => f.size <= 10 * 1024 * 1024);
                      if (validFiles.length !== files.length) {
                        setError('Some images exceed 10MB limit');
                      }
                      set('gallery', validFiles);
                      // Clean up old previews
                      galleryPreviews.forEach(p => {
                        if (p && p.startsWith('blob:')) URL.revokeObjectURL(p);
                      });
                      setGalleryPreviews(validFiles.map(f => URL.createObjectURL(f)));
                    }}
                  />
                </label>
                {galleryPreviews.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {galleryPreviews.map((src, i) => (
                      <div key={i} className="relative">
                        <img src={src} alt={`gallery-${i}`} className="w-20 h-20 object-cover rounded-xl border border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = form.gallery.filter((_, fi) => fi !== i);
                            const newPreviews = galleryPreviews.filter((_, pi) => pi !== i);
                            set('gallery', newFiles);
                            if (src && src.startsWith('blob:')) URL.revokeObjectURL(src);
                            setGalleryPreviews(newPreviews);
                          }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>
            </>
          )}

          {/* ── ADVANCED TAB ─────────────────────────────────────────── */}
          {activeTab === 'Advanced' && (
            <>
              <Field label="Product Highlights">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <Select value={hlInput.icon} onChange={e => setHlInput(h => ({ ...h, icon: e.target.value }))}>
                    {[
                      ['zap', '⚡ Zap'],
                      ['shield', '🛡️ Shield'],
                      ['globe', '🌐 Globe'],
                      ['award', '🏆 Award'],
                      ['truck', '🚚 Truck']
                    ].map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </Select>
                  <Input 
                    placeholder="Label" 
                    value={hlInput.label} 
                    onChange={e => setHlInput(h => ({ ...h, label: e.target.value }))} 
                  />
                  <Input 
                    placeholder="Description" 
                    value={hlInput.desc} 
                    onChange={e => setHlInput(h => ({ ...h, desc: e.target.value }))} 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={addHighlight} 
                  className="w-full py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Highlight
                </button>
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {form.highlights.map((h, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl text-sm">
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-slate-700">{h.label}</span>
                        <span className="text-slate-500 ml-2 line-clamp-1">{h.desc}</span>
                      </div>
                      <button type="button" onClick={() => removeFromArray('highlights', i)} className="text-slate-400 hover:text-red-500 transition ml-2">
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="FAQs">
                <div className="space-y-2 mb-2">
                  <Input 
                    placeholder="Question" 
                    value={faqInput.q} 
                    onChange={e => setFaqInput(f => ({ ...f, q: e.target.value }))} 
                  />
                  <Textarea 
                    rows={2} 
                    placeholder="Answer" 
                    value={faqInput.a} 
                    onChange={e => setFaqInput(f => ({ ...f, a: e.target.value }))} 
                  />
                  <button 
                    type="button" 
                    onClick={addFaq} 
                    className="w-full py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Add FAQ
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {form.faqs.map((faq, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700">Q: {faq.q}</p>
                          <p className="text-sm text-slate-500 mt-1 break-words">A: {faq.a}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFromArray('faqs', i)} 
                          className="text-slate-400 hover:text-red-500 transition flex-shrink-0"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Field>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            type="button" 
            onClick={handleBack} 
            className="flex-1 py-2.5 text-sm font-semibold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
            {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}