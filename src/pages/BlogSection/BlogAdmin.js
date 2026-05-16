// src/components/admin/BlogsAdmin.js
import React, { useState } from 'react';
import { BlogHero } from './BlogHero';
import { BlogList } from './BlogList';
import { BlogForm } from './BlogForm';
import { motion } from "framer-motion";

export function BlogsAdmin() {
  const [activeTab, setActiveTab] = useState('hero');
  const [editingBlog, setEditingBlog] = useState(null);

  const tabs = [
    { id: 'hero', label: 'Blog Hero', icon: '🌟' },
    { id: 'blogs', label: 'All Blogs', icon: '📝' },
    { id: 'create', label: editingBlog ? 'Edit Blog' : 'Create Blog', icon: editingBlog ? '✏️' : '➕' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-2xl">
        <div className="flex gap-1 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'create') setEditingBlog(null);
              }}
              className={`px-6 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'hero' && <BlogHero />}
        {activeTab === 'blogs' && <BlogList onEdit={(blog) => { setEditingBlog(blog); setActiveTab('create'); }} />}
        {activeTab === 'create' && (
          <BlogForm 
            blog={editingBlog} 
            onSuccess={() => { setActiveTab('blogs'); setEditingBlog(null); }} 
            onCancel={() => { setActiveTab('blogs'); setEditingBlog(null); }} 
          />
        )}
      </div>
    </div>
  );
}