// src/context/AppContext.js - Add these functions
import React, { createContext, useContext, useState } from 'react';
import { CONTACT_FORMS, QUOTE_REQUESTS, CATEGORIES, PRODUCTS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [contacts, setContacts] = useState(CONTACT_FORMS);
  const [quotes, setQuotes] = useState(QUOTE_REQUESTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [products, setProducts] = useState(PRODUCTS);

  // Contact functions
  const markContactRead = (id) => setContacts(p => p.map(c => c.id === id ? { ...c, read: true } : c));
  const updateContactStatus = (id, status) => setContacts(p => p.map(c => c.id === id ? { ...c, status } : c));
  const deleteContact = (id) => setContacts(p => p.filter(c => c.id !== id));

  // Quote functions
  const updateQuoteStatus = (id, status) => setQuotes(p => p.map(q => q.id === id ? { ...q, status } : q));
  const deleteQuote = (id) => setQuotes(p => p.filter(q => q.id !== id));

  // Category functions
  const addCategory = (cat) => setCategories(p => [...p, { ...cat, id: Date.now(), subCategories: [], productCount: 0 }]);
  const updateCategory = (cat) => setCategories(p => p.map(c => c.id === cat.id ? { ...c, ...cat } : c));
  const deleteCategory = (id) => setCategories(p => p.filter(c => c.id !== id));
  const toggleCatActive = (id) => setCategories(p => p.map(c => c.id === id ? { ...c, active: !c.active } : c));

  // Subcategory functions
  const addSubCategory = (catId, sub) => {
    setCategories(p => p.map(c => c.id === catId
      ? { ...c, subCategories: [...(c.subCategories || []), { ...sub, id: Date.now(), active: true, productCount: 0 }] }
      : c
    ));
  };

  const updateSubCategory = (catId, sub) => {
    setCategories(p => p.map(c => c.id === catId
      ? { ...c, subCategories: c.subCategories?.map(s => s.id === sub.id ? { ...s, ...sub } : s) }
      : c
    ));
  };

  const deleteSubCategory = (catId, subId) => {
    setCategories(p => p.map(c => c.id === catId
      ? { ...c, subCategories: c.subCategories?.filter(s => s.id !== subId) }
      : c
    ));
  };

  // Product functions
  const addProduct = (prod) => setProducts(p => [...p, { ...prod, id: Date.now() }]);
  const updateProduct = (prod) => setProducts(p => p.map(x => x.id === prod.id ? { ...x, ...prod } : x));
  const deleteProduct = (id) => setProducts(p => p.filter(x => x.id !== id));
  const toggleProductStatus = (id) => setProducts(p => p.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'hidden' : 'active' } : x));
  const toggleProductStock = (id) => setProducts(p => p.map(x => x.id === id ? { ...x, inStock: !x.inStock } : x));
  const toggleProductFeatured = (id) => setProducts(p => p.map(x => x.id === id ? { ...x, featured: !x.featured } : x));

  return (
    <AppContext.Provider value={{
      contacts, markContactRead, updateContactStatus, deleteContact,
      quotes, updateQuoteStatus, deleteQuote,
      categories, addCategory, updateCategory, deleteCategory, toggleCatActive,
      addSubCategory, updateSubCategory, deleteSubCategory,
      products, addProduct, updateProduct, deleteProduct,
      toggleProductStatus, toggleProductStock, toggleProductFeatured,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppData = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used inside AppProvider');
  return ctx;
};