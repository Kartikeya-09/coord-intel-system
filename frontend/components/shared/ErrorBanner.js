import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl backdrop-blur-sm text-sm">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
