// src/components/layout/AppLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false); // Auto-close on desktop if needed
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location?.pathname, isMobile]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header onMenuClick={() => setSidebarOpen(v => !v)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;