import React, { useState } from 'react';
import { Terminal, X, Code2, Copy, Check, Database, Trash2, Cpu, ArrowLeft } from 'lucide-react';
import { clearAdoLogs } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function AdoNetInspectorModal({ isOpen, onClose, logs, onLogsUpdated }) {
  const [selectedLanguage, setSelectedLanguage] = useState('csharp'); // 'csharp' or 'vb'
  const [selectedLogIndex, setSelectedLogIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mobileView, setMobileView] = useState('detail'); // 'list' | 'detail'

  if (!isOpen) return null;

  const currentLog = logs[selectedLogIndex] || logs[0];

  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  const executeConfirmedClear = () => {
    setShowClearConfirm(false);
    clearAdoLogs();
    onLogsUpdated();
  };

  const handleCopyCode = () => {
    if (!currentLog) return;
    const code = selectedLanguage === 'csharp' ? currentLog.csharpCode : currentLog.vbCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <div 
        className="card-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '820px', 
          height: '100vh', 
          borderRadius: 0, 
          borderRight: 'none', 
          borderTop: 'none', 
          borderBottom: 'none', 
          display: 'flex', 
          flexDirection: 'column', 
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Modal Top Bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
              <Terminal size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ADO.NET Execution Trace
              </h3>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Live SQL Data Architecture Inspector
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {logs.length > 0 && (
              <button onClick={handleClearClick} className="btn btn-sm btn-outline" title="Clear transaction logs">
                <Trash2 size={13} />
                Clear
              </button>
            )}
            <button onClick={onClose} className="btn btn-sm btn-outline" style={{ padding: '6px' }} title="Close modal">
              <X size={16} />
            </button>
          </div>
        </div>

        {logs.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
            <Cpu size={44} style={{ color: 'var(--text-muted)', marginBottom: '14px', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 700 }}>
              No Active Database Operations Logged
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', maxWidth: '380px' }}>
              Perform actions like Submitting Registration, Signing In, or Adding Feedback to inspect their ADO.NET pipeline.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
            
            {/* Left Drawer: Operation History List */}
            <div 
              className="inspector-list-col"
              style={{ width: '280px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', overflowY: 'auto' }}
            >
              <div style={{ padding: '12px 16px', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <span>EXECUTION LOG</span>
                <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>{logs.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {logs.map((log, idx) => (
                  <button
                    key={log.id}
                    onClick={() => {
                      setSelectedLogIndex(idx);
                      setMobileView('detail');
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: selectedLogIndex === idx ? 'var(--bg-secondary)' : 'transparent',
                      cursor: 'pointer',
                      borderLeft: selectedLogIndex === idx ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: selectedLogIndex === idx ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '3px' }}>
                      {log.title}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.675rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      <span className="badge badge-slate" style={{ fontSize: '0.625rem', padding: '1px 5px' }}>{log.type}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel: Code & Parameter Inspector */}
            <div 
              className="inspector-detail-col"
              style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '20px' }}
            >
              {currentLog && (
                <>
                  {/* Operation Meta Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-blue">{currentLog.type}</span>
                        <span className="badge badge-slate">[{currentLog.table}]</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                        {currentLog.title}
                      </h4>
                    </div>

                    {/* Language Switcher */}
                    <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => setSelectedLanguage('csharp')}
                        className={`btn btn-sm ${selectedLanguage === 'csharp' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '5px 12px', fontSize: '0.75rem', border: 'none' }}
                      >
                        C# Backend
                      </button>
                      <button
                        onClick={() => setSelectedLanguage('vb')}
                        className={`btn btn-sm ${selectedLanguage === 'vb' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '5px 12px', fontSize: '0.75rem', border: 'none' }}
                      >
                        VB.NET Backend
                      </button>
                    </div>
                  </div>

                  {/* Code snippet block */}
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '9px 14px', borderTopLeftRadius: 'var(--radius-sm)', borderTopRightRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', borderBottom: 'none' }}>
                      <span style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {selectedLanguage === 'csharp' ? 'System.Data.SqlClient (C#)' : 'System.Data.SqlClient (VB.NET)'}
                      </span>
                      <button onClick={handleCopyCode} className="btn btn-sm btn-outline" style={{ padding: '3px 8px', fontSize: '0.725rem' }}>
                        {copied ? <Check size={12} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={12} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <pre style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.785rem', 
                      background: 'var(--bg-primary)', 
                      padding: '16px', 
                      borderBottomLeftRadius: 'var(--radius-sm)', 
                      borderBottomRightRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--border-subtle)', 
                      color: '#38bdf8', 
                      overflowX: 'auto',
                      lineHeight: 1.6 
                    }}>
                      {selectedLanguage === 'csharp' ? currentLog.csharpCode : currentLog.vbCode}
                    </pre>
                  </div>

                  {/* Parameter Bindings */}
                  {currentLog.parameters && Object.keys(currentLog.parameters).length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                        PARAMETER VALUES BOUND AT RUNTIME:
                      </div>
                      <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                        {Object.entries(currentLog.parameters).map(([key, val]) => (
                          <div key={key} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                            <span style={{ color: 'var(--accent-cyan)' }}>@{key}:</span>{' '}
                            <span style={{ color: 'var(--text-secondary)' }}>"{String(val)}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Clear Logs Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Execution Logs"
        message="Are you sure you want to clear all active ADO.NET and backend transaction traces?"
        confirmText="Yes, Clear"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={executeConfirmedClear}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
