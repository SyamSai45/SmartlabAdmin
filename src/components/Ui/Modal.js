// src/components/ui/Modal.js
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, maxWidth = '480px', children }) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={17} className="text-white/70 hover:text-white" />
          </button>
        </div>
        {/* Body */}
        {children}
      </div>
    </div>
  );
}