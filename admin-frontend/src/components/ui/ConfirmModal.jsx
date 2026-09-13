import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Prevent clicking outside to close while loading */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[var(--surface-color)] rounded-2xl shadow-xl w-full max-w-md border border-[var(--border-color)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-color)]">{title}</h3>
            </div>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-[var(--text-muted)]">{message}</p>
          
          <div className="mt-8 flex items-center justify-end gap-3">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg font-medium border border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;