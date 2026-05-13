// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Search, Plus, Edit, Trash2, ChevronRight, ChevronDown,
//   FolderOpen, FolderPlus, Tag, Eye, EyeOff, Save, X,
//   AlertCircle, Package, Layers, Sparkles, TrendingUp,
//   Grid, List, Filter, MoreVertical, CheckCircle, Clock,
//   ArrowUp, ArrowDown, Zap
// } from 'lucide-react';
// import { useAppData } from '../context/AppContext';

// /* ─── Premium Stat Card ─── */
// function StatCard({ label, value, sub, Icon, trend, trendUp, color }) {
//   const gradients = {
//     blue: 'from-blue-600 to-sky-500',
//     amber: 'from-amber-500 to-orange-500',
//     green: 'from-emerald-500 to-teal-500',
//     purple: 'from-purple-500 to-pink-500',
//     red: 'from-red-500 to-rose-500',
//   };

//   const bgColors = {
//     blue: 'bg-blue-50',
//     amber: 'bg-amber-50',
//     green: 'bg-emerald-50',
//     purple: 'bg-purple-50',
//     red: 'bg-red-50',
//   };

//   return (
//     <div className="stat-card group">
//       <div className="flex items-start justify-between mb-4">
//         <div className={`w-12 h-12 rounded-xl ${bgColors[color]} flex items-center justify-center`}>
//           <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg`}>
//             <Icon size={18} className="text-white" />
//           </div>
//         </div>
//         {trend && (
//           <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
//             trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
//           }`}>
//             {trendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
//             {trend}%
//           </div>
//         )}
//       </div>
//       <div className="font-display text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
//       <div className="text-sm font-semibold text-slate-700 mt-1.5">{label}</div>
//       <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
//     </div>
//   );
// }

// /* ─── Premium Modal ─── */
// const Modal = ({ isOpen, onClose, title, maxWidth = '500px', children }) => {
//   if (!isOpen) return null;
  
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.95, y: 20 }}
//         transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//         className="modal-box" 
//         style={{ maxWidth }} 
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="modal-header">
//           <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
//             <Sparkles size={16} className="text-amber-400" />
//             {title}
//           </h3>
//           <button className="btn-icon !text-white/70 hover:!text-white hover:!bg-white/10" onClick={onClose}>
//             <X size={18} />
//           </button>
//         </div>
//         {children}
//       </motion.div>
//     </div>
//   );
// };

// /* ─── Premium Confirm Dialog ─── */
// const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', danger = true }) => {
//   if (!isOpen) return null;
  
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="400px">
//       <div className="p-6 flex flex-col items-center text-center gap-4">
//         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
//           danger ? 'bg-red-50' : 'bg-amber-50'
//         }`}>
//           <AlertCircle size={28} className={danger ? 'text-red-500' : 'text-amber-500'} />
//         </div>
//         <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
//         <div className="flex gap-3 w-full mt-2">
//           <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
//           <button
//             className={`btn flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}
//             onClick={() => { onConfirm(); onClose(); }}
//           >
//             {confirmLabel}
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// /* ─── Premium Toggle ─── */
// const Toggle = ({ checked, onChange }) => {
//   return (
//     <label className="toggle">
//       <input type="checkbox" checked={checked} onChange={onChange} />
//       <span className="toggle-slider" />
//     </label>
//   );
// };

// /* ─── Premium Badge ─── */
// const Badge = ({ status, children }) => {
//   const getBadgeClass = (s) => {
//     const map = {
//       active: 'badge-green',
//       hidden: 'badge-slate',
//       pending: 'badge-amber',
//       replied: 'badge-green',
//     };
//     return map[s] || 'badge-slate';
//   };
  
//   return (
//     <span className={`badge ${getBadgeClass(status)}`}>
//       {children || status}
//     </span>
//   );
// };

// /* ─── Custom Hook ─── */
// const useDisclosure = (initial = false) => {
//   const [isOpen, setIsOpen] = useState(initial);
//   const open = () => setIsOpen(true);
//   const close = () => setIsOpen(false);
//   const toggle = () => setIsOpen(v => !v);
//   return { isOpen, open, close, toggle };
// };

// /* ─── Main Component ─── */
//   export function CategoriesPage() {
//   const {
//     categories,
//     addCategory,
//     updateCategory,
//     deleteCategory,
//     toggleCatActive,
//     addSubCategory,
//     updateSubCategory,
//     deleteSubCategory
//   } = useAppData();

//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedCategories, setExpandedCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
//   const [viewMode, setViewMode] = useState('table'); // table or grid
  
//   const [categoryForm, setCategoryForm] = useState({
//     name: '', slug: '', description: '', icon: '📦', active: true
//   });
//   const [subCategoryForm, setSubCategoryForm] = useState({
//     name: '', slug: '', description: ''
//   });
//   const [formErrors, setFormErrors] = useState({});

//   const categoryModal = useDisclosure();
//   const subCategoryModal = useDisclosure();
//   const deleteDialog = useDisclosure();
//   const deleteSubDialog = useDisclosure();

//   const filteredCategories = categories.filter(cat =>
//     cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalSubcategories = categories.reduce((sum, c) => sum + (c.subCategories?.length || 0), 0);
//   const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
//   const activeCategories = categories.filter(c => c.active).length;

//   const stats = [
//     { label: 'Total Categories', value: categories.length, sub: `${activeCategories} active`, Icon: FolderOpen, trend: 12, trendUp: true, color: 'blue' },
//     { label: 'Subcategories', value: totalSubcategories, sub: 'across all categories', Icon: Layers, color: 'purple' },
//     { label: 'Products Assigned', value: totalProducts, sub: 'total products', Icon: Package, trend: 8, trendUp: true, color: 'green' },
//     { label: 'Active Categories', value: activeCategories, sub: `${((activeCategories / categories.length) * 100) || 0}% of total`, Icon: CheckCircle, color: 'amber' },
//   ];

//   const toggleExpand = (catId) => {
//     setExpandedCategories(prev =>
//       prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
//     );
//   };

//   const expandAll = () => setExpandedCategories(categories.map(c => c.id));
//   const collapseAll = () => setExpandedCategories([]);

//   const handleAddCategory = () => {
//     setSelectedCategory(null);
//     setCategoryForm({ name: '', slug: '', description: '', icon: '📦', active: true });
//     setFormErrors({});
//     categoryModal.open();
//   };

//   const handleEditCategory = (category) => {
//     setSelectedCategory(category);
//     setCategoryForm({
//       name: category.name,
//       slug: category.slug,
//       description: category.description || '',
//       icon: category.icon || '📦',
//       active: category.active
//     });
//     setFormErrors({});
//     categoryModal.open();
//   };

//   const validateCategoryForm = () => {
//     const errors = {};
//     if (!categoryForm.name.trim()) errors.name = 'Category name is required';
//     if (!categoryForm.slug.trim()) errors.slug = 'Slug is required';
//     else if (!/^[a-z0-9-]+$/.test(categoryForm.slug)) {
//       errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
//     }
//     return errors;
//   };

//   const handleSaveCategory = () => {
//     const errors = validateCategoryForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     const categoryData = {
//       ...categoryForm,
//       subCategories: selectedCategory?.subCategories || []
//     };

//     if (selectedCategory) {
//       updateCategory({ ...selectedCategory, ...categoryData });
//     } else {
//       addCategory(categoryData);
//     }
//     categoryModal.close();
//   };

//   const handleDeleteCategory = (category) => {
//     setSelectedCategory(category);
//     deleteDialog.open();
//   };

//   const confirmDeleteCategory = () => {
//     if (selectedCategory) {
//       deleteCategory(selectedCategory.id);
//       deleteDialog.close();
//       setSelectedCategory(null);
//     }
//   };

//   const handleAddSubCategory = (category) => {
//     setSelectedCategory(category);
//     setSelectedSubCategory(null);
//     setSubCategoryForm({ name: '', slug: '', description: '' });
//     setFormErrors({});
//     subCategoryModal.open();
//   };

//   const handleEditSubCategory = (category, subCategory) => {
//     setSelectedCategory(category);
//     setSelectedSubCategory(subCategory);
//     setSubCategoryForm({
//       name: subCategory.name,
//       slug: subCategory.slug,
//       description: subCategory.description || ''
//     });
//     setFormErrors({});
//     subCategoryModal.open();
//   };

//   const validateSubCategoryForm = () => {
//     const errors = {};
//     if (!subCategoryForm.name.trim()) errors.name = 'Subcategory name is required';
//     if (!subCategoryForm.slug.trim()) errors.slug = 'Slug is required';
//     else if (!/^[a-z0-9-]+$/.test(subCategoryForm.slug)) {
//       errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
//     }
//     return errors;
//   };

//   const handleSaveSubCategory = () => {
//     const errors = validateSubCategoryForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     if (selectedSubCategory) {
//       updateSubCategory(selectedCategory.id, { ...selectedSubCategory, ...subCategoryForm });
//     } else {
//       addSubCategory(selectedCategory.id, subCategoryForm);
//     }
//     subCategoryModal.close();
//   };

//   const handleDeleteSubCategory = (category, subCategory) => {
//     setSelectedCategory(category);
//     setSelectedSubCategory(subCategory);
//     deleteSubDialog.open();
//   };

//   const confirmDeleteSubCategory = () => {
//     if (selectedCategory && selectedSubCategory) {
//       deleteSubCategory(selectedCategory.id, selectedSubCategory.id);
//       deleteSubDialog.close();
//       setSelectedCategory(null);
//       setSelectedSubCategory(null);
//     }
//   };

//   const generateSlug = (name) => {
//     return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
//   };

//   const handleNameChange = (value, isSub = false) => {
//     if (isSub) {
//       setSubCategoryForm(prev => ({ ...prev, name: value, slug: generateSlug(value) }));
//     } else {
//       setCategoryForm(prev => ({ ...prev, name: value, slug: generateSlug(value) }));
//     }
//   };

//   const iconOptions = ['📦', '⚖️', '🧪', '🔬', '🌡️', '💊', '🧬', '⚗️', '📊', '🛡️', '❄️', '🔥'];

//   return (
//     <div className="space-y-6 animate-fadeIn">
//       {/* Premium Welcome Banner */}
//       <div className="relative rounded-2xl overflow-hidden">
//         <div 
//           className="absolute inset-0"
//           style={{ 
//             background: 'linear-gradient(135deg, #0a1628 0%, #1e3a8a 50%, #0369a1 100%)',
//             boxShadow: '0 8px 32px rgba(10,22,40,0.2)'
//           }}
//         />
        
//         <div 
//           className="absolute inset-0 opacity-20"
//           style={{
//             background: 'radial-gradient(circle at 70% 30%, rgba(14,165,233,0.4) 0%, transparent 60%)',
//           }}
//         />
        
//         <div 
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
//             backgroundSize: '60px 60px',
//           }}
//         />

//         <div className="relative z-10 px-7 py-6 flex items-center justify-between gap-5 flex-wrap">
//           <div>
//             <div className="flex items-center gap-2 mb-3">
//               <span className="dot dot-purple animate-pulse2" />
//               <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
//                 Category Management
//               </span>
//               <Sparkles size={14} className="text-amber-400 ml-1" />
//             </div>
//             <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
//               Organize Your <span className="text-sky-400">Products</span>
//             </h2>
//             <p className="text-white/50 text-sm">
//               Manage categories and subcategories for your laboratory equipment
//             </p>
//           </div>

//           <div className="flex gap-3">
//             <button onClick={handleAddCategory} className="btn-primary !bg-white !text-blue-900 hover:!bg-white/90">
//               <Plus size={16} /> Add Category
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {stats.map(s => <StatCard key={s.label} {...s} />)}
//       </div>

//       {/* Search and Filters */}
//       <div className="card p-4">
//         <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search categories by name or slug..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="input pl-10"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
//               <button
//                 onClick={() => setViewMode('table')}
//                 className={`p-2 rounded-lg transition-all ${
//                   viewMode === 'table' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 <List size={16} />
//               </button>
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-2 rounded-lg transition-all ${
//                   viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 <Grid size={16} />
//               </button>
//             </div>
//             <button className="btn btn-secondary">
//               <Filter size={14} /> Filter
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Categories Display */}
//       {viewMode === 'table' ? (
//         <div className="card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="table-header">
//                 <tr>
//                   <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3 w-8"></th>
//                   <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Category</th>
//                   <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Slug</th>
//                   <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Subcategories</th>
//                   <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Products</th>
//                   <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
//                   <th className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filteredCategories.map((category) => {
//                   const isExpanded = expandedCategories.includes(category.id);
//                   const subCategories = category.subCategories || [];
                  
//                   return (
//                     <React.Fragment key={category.id}>
//                       <tr className="table-row">
//                         <td className="px-5 py-4">
//                           {subCategories.length > 0 && (
//                             <button
//                               onClick={() => toggleExpand(category.id)}
//                               className="p-1.5 hover:bg-slate-100 rounded-lg transition"
//                             >
//                               {isExpanded ? (
//                                 <ChevronDown size={16} className="text-slate-500" />
//                               ) : (
//                                 <ChevronRight size={16} className="text-slate-500" />
//                               )}
//                             </button>
//                           )}
//                         </td>
//                         <td className="px-5 py-4">
//                           <div className="flex items-center gap-3">
//                             <span className="text-2xl">{category.icon || '📦'}</span>
//                             <div>
//                               <p className="font-semibold text-slate-800">{category.name}</p>
//                               {category.description && (
//                                 <p className="text-xs text-slate-400 line-clamp-1">{category.description}</p>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-5 py-4">
//                           <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{category.slug}</code>
//                         </td>
//                         <td className="px-5 py-4">
//                           <span className="text-sm font-medium text-slate-600">{subCategories.length} items</span>
//                         </td>
//                         <td className="px-5 py-4">
//                           <span className="text-sm font-medium text-slate-600">{category.productCount || 0}</span>
//                         </td>
//                         <td className="px-5 py-4">
//                           <Toggle checked={category.active} onChange={() => toggleCatActive(category.id)} />
//                         </td>
//                         <td className="px-5 py-4 text-right">
//                           <div className="flex items-center justify-end gap-1">
//                             <button onClick={() => handleAddSubCategory(category)} className="btn-icon" title="Add Subcategory">
//                               <FolderPlus size={15} />
//                             </button>
//                             <button onClick={() => handleEditCategory(category)} className="btn-icon" title="Edit Category">
//                               <Edit size={15} />
//                             </button>
//                             <button onClick={() => handleDeleteCategory(category)} className="btn-icon hover:!text-red-500" title="Delete">
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>

//                       <AnimatePresence>
//                         {isExpanded && subCategories.map((sub) => (
//                           <motion.tr
//                             key={sub.id}
//                             initial={{ opacity: 0, backgroundColor: '#f8fafc' }}
//                             animate={{ opacity: 1, backgroundColor: '#f8fafc' }}
//                             exit={{ opacity: 0 }}
//                             className="bg-slate-50/80"
//                           >
//                             <td className="px-5 py-3"></td>
//                             <td className="px-5 py-3">
//                               <div className="flex items-center gap-3 pl-8">
//                                 <Tag size={14} className="text-slate-400" />
//                                 <div>
//                                   <p className="text-sm font-medium text-slate-700">{sub.name}</p>
//                                   {sub.description && (
//                                     <p className="text-xs text-slate-400">{sub.description}</p>
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-5 py-3">
//                               <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 font-mono">
//                                 {sub.slug}
//                               </code>
//                             </td>
//                             <td className="px-5 py-3">
//                               <span className="text-xs text-slate-400">—</span>
//                             </td>
//                             <td className="px-5 py-3">
//                               <span className="text-sm text-slate-600">{sub.productCount || 0}</span>
//                             </td>
//                             <td className="px-5 py-3">
//                               <Badge status={sub.active ? 'active' : 'hidden'} />
//                             </td>
//                             <td className="px-5 py-3 text-right">
//                               <div className="flex items-center justify-end gap-1">
//                                 <button onClick={() => handleEditSubCategory(category, sub)} className="btn-icon">
//                                   <Edit size={14} />
//                                 </button>
//                                 <button onClick={() => handleDeleteSubCategory(category, sub)} className="btn-icon hover:!text-red-500">
//                                   <Trash2 size={14} />
//                                 </button>
//                               </div>
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </AnimatePresence>
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {filteredCategories.length === 0 && (
//             <div className="text-center py-16">
//               <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
//                 <FolderOpen size={32} className="text-slate-400" />
//               </div>
//               <p className="text-lg font-medium text-slate-600">No categories found</p>
//               <p className="text-sm text-slate-400 mt-1">Click "Add Category" to create your first category</p>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {filteredCategories.map((category) => (
//             <motion.div
//               key={category.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="card p-5 group hover:shadow-lg transition-all"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <span className="text-3xl">{category.icon || '📦'}</span>
//                   <div>
//                     <h3 className="font-display text-lg font-bold text-slate-800">{category.name}</h3>
//                     <code className="text-xs text-slate-400">{category.slug}</code>
//                   </div>
//                 </div>
//                 <Toggle checked={category.active} onChange={() => toggleCatActive(category.id)} />
//               </div>
              
//               {category.description && (
//                 <p className="text-sm text-slate-500 mb-4">{category.description}</p>
//               )}
              
//               <div className="flex items-center gap-4 mb-4 text-sm">
//                 <div className="flex items-center gap-1 text-slate-500">
//                   <Layers size={14} />
//                   <span>{category.subCategories?.length || 0} subcategories</span>
//                 </div>
//                 <div className="flex items-center gap-1 text-slate-500">
//                   <Package size={14} />
//                   <span>{category.productCount || 0} products</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
//                 <button onClick={() => handleAddSubCategory(category)} className="btn btn-secondary flex-1">
//                   <FolderPlus size={14} /> Add Sub
//                 </button>
//                 <button onClick={() => handleEditCategory(category)} className="btn-icon">
//                   <Edit size={15} />
//                 </button>
//                 <button onClick={() => handleDeleteCategory(category)} className="btn-icon hover:!text-red-500">
//                   <Trash2 size={15} />
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Category Modal */}
//       <Modal isOpen={categoryModal.isOpen} onClose={categoryModal.close} title={selectedCategory ? 'Edit Category' : 'Create New Category'}>
//         <div className="p-6 space-y-4">
//           <div>
//             <label className="form-label">Category Name *</label>
//             <input
//               type="text"
//               value={categoryForm.name}
//               onChange={(e) => handleNameChange(e.target.value)}
//               placeholder="e.g., Laboratory Equipment"
//               className={`input ${formErrors.name ? 'input-error' : ''}`}
//             />
//             {formErrors.name && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <AlertCircle size={12} /> {formErrors.name}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="form-label">Slug *</label>
//             <input
//               type="text"
//               value={categoryForm.slug}
//               onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
//               placeholder="e.g., laboratory-equipment"
//               className={`input font-mono ${formErrors.slug ? 'input-error' : ''}`}
//             />
//             {formErrors.slug && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <AlertCircle size={12} /> {formErrors.slug}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="form-label">Description</label>
//             <textarea
//               value={categoryForm.description}
//               onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
//               rows={3}
//               placeholder="Brief description of this category"
//               className="textarea"
//             />
//           </div>

//           <div>
//             <label className="form-label">Icon</label>
//             <div className="grid grid-cols-6 gap-2">
//               {iconOptions.map((icon) => (
//                 <button
//                   key={icon}
//                   type="button"
//                   onClick={() => setCategoryForm({ ...categoryForm, icon })}
//                   className={`text-2xl p-2 rounded-lg border transition-all ${
//                     categoryForm.icon === icon
//                       ? 'border-blue-500 bg-blue-50 shadow-md'
//                       : 'border-slate-200 hover:border-slate-300'
//                   }`}
//                 >
//                   {icon}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 pt-2">
//             <input
//               type="checkbox"
//               id="catActive"
//               checked={categoryForm.active}
//               onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
//               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//             />
//             <label htmlFor="catActive" className="text-sm text-slate-700 font-medium">
//               Active (visible on website)
//             </label>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button onClick={categoryModal.close} className="btn btn-secondary flex-1">Cancel</button>
//             <button onClick={handleSaveCategory} className="btn btn-primary flex-1">
//               <Save size={14} /> {selectedCategory ? 'Update' : 'Create'} Category
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Subcategory Modal */}
//       <Modal isOpen={subCategoryModal.isOpen} onClose={subCategoryModal.close} title={selectedSubCategory ? 'Edit Subcategory' : `Add to ${selectedCategory?.name || ''}`}>
//         <div className="p-6 space-y-4">
//           <div>
//             <label className="form-label">Subcategory Name *</label>
//             <input
//               type="text"
//               value={subCategoryForm.name}
//               onChange={(e) => handleNameChange(e.target.value, true)}
//               placeholder="e.g., Analytical Balances"
//               className={`input ${formErrors.name ? 'input-error' : ''}`}
//             />
//             {formErrors.name && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <AlertCircle size={12} /> {formErrors.name}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="form-label">Slug *</label>
//             <input
//               type="text"
//               value={subCategoryForm.slug}
//               onChange={(e) => setSubCategoryForm({ ...subCategoryForm, slug: e.target.value })}
//               placeholder="e.g., analytical-balances"
//               className={`input font-mono ${formErrors.slug ? 'input-error' : ''}`}
//             />
//             {formErrors.slug && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <AlertCircle size={12} /> {formErrors.slug}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="form-label">Description</label>
//             <textarea
//               value={subCategoryForm.description}
//               onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
//               rows={2}
//               placeholder="Brief description"
//               className="textarea"
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button onClick={subCategoryModal.close} className="btn btn-secondary flex-1">Cancel</button>
//             <button onClick={handleSaveSubCategory} className="btn btn-primary flex-1">
//               <Save size={14} /> {selectedSubCategory ? 'Update' : 'Create'} Subcategory
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Delete Dialogs */}
//       <ConfirmDialog
//         isOpen={deleteDialog.isOpen}
//         onClose={deleteDialog.close}
//         onConfirm={confirmDeleteCategory}
//         title="Delete Category"
//         message={`Are you sure you want to delete "${selectedCategory?.name}"? This will also delete all subcategories and cannot be undone.`}
//         confirmLabel="Delete Category"
//         danger
//       />

//       <ConfirmDialog
//         isOpen={deleteSubDialog.isOpen}
//         onClose={deleteSubDialog.close}
//         onConfirm={confirmDeleteSubCategory}
//         title="Delete Subcategory"
//         message={`Are you sure you want to delete "${selectedSubCategory?.name}"? This cannot be undone.`}
//         confirmLabel="Delete Subcategory"
//         danger
//       />
//     </div>
//   );
// }


// src/pages/CategoriesPage.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Edit, Trash2, ChevronRight, ChevronDown,
  FolderOpen, FolderPlus, Tag, Eye, EyeOff, Save, X,
  AlertCircle, Package, Layers, Sparkles, TrendingUp,
  Grid, List, Filter, MoreVertical, CheckCircle, Clock,
  ArrowUp, ArrowDown, Zap, Star
} from 'lucide-react';
import { useAppData } from '../context/AppContext';

/* ─── Premium Stat Card ─── */
function StatCard({ label, value, sub, Icon, trend, trendUp, color }) {
  const gradients = {
    blue: 'from-blue-600 to-sky-500',
    amber: 'from-amber-500 to-orange-500',
    green: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-rose-500',
  };

  const bgColors = {
    blue: 'bg-blue-50',
    amber: 'bg-amber-50',
    green: 'bg-emerald-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
  };

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${bgColors[color]} flex items-center justify-center`}>
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg`}>
            <Icon size={18} className="text-white" />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          }`}>
            {trendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {trend}%
          </div>
        )}
      </div>
      <div className="font-display text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
      <div className="text-sm font-semibold text-slate-700 mt-1.5">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}

/* ─── Premium Modal ─── */
const Modal = ({ isOpen, onClose, title, maxWidth = '500px', children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-box" 
        style={{ maxWidth }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            {title}
          </h3>
          <button className="btn-icon !text-white/70 hover:!text-white hover:!bg-white/10" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

/* ─── Premium Confirm Dialog ─── */
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', danger = true }) => {
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="400px">
      <div className="p-6 flex flex-col items-center text-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
          danger ? 'bg-red-50' : 'bg-amber-50'
        }`}>
          <AlertCircle size={28} className={danger ? 'text-red-500' : 'text-amber-500'} />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3 w-full mt-2">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button
            className={`btn flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* ─── Premium Toggle ─── */
const Toggle = ({ checked, onChange }) => {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );
};

/* ─── Premium Badge ─── */
const Badge = ({ status, children }) => {
  const getBadgeClass = (s) => {
    const map = {
      active: 'badge-green',
      hidden: 'badge-slate',
      pending: 'badge-amber',
      replied: 'badge-green',
    };
    return map[s] || 'badge-slate';
  };
  
  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {children || status}
    </span>
  );
};

/* ─── Custom Hook ─── */
const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(v => !v);
  return { isOpen, open, close, toggle };
};

/* ─── Main Component ─── */
export function CategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCatActive,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useAppData();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  
  const [categoryForm, setCategoryForm] = useState({
    name: '', slug: '', description: '', icon: '📦', active: true
  });
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '', slug: '', description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const categoryModal = useDisclosure();
  const subCategoryModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const deleteSubDialog = useDisclosure();

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSubcategories = categories.reduce((sum, c) => sum + (c.subCategories?.length || 0), 0);
  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
  const activeCategories = categories.filter(c => c.active).length;

  const stats = [
    { label: 'Total Categories', value: categories.length, sub: `${activeCategories} active`, Icon: FolderOpen, trend: 12, trendUp: true, color: 'blue' },
    { label: 'Subcategories', value: totalSubcategories, sub: 'across all categories', Icon: Layers, color: 'purple' },
    { label: 'Products Assigned', value: totalProducts, sub: 'total products', Icon: Package, trend: 8, trendUp: true, color: 'green' },
    { label: 'Active Categories', value: activeCategories, sub: `${((activeCategories / categories.length) * 100) || 0}% of total`, Icon: CheckCircle, color: 'amber' },
  ];

  const toggleExpand = (catId) => {
    setExpandedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const expandAll = () => setExpandedCategories(categories.map(c => c.id));
  const collapseAll = () => setExpandedCategories([]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryForm({ name: '', slug: '', description: '', icon: '📦', active: true });
    setFormErrors({});
    categoryModal.open();
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '📦',
      active: category.active
    });
    setFormErrors({});
    categoryModal.open();
  };

  const validateCategoryForm = () => {
    const errors = {};
    if (!categoryForm.name.trim()) errors.name = 'Category name is required';
    if (!categoryForm.slug.trim()) errors.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(categoryForm.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    return errors;
  };

  const handleSaveCategory = () => {
    const errors = validateCategoryForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const categoryData = {
      ...categoryForm,
      subCategories: selectedCategory?.subCategories || []
    };

    if (selectedCategory) {
      updateCategory({ ...selectedCategory, ...categoryData });
    } else {
      addCategory(categoryData);
    }
    categoryModal.close();
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    deleteDialog.open();
  };

  const confirmDeleteCategory = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
      deleteDialog.close();
      setSelectedCategory(null);
    }
  };

  const handleAddSubCategory = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setSubCategoryForm({ name: '', slug: '', description: '' });
    setFormErrors({});
    subCategoryModal.open();
  };

  const handleEditSubCategory = (category, subCategory) => {
    setSelectedCategory(category);
    setSelectedSubCategory(subCategory);
    setSubCategoryForm({
      name: subCategory.name,
      slug: subCategory.slug,
      description: subCategory.description || ''
    });
    setFormErrors({});
    subCategoryModal.open();
  };

  const validateSubCategoryForm = () => {
    const errors = {};
    if (!subCategoryForm.name.trim()) errors.name = 'Subcategory name is required';
    if (!subCategoryForm.slug.trim()) errors.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(subCategoryForm.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    return errors;
  };

  const handleSaveSubCategory = () => {
    const errors = validateSubCategoryForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (selectedSubCategory) {
      updateSubCategory(selectedCategory.id, { ...selectedSubCategory, ...subCategoryForm });
    } else {
      addSubCategory(selectedCategory.id, subCategoryForm);
    }
    subCategoryModal.close();
  };

  const handleDeleteSubCategory = (category, subCategory) => {
    setSelectedCategory(category);
    setSelectedSubCategory(subCategory);
    deleteSubDialog.open();
  };

  const confirmDeleteSubCategory = () => {
    if (selectedCategory && selectedSubCategory) {
      deleteSubCategory(selectedCategory.id, selectedSubCategory.id);
      deleteSubDialog.close();
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (value, isSub = false) => {
    if (isSub) {
      setSubCategoryForm(prev => ({ ...prev, name: value, slug: generateSlug(value) }));
    } else {
      setCategoryForm(prev => ({ ...prev, name: value, slug: generateSlug(value) }));
    }
  };

  const iconOptions = ['📦', '⚖️', '🧪', '🔬', '🌡️', '💊', '🧬', '⚗️', '📊', '🛡️', '❄️', '🔥'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Premium Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #0a1628 0%, #1e3a8a 50%, #0369a1 100%)',
            boxShadow: '0 8px 32px rgba(10,22,40,0.2)'
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(14,165,233,0.4) 0%, transparent 60%)',
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 px-7 py-6 flex items-center justify-between gap-5 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="dot dot-purple animate-pulse2" />
              <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
                Category Management
              </span>
              <Sparkles size={14} className="text-amber-400 ml-1" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
              Organize Your <span className="text-sky-400">Products</span>
            </h2>
            <p className="text-white/50 text-sm">
              Manage categories and subcategories for your laboratory equipment
            </p>
          </div>

          <button 
            onClick={handleAddCategory} 
            className="relative group overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 text-blue-900">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-display font-bold tracking-wide">Add New Category</span>
              <Sparkles size={14} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Grid size={16} />
              </button>
            </div>
            <button className="btn btn-secondary">
              <Filter size={14} /> Filter
            </button>
            <button onClick={expandAll} className="btn btn-secondary hidden sm:flex">
              <ChevronDown size={14} /> Expand All
            </button>
            <button onClick={collapseAll} className="btn btn-secondary hidden sm:flex">
              <ChevronRight size={14} /> Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Categories Display */}
      {viewMode === 'table' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3 w-8"></th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Category</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Slug</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Subcategories</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Products</th>
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((category) => {
                  const isExpanded = expandedCategories.includes(category.id);
                  const subCategories = category.subCategories || [];
                  
                  return (
                    <React.Fragment key={category.id}>
                      <tr 
                        className="table-row cursor-pointer hover:bg-slate-50/80"
                        onClick={() => toggleExpand(category.id)}
                      >
                        <td className="px-5 py-4">
                          {subCategories.length > 0 && (
                            <span className="p-1.5">
                              {isExpanded ? (
                                <ChevronDown size={16} className="text-blue-500" />
                              ) : (
                                <ChevronRight size={16} className="text-slate-400" />
                              )}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon || '📦'}</span>
                            <div>
                              <p className="font-semibold text-slate-800">{category.name}</p>
                              {category.description && (
                                <p className="text-xs text-slate-400 line-clamp-1">{category.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{category.slug}</code>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-slate-600">{subCategories.length} items</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-slate-600">{category.productCount || 0}</span>
                        </td>
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <Toggle checked={category.active} onChange={() => toggleCatActive(category.id)} />
                        </td>
                        <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleAddSubCategory(category)} 
                              className="btn-secondary !px-3 !py-1.5 text-xs"
                              title="Add Subcategory"
                            >
                              <FolderPlus size={14} /> Add Sub
                            </button>
                            <button onClick={() => handleEditCategory(category)} className="btn-icon" title="Edit Category">
                              <Edit size={15} />
                            </button>
                            <button onClick={() => handleDeleteCategory(category)} className="btn-icon hover:!text-red-500" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Subcategories Dropdown */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gradient-to-r from-slate-50 to-blue-50/30"
                          >
                            <td colSpan={7} className="px-0 py-0">
                              <div className="px-8 py-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Layers size={12} />
                                    Subcategories for {category.name}
                                  </h4>
                                  <button 
                                    onClick={() => handleAddSubCategory(category)}
                                    className="btn-primary !py-1.5 !px-3 !text-xs"
                                  >
                                    <Plus size={12} /> Add Subcategory
                                  </button>
                                </div>
                                
                                {subCategories.length > 0 ? (
                                  <div className="space-y-2">
                                    {subCategories.map((sub) => (
                                      <div 
                                        key={sub.id}
                                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Tag size={14} className="text-blue-500" />
                                          <div>
                                            <p className="text-sm font-medium text-slate-800">{sub.name}</p>
                                            <code className="text-xs text-slate-400">{sub.slug}</code>
                                          </div>
                                          <Badge status={sub.active ? 'active' : 'hidden'} />
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Package size={12} /> {sub.productCount || 0} products
                                          </span>
                                          <div className="flex items-center gap-1">
                                            <button 
                                              onClick={() => handleEditSubCategory(category, sub)} 
                                              className="btn-icon"
                                            >
                                              <Edit size={13} />
                                            </button>
                                            <button 
                                              onClick={() => handleDeleteSubCategory(category, sub)} 
                                              className="btn-icon hover:!text-red-500"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
                                    <FolderOpen size={24} className="text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">No subcategories yet</p>
                                    <button 
                                      onClick={() => handleAddSubCategory(category)}
                                      className="mt-3 btn-secondary !text-xs !py-1.5"
                                    >
                                      <Plus size={12} /> Add First Subcategory
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FolderOpen size={32} className="text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-600">No categories found</p>
              <p className="text-sm text-slate-400 mt-1">Click "Add New Category" to create your first category</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5 group hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon || '📦'}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-800">{category.name}</h3>
                    <code className="text-xs text-slate-400">{category.slug}</code>
                  </div>
                </div>
                <Toggle checked={category.active} onChange={() => toggleCatActive(category.id)} />
              </div>
              
              {category.description && (
                <p className="text-sm text-slate-500 mb-4">{category.description}</p>
              )}
              
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-slate-500">
                  <Layers size={14} />
                  <span>{category.subCategories?.length || 0} subcategories</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Package size={14} />
                  <span>{category.productCount || 0} products</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => handleAddSubCategory(category)} className="btn btn-secondary flex-1">
                  <FolderPlus size={14} /> Add Sub
                </button>
                <button onClick={() => handleEditCategory(category)} className="btn-icon">
                  <Edit size={15} />
                </button>
                <button onClick={() => handleDeleteCategory(category)} className="btn-icon hover:!text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <Modal isOpen={categoryModal.isOpen} onClose={categoryModal.close} title={selectedCategory ? 'Edit Category' : 'Create New Category'}>
        <div className="p-6 space-y-4">
          <div>
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Laboratory Equipment"
              className={`input ${formErrors.name ? 'input-error' : ''}`}
            />
            {formErrors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Slug *</label>
            <input
              type="text"
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              placeholder="e.g., laboratory-equipment"
              className={`input font-mono ${formErrors.slug ? 'input-error' : ''}`}
            />
            {formErrors.slug && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {formErrors.slug}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              rows={3}
              placeholder="Brief description of this category"
              className="textarea"
            />
          </div>

          <div>
            <label className="form-label">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setCategoryForm({ ...categoryForm, icon })}
                  className={`text-2xl p-2 rounded-lg border transition-all ${
                    categoryForm.icon === icon
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="catActive"
              checked={categoryForm.active}
              onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="catActive" className="text-sm text-slate-700 font-medium">
              Active (visible on website)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={categoryModal.close} className="btn btn-secondary flex-1">Cancel</button>
            <button onClick={handleSaveCategory} className="btn btn-primary flex-1">
              <Save size={14} /> {selectedCategory ? 'Update' : 'Create'} Category
            </button>
          </div>
        </div>
      </Modal>

      {/* Subcategory Modal */}
      <Modal isOpen={subCategoryModal.isOpen} onClose={subCategoryModal.close} title={selectedSubCategory ? 'Edit Subcategory' : `Add to ${selectedCategory?.name || ''}`}>
        <div className="p-6 space-y-4">
          <div>
            <label className="form-label">Subcategory Name *</label>
            <input
              type="text"
              value={subCategoryForm.name}
              onChange={(e) => handleNameChange(e.target.value, true)}
              placeholder="e.g., Analytical Balances"
              className={`input ${formErrors.name ? 'input-error' : ''}`}
            />
            {formErrors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Slug *</label>
            <input
              type="text"
              value={subCategoryForm.slug}
              onChange={(e) => setSubCategoryForm({ ...subCategoryForm, slug: e.target.value })}
              placeholder="e.g., analytical-balances"
              className={`input font-mono ${formErrors.slug ? 'input-error' : ''}`}
            />
            {formErrors.slug && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {formErrors.slug}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              value={subCategoryForm.description}
              onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
              rows={2}
              placeholder="Brief description"
              className="textarea"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={subCategoryModal.close} className="btn btn-secondary flex-1">Cancel</button>
            <button onClick={handleSaveSubCategory} className="btn btn-primary flex-1">
              <Save size={14} /> {selectedSubCategory ? 'Update' : 'Create'} Subcategory
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Dialogs */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This will also delete all subcategories and cannot be undone.`}
        confirmLabel="Delete Category"
        danger
      />

      <ConfirmDialog
        isOpen={deleteSubDialog.isOpen}
        onClose={deleteSubDialog.close}
        onConfirm={confirmDeleteSubCategory}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${selectedSubCategory?.name}"? This cannot be undone.`}
        confirmLabel="Delete Subcategory"
        danger
      />
    </div>
  );
}