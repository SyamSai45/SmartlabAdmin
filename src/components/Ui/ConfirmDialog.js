// src/components/ui/ConfirmDialog.js
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', danger = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="380px">
      <div className="p-6 flex flex-col items-center text-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
          <AlertTriangle size={26} className={danger ? 'text-red-500' : 'text-amber-500'} />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3 w-full">
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
}