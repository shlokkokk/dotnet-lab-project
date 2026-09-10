import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, isDanger = false }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onCancel}
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0, 0, 0, 0.75)', 
        zIndex: 2000, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px', 
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="card-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          padding: '24px', 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-strong)', 
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: 'var(--radius-sm)', 
            background: isDanger ? 'rgba(244, 63, 94, 0.15)' : 'rgba(2, 132, 199, 0.15)',
            color: isDanger ? 'var(--accent-rose)' : 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: isDanger ? '0 2px 8px rgba(244, 63, 94, 0.2)' : '0 2px 8px rgba(2, 132, 199, 0.2)'
          }}>
            {isDanger ? <AlertTriangle size={20} /> : <Info size={20} />}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
          <button onClick={onCancel} className="btn btn-sm btn-outline" style={{ padding: '4px', border: 'none' }} title="Close dialog">
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: '0.8125rem', padding: '7px 14px' }}>
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
            style={{ fontSize: '0.8125rem', padding: '7px 16px' }}
            autoFocus
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
