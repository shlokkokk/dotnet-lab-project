import React, { useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="card-panel fade-up"
        style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--bg-secondary)',
          border: `1px solid ${isDanger ? 'rgba(244,63,94,0.22)' : 'var(--border-medium)'}`,
          boxShadow: isDanger
            ? 'var(--shadow-lg), 0 0 40px rgba(244,63,94,0.12)'
            : 'var(--shadow-lg), var(--shadow-glow-cyan)',
          overflow: 'hidden'
        }}
      >
        {/* Top color bar */}
        <div style={{
          height: '3px',
          background: isDanger
            ? 'linear-gradient(90deg, var(--accent-rose), #fb7185)'
            : 'linear-gradient(90deg, var(--accent-blue), var(--accent-indigo))'
        }} />

        <div style={{ padding: '22px 22px 20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px', flexShrink: 0,
              borderRadius: 'var(--r-sm)',
              background: isDanger ? 'rgba(244,63,94,0.12)' : 'rgba(56,189,248,0.1)',
              color: isDanger ? 'var(--accent-rose)' : 'var(--accent-cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isDanger ? '0 2px 8px rgba(244,63,94,0.18)' : '0 2px 8px rgba(56,189,248,0.15)'
            }}>
              {isDanger ? <AlertTriangle size={19} /> : <Info size={19} />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {message}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="btn btn-outline btn-icon-sm"
              title="Close"
              style={{ flexShrink: 0, marginTop: '-2px' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={onCancel} className="btn btn-outline btn-sm">
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`btn btn-sm ${isDanger ? 'btn-danger' : 'btn-primary'}`}
              autoFocus
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
