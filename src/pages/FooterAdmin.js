// src/components/admin/FooterAdmin.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit, Save, X, Sparkles, Loader2,
  CheckCircle, AlertCircle, EyeOff, Trash2, Upload,
  Plus, Link2, FileText, Globe, Shield,
  Phone, Mail, MapPin, Search, Package,
  ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: -20 }}
      className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        ${type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
        text-white min-w-[300px]`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70"><X size={16} /></button>
    </motion.div>
  );
};

// ── Footer Preview Modal ─────────────────────────────────────────────────────
const FooterPreviewModal = ({ footer, onClose }) => {
  if (!footer) return null;

  const BASE = 'https://smartlabtechbackend-p5h6.onrender.com';

  const socialIcons = [
    { key: 'linkedin',  Icon: FaLinkedin,  url: footer.socialMedia?.linkedin },
    { key: 'twitter',   Icon: FaTwitter,   url: footer.socialMedia?.twitter },
    { key: 'instagram', Icon: FaInstagram, url: footer.socialMedia?.instagram },
    { key: 'youtube',   Icon: FaYoutube,   url: footer.socialMedia?.youtube },
    { key: 'facebook',  Icon: FaFacebook,  url: footer.socialMedia?.facebook },
  ].filter(s => s.url);

  const company = [
    { label: 'About Us' },
    { label: 'Services' },
    { label: 'Blogs' },
    { label: 'Resources' },
    { label: 'Products' },
  ];
  const support = [
    { label: 'Get a Quote' },
    { label: 'Contact Us' },
    { label: 'Support' },
  ];

  const policies = [
    { label: footer.privacyPolicy?.title || 'Privacy Policy',   url: footer.privacyPolicy?.file },
    { label: footer.termsOfService?.title || 'Terms of Service', url: footer.termsOfService?.file },
    { label: footer.cookiePolicy?.title || 'Cookie Policy',     url: footer.cookiePolicy?.file },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-[1400px] mx-auto rounded-t-2xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal header bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-slate-700 border-b border-slate-600">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-slate-300" />
              <span className="text-sm font-semibold text-slate-200">Footer Preview</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Live</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-600 text-slate-400 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* ── Actual footer replica ── */}
          <div style={{ background: '#0d1b2a', fontFamily: "'DM Sans', sans-serif" }}>

            {/* Main footer grid */}
            <div className="px-10 py-12">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '3rem', maxWidth: '1280px', margin: '0 auto' }}>

                {/* Col 1 — Brand */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>S</span>
                    </div>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>
                      SmartLab<span style={{ color: '#60a5fa' }}>Tech</span>
                    </span>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginBottom: 20, maxWidth: 300 }}>
                    {footer.companyDescription?.slice(0, 120)}
                    {footer.companyDescription?.length > 120 ? '…' : ''}
                  </p>

                  {/* Social icons */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                    {socialIcons.map(({ key, Icon, url }) => (
                      <a key={key} href={url} target="_blank" rel="noreferrer"
                        style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #1e3a5f', background: '#0f2a42', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all .2s', textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1e3a5f'; e.currentTarget.style.color = '#60a5fa'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#0f2a42'; e.currentTarget.style.color = '#94a3b8'; }}
                      >
                        <Icon size={14} />
                      </a>
                    ))}
                  </div>

                  {/* Contact */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {footer.companyContact?.mobileNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                        <Phone size={13} color="#3b82f6" />
                        {footer.companyContact.mobileNumber}
                      </div>
                    )}
                    {footer.companyContact?.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                        <Mail size={13} color="#3b82f6" />
                        {footer.companyContact.email}
                      </div>
                    )}
                    {footer.companyContact?.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                        <MapPin size={13} color="#3b82f6" />
                        {footer.companyContact.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Col 2 — Products */}
                <div>
                  <h4 style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                    Products
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(footer.products || []).map((p, i) => (
                      <li key={i}>
                        <a
                          href={p.productId?.slug ? `/products/${p.productId.slug}` : '#'}
                          style={{ color: '#94a3b8', fontSize: 13.5, textDecoration: 'none', transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                        >
                          {p.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 3 — Services */}
                <div>
                  <h4 style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                    Services
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(footer.services || []).map((s, i) => (
                      <li key={i}>
                        <a href="#" style={{ color: '#94a3b8', fontSize: 13.5, textDecoration: 'none', transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                        >
                          {s.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 4 — Company */}
                <div>
                  <h4 style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                    Company
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {company.map((c, i) => (
                      <li key={i}>
                        <a href="#" style={{ color: '#94a3b8', fontSize: 13.5, textDecoration: 'none', transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                        >
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 5 — Support */}
                <div>
                  <h4 style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                    Support
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {support.map((s, i) => (
                      <li key={i}>
                        <a href="#" style={{ color: '#94a3b8', fontSize: 13.5, textDecoration: 'none', transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid #1e2d3d', padding: '16px 40px', maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ color: '#475569', fontSize: 12.5, margin: 0 }}>
                {footer.copyrightText || `© ${new Date().getFullYear()} SmartLabTech Pvt. Ltd. All rights reserved.`}
              </p>
              <div style={{ display: 'flex', gap: 20 }}>
                {policies.map((p, i) => (
                  <a key={i}
                    href={p.url || '#'}
                    target={p.url ? '_blank' : '_self'}
                    rel="noreferrer"
                    style={{ color: '#475569', fontSize: 12.5, textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Social Media Input ───────────────────────────────────────────────────────
const SocialMediaInput = ({ label, icon: Icon, value, onChange }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
      <Icon size={18} className="text-slate-600" />
    </div>
    <input type="url" value={value} onChange={onChange} placeholder={`${label} URL`}
      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
  </div>
);

// ── Product Selector ─────────────────────────────────────────────────────────
const ProductSelector = ({ selectedProducts, onChange }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/products/', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setAllProducts(data.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(search.toLowerCase())
  );
  const isSelected = id => selectedProducts.some(p => (p.productId?._id || p.productId) === id);
  const toggle = product => {
    if (isSelected(product._id)) {
      onChange(selectedProducts.filter(p => (p.productId?._id || p.productId) !== product._id));
    } else {
      onChange([...selectedProducts, { name: product.name, productId: product._id }]);
    }
  };
  const remove = id => onChange(selectedProducts.filter(p => (p.productId?._id || p.productId) !== id));

  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <Package size={16} className="text-blue-600" /> Product Links
      </h4>
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedProducts.map(p => {
            const id = p.productId?._id || p.productId;
            return (
              <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {p.name}
                <button type="button" onClick={() => remove(id)} className="hover:text-blue-600"><X size={12} /></button>
              </span>
            );
          })}
        </div>
      )}
      <div className="relative" ref={ref}>
        <button type="button" onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:border-blue-400 transition">
          <span>{selectedProducts.length > 0 ? `${selectedProducts.length} product(s) selected` : 'Select products…'}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              <div className="p-2 border-b border-slate-100">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <Search size={14} className="text-slate-400 shrink-0" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products…" autoFocus
                    className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400" />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
                    <Loader2 size={16} className="animate-spin" /> Loading…
                  </div>
                ) : filtered.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-6">No products found</p>
                ) : filtered.map(product => {
                  const selected = isSelected(product._id);
                  return (
                    <button key={product._id} type="button" onClick={() => toggle(product)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition border-b border-slate-50 last:border-0 ${selected ? 'bg-blue-50' : ''}`}>
                      <img src={product.mainImage} alt={product.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200"
                        onError={e => { e.target.style.display = 'none'; }} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${selected ? 'text-blue-700' : 'text-slate-800'}`}>{product.name}</p>
                        <p className="text-xs text-slate-400 truncate">{product.brandName} · {product.categoryName}</p>
                      </div>
                      {selected && <CheckCircle size={16} className="text-blue-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-xs text-slate-400">{filtered.length} product(s)</span>
                <button type="button" onClick={() => setOpen(false)} className="text-xs text-blue-600 font-medium hover:underline">Done</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── Link Manager (Services) ──────────────────────────────────────────────────
const LinkManager = ({ title, links, onAdd, onRemove, onUpdate }) => {
  const [newName, setNewName] = useState('');
  const handleAdd = () => {
    if (newName.trim()) { onAdd({ name: newName.trim() }); setNewName(''); }
  };
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <h4 className="font-semibold text-slate-800 mb-3">{title}</h4>
      <div className="space-y-2 mb-3">
        {links.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input type="text" value={link.name} onChange={e => onUpdate(idx, e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Link name" />
            <button type="button" onClick={() => onRemove(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder="Link name"
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        <button type="button" onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
};

// ── Policy Manager ───────────────────────────────────────────────────────────
const PolicyManager = ({ title, policy, onUpdate, onFileUpload }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
      <FileText size={16} className="text-blue-600" /> {title}
    </h4>
    <div className="space-y-3">
      <input type="text" value={policy.title || ''} onChange={e => onUpdate({ ...policy, title: e.target.value })}
        placeholder="Policy Title"
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
        <Upload size={24} className="mx-auto text-slate-400 mb-2" />
        <p className="text-sm text-slate-500 mb-2">{policy.file ? 'Update policy file' : 'Upload policy file (PDF)'}</p>
        <label className="cursor-pointer inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          Choose File
          <input type="file" hidden accept=".pdf,.doc,.docx" onChange={e => { if (e.target.files[0]) onFileUpload(e.target.files[0]); }} />
        </label>
        {policy.file && <p className="text-xs text-slate-400 mt-2">Current: {String(policy.file).split('/').pop()}</p>}
      </div>
    </div>
  </div>
);

// ── Main FooterAdmin ─────────────────────────────────────────────────────────
export function FooterAdmin() {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);

  const defaultForm = {
    companyDescription: '',
    companyContact: { mobileNumber: '', email: '', location: '' },
    socialMedia: { facebook: '', instagram: '', twitter: '', youtube: '', linkedin: '' },
    products: [],
    services: [],
    privacyPolicy: { title: '', file: null },
    cookiePolicy: { title: '', file: null },
    termsOfService: { title: '', file: null },
    copyrightText: '',
    isActive: true
  };

  const [formData, setFormData] = useState(defaultForm);
  const [policyFiles, setPolicyFiles] = useState({ privacyPolicyFile: null, cookiePolicyFile: null, termsOfServiceFile: null });

  useEffect(() => { fetchFooter(); }, []);

  const fetchFooter = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/footer', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.status === 404) { setFooter(null); return; }
      const data = await res.json();
      if (data.success && data.data) {
        setFooter(data.data);
        setFormData({
          companyDescription: data.data.companyDescription || '',
          companyContact: {
            mobileNumber: data.data.companyContact?.mobileNumber || '',
            email: data.data.companyContact?.email || '',
            location: data.data.companyContact?.location || ''
          },
          socialMedia: {
            facebook: data.data.socialMedia?.facebook || '',
            instagram: data.data.socialMedia?.instagram || '',
            twitter: data.data.socialMedia?.twitter || '',
            youtube: data.data.socialMedia?.youtube || '',
            linkedin: data.data.socialMedia?.linkedin || ''
          },
          products: data.data.products || [],
          services: data.data.services || [],
          privacyPolicy: { title: data.data.privacyPolicy?.title || '', file: data.data.privacyPolicy?.file || null },
          cookiePolicy: { title: data.data.cookiePolicy?.title || '', file: data.data.cookiePolicy?.file || null },
          termsOfService: { title: data.data.termsOfService?.title || '', file: data.data.termsOfService?.file || null },
          copyrightText: data.data.copyrightText || '',
          isActive: data.data.isActive ?? true
        });
      }
    } catch { showToast('Failed to load footer', 'error'); }
    finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyDescription.trim()) return showToast('Company description is required', 'error');
    if (!formData.companyContact.mobileNumber.trim()) return showToast('Mobile number is required', 'error');
    if (!formData.companyContact.email.trim()) return showToast('Email is required', 'error');
    if (!formData.companyContact.location.trim()) return showToast('Location is required', 'error');
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('companyDescription', formData.companyDescription);
      fd.append('companyContact', JSON.stringify(formData.companyContact));
      fd.append('socialMedia', JSON.stringify(formData.socialMedia));
      // Normalize products to send only { name, productId } (id string)
      const normalizedProducts = formData.products.map(p => ({
        name: p.name,
        productId: p.productId?._id || p.productId
      }));
      fd.append('products', JSON.stringify(normalizedProducts));
      fd.append('services', JSON.stringify(formData.services));
      fd.append('privacyPolicy', JSON.stringify({ title: formData.privacyPolicy.title }));
      fd.append('cookiePolicy', JSON.stringify({ title: formData.cookiePolicy.title }));
      fd.append('termsOfService', JSON.stringify({ title: formData.termsOfService.title }));
      fd.append('copyrightText', formData.copyrightText);
      fd.append('isActive', formData.isActive);
      if (policyFiles.privacyPolicyFile) fd.append('privacyPolicyFile', policyFiles.privacyPolicyFile);
      if (policyFiles.cookiePolicyFile) fd.append('cookiePolicyFile', policyFiles.cookiePolicyFile);
      if (policyFiles.termsOfServiceFile) fd.append('termsOfServiceFile', policyFiles.termsOfServiceFile);

      const res = await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/footer', {
        method: footer ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        showToast(footer ? 'Footer updated successfully!' : 'Footer created successfully!', 'success');
        await fetchFooter();
        setIsEditing(false);
        setPolicyFiles({ privacyPolicyFile: null, cookiePolicyFile: null, termsOfServiceFile: null });
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch { showToast('Failed to save footer', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete Footer? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('https://smartlabtechbackend-p5h6.onrender.com/api/footer', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      setFooter(null);
      setFormData(defaultForm);
      showToast('Footer deleted successfully', 'success');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const updateServiceLink = (index, name) => {
    const updated = [...formData.services];
    updated[index] = { ...updated[index], name };
    setFormData({ ...formData, services: updated });
  };

  const stats = [
    { label: 'Status', value: footer?.isActive ? 'Active' : 'Inactive', color: footer?.isActive ? 'green' : 'slate' },
    { label: 'Products Links', value: footer?.products?.length || 0, color: 'blue' },
    { label: 'Services Links', value: footer?.services?.length || 0, color: 'purple' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* Footer Preview Modal */}
      {showPreview && <FooterPreviewModal footer={footer} onClose={() => setShowPreview(false)} />}

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 px-7 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Footer Management</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Footer <span className="text-slate-300">Configuration</span>
          </h2>
          <p className="text-white/70 text-sm">Manage footer content, links, and legal policies</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-xl ${stat.color === 'green' ? 'bg-emerald-50' : stat.color === 'blue' ? 'bg-blue-50' : 'bg-purple-50'} flex items-center justify-center mb-3`}>
              {stat.label === 'Status'
                ? (footer?.isActive ? <CheckCircle size={18} className="text-emerald-600" /> : <EyeOff size={18} className="text-slate-600" />)
                : <Link2 size={18} className={stat.color === 'blue' ? 'text-blue-600' : 'text-purple-600'} />}
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={40} className="mx-auto text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Loading footer…</p>
          </div>
        ) : (
          <>
            {/* Action bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex gap-3 flex-wrap">
                {footer && !isEditing && (
                  <>
                    {/* ── VIEW BUTTON ── */}
                    <button
                      onClick={() => setShowPreview(true)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 flex items-center gap-2 font-medium transition"
                    >
                      <Eye size={16} /> View Footer
                    </button>
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition">
                      <Edit size={16} /> Edit Footer
                    </button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center gap-2 transition">
                      <Trash2 size={16} /> Delete
                    </button>
                  </>
                )}
              </div>
              {footer && !isEditing && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${footer?.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {footer?.isActive ? '● Active' : '○ Inactive'}
                </span>
              )}
            </div>

            {/* View mode */}
            {footer && !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Footer Info</h3>
                  <p className="text-slate-600 text-sm mb-4">{footer.companyDescription}</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><Phone size={14} className="text-blue-600" />{footer.companyContact?.mobileNumber}</div>
                    <div className="flex items-center gap-2"><Mail size={14} className="text-blue-600" />{footer.companyContact?.email}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-600" />{footer.companyContact?.location}</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Products Links</label>
                    <div className="mt-2 space-y-1">
                      {footer.products?.map((p, i) => <p key={i} className="text-sm text-slate-600">• {p.name}</p>)}
                      {(!footer.products || footer.products.length === 0) && <p className="text-sm text-slate-400">No products linked</p>}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Services Links</label>
                    <div className="mt-2 space-y-1">
                      {footer.services?.map((s, i) => <p key={i} className="text-sm text-slate-600">• {s.name}</p>)}
                      {(!footer.services || footer.services.length === 0) && <p className="text-sm text-slate-400">No services linked</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Edit / Create form */
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Description *</label>
                  <textarea rows={3} value={formData.companyDescription}
                    onChange={e => setFormData({ ...formData, companyDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Brief description of your company…" required />
                  <p className="text-xs text-slate-400 mt-1">Max 500 characters</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input type="tel" value={formData.companyContact.mobileNumber}
                      onChange={e => setFormData({ ...formData, companyContact: { ...formData.companyContact, mobileNumber: e.target.value } })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 1234567890" required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                    <input type="email" value={formData.companyContact.email}
                      onChange={e => setFormData({ ...formData, companyContact: { ...formData.companyContact, email: e.target.value } })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="info@company.com" required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1">Location *</label>
                    <input type="text" value={formData.companyContact.location}
                      onChange={e => setFormData({ ...formData, companyContact: { ...formData.companyContact, location: e.target.value } })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City, Country" required /></div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Social Media Links</label>
                  <SocialMediaInput label="Facebook" icon={FaFacebook} value={formData.socialMedia.facebook} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, facebook: e.target.value } })} />
                  <SocialMediaInput label="Instagram" icon={FaInstagram} value={formData.socialMedia.instagram} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, instagram: e.target.value } })} />
                  <SocialMediaInput label="Twitter/X" icon={FaTwitter} value={formData.socialMedia.twitter} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, twitter: e.target.value } })} />
                  <SocialMediaInput label="YouTube" icon={FaYoutube} value={formData.socialMedia.youtube} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, youtube: e.target.value } })} />
                  <SocialMediaInput label="LinkedIn" icon={FaLinkedin} value={formData.socialMedia.linkedin} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, linkedin: e.target.value } })} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <ProductSelector
                    selectedProducts={formData.products}
                    onChange={products => setFormData({ ...formData, products })}
                  />
                  <LinkManager
                    title="Service Links"
                    links={formData.services}
                    onAdd={link => setFormData({ ...formData, services: [...formData.services, link] })}
                    onRemove={i => setFormData({ ...formData, services: formData.services.filter((_, idx) => idx !== i) })}
                    onUpdate={(i, name) => updateServiceLink(i, name)}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <PolicyManager title="Privacy Policy" policy={formData.privacyPolicy}
                    onUpdate={p => setFormData({ ...formData, privacyPolicy: p })}
                    onFileUpload={f => setPolicyFiles({ ...policyFiles, privacyPolicyFile: f })} />
                  <PolicyManager title="Cookie Policy" policy={formData.cookiePolicy}
                    onUpdate={p => setFormData({ ...formData, cookiePolicy: p })}
                    onFileUpload={f => setPolicyFiles({ ...policyFiles, cookiePolicyFile: f })} />
                  <PolicyManager title="Terms of Service" policy={formData.termsOfService}
                    onUpdate={p => setFormData({ ...formData, termsOfService: p })}
                    onFileUpload={f => setPolicyFiles({ ...policyFiles, termsOfServiceFile: f })} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Copyright Text</label>
                    <input type="text" value={formData.copyrightText}
                      onChange={e => setFormData({ ...formData, copyrightText: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={`© ${new Date().getFullYear()} SmartLabTech. All rights reserved.`} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div><span className="text-sm font-semibold">Active Status</span><p className="text-xs text-slate-500">Display footer on website</p></div>
                    <button type="button" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {footer && (
                    <button type="button" onClick={() => { setIsEditing(false); fetchFooter(); }}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50">Cancel</button>
                  )}
                  <button type="submit" disabled={submitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl hover:shadow-lg flex items-center justify-center gap-2">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {footer ? 'Update Footer' : 'Create Footer'}
                  </button>
                </div>
              </motion.form>
            )}
          </>
        )}
      </div>

      {/* Empty state */}
      {!footer && !isEditing && !loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Globe size={32} className="text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-600">No Footer Configuration Found</p>
          <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 mt-4 inline-flex items-center gap-2">
            <Edit size={16} /> Create Footer
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-slate-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Footer Best Practices</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Keep company description concise (150–200 characters)</li>
              <li>• Include all social media profiles for better engagement</li>
              <li>• Ensure all policy documents are uploaded as PDFs</li>
              <li>• Update copyright year annually</li>
              <li>• Test all links before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}