// src/pages/admin/ApplicationPageManager.jsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, Image, Grid, Layers, Megaphone 
} from 'lucide-react';
import { ApplicationHero } from './ApplicationHero';
import { ApplicationMainCards } from './ApplicationMainCards';
import { ApplicationServices } from './ApplicationServices';
import { ApplicationCTA } from './ApplicationCTA';

const tabs = [
  { id: 'hero', label: 'Hero Sections', icon: Image },
  { id: 'mainCards', label: 'Main Cards', icon: Grid },
  { id: 'services', label: 'Services', icon: Layers },
  { id: 'cta', label: 'CTA Sections', icon: Megaphone },
];

export function ApplicationPageManager() {
  const [activeTab, setActiveTab] = useState('hero');

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return <ApplicationHero />;
      case 'mainCards':
        return <ApplicationMainCards />;
      case 'services':
        return <ApplicationServices />;
      case 'cta':
        return <ApplicationCTA />;
      default:
        return <ApplicationHero />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4">
            <LayoutDashboard className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Application Page Manager</h1>
          </div>
          
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
}