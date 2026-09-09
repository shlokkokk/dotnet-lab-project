import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Terminal, 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  RotateCcw, 
  Radio, 
  ChevronRight, 
  ChevronDown, 
  X,
  Layers,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { backendCategories } from '../data/backendCodeData';
import { checkServerHealth, fetchUsers, fetchFeedback, getAdoLogs, clearAdoLogs } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function BackendExplorerView() {
  const [activeTab, setActiveTab] = useState('console'); // 'console' | 'code'
  
  // Console state
  const [liveLogs, setLiveLogs] = useState([]);
  const [serverOnline, setServerOnline] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Code IDE state
  const [activeFileId, setActiveFileId] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);

  const allFiles = backendCategories.flatMap((c) => c.files);
  const activeFile = allFiles.find((f) => f.id === activeFileId);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2500);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const health = await checkServerHealth();
    setServerOnline(!!health);
    const logs = getAdoLogs();
    setLiveLogs(logs);
  };

  const handleOpenFile = (fileId) => {
    if (!openTabs.includes(fileId)) {
      setOpenTabs((prev) => [...prev, fileId]);
    }
    setActiveFileId(fileId);
  };

  const handleCloseTab = (e, fileId) => {
    e.stopPropagation();
    const nextTabs = openTabs.filter((id) => id !== fileId);
    setOpenTabs(nextTabs);
    if (activeFileId === fileId) {
      setActiveFileId(nextTabs.length > 0 ? nextTabs[nextTabs.length - 1] : null);
    }
  };

  const executeConfirmedClear = () => {
    setShowClearConfirm(false);
    clearAdoLogs();
    setLiveLogs([]);
    setExpandedLogId(null);
  };

  const executeConfirmedCopy = () => {
    setShowCopyConfirm(false);
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Clean Header */}
      <div className="card-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: 'var(--radius-sm)', 
            background: 'rgba(2, 132, 199, 0.15)', 
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Server size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Backend System &amp; Live Server
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: serverOnline ? '#10b981' : '#64748b' 
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {serverOnline ? 'ASP.NET Core Engine (Port 5000) Live' : 'Offline Client Mode'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>&bull;</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                academic_portal.db
              </span>
            </div>
          </div>
        </div>

        {/* Top Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('console')}
            className={`btn btn-sm ${activeTab === 'console' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
          >
            <Activity size={14} />
            Live Execution Logs
            {liveLogs.length > 0 && (
              <span className="badge badge-slate" style={{ fontSize: '0.625rem', padding: '1px 5px' }}>
                {liveLogs.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('code')}
            className={`btn btn-sm ${activeTab === 'code' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
          >
            <Code2 size={14} />
            Source Files
            {openTabs.length > 0 && (
              <span className="badge badge-cyan" style={{ fontSize: '0.625rem', padding: '1px 5px' }}>
                {openTabs.length}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* TAB 1: LIVE SERVER EXECUTION CONSOLE */}
      {activeTab === 'console' && (
        <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
          
          <div style={{ padding: '14px 18px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Real-Time Database &amp; API Event Feed
              </span>
            </div>

            {liveLogs.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                <RotateCcw size={12} />
                Clear Logs
              </button>
            )}
          </div>

          {liveLogs.length === 0 ? (
            <div style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Radio size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Server is idle and waiting for incoming requests
              </div>
              <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                Submit a new student registration, log in, or leave feedback to watch database transactions stream live.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {liveLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <div 
                    key={log.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-subtle)', 
                      background: isExpanded ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div 
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      style={{ 
                        padding: '12px 18px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`badge ${log.type?.includes('INSERT') ? 'badge-emerald' : log.type?.includes('SELECT') ? 'badge-blue' : 'badge-amber'}`} style={{ fontSize: '0.675rem' }}>
                          {log.type}
                        </span>
                        <div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {log.title}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
                            [{log.table}]
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {log.timestamp}
                        </span>
                        <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '0 18px 16px 18px' }}>
                        <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                            EXECUTED ADO.NET CODE BLOCK:
                          </div>
                          <pre style={{ 
                            margin: 0, 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '0.765rem', 
                            color: '#38bdf8', 
                            overflowX: 'auto',
                            lineHeight: 1.5 
                          }}>
                            {log.csharpCode || '// Command executed successfully.'}
                          </pre>

                          {log.parameters && Object.keys(log.parameters).length > 0 && (
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                                RUNTIME PARAMETERS:
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {Object.entries(log.parameters).map(([k, v]) => (
                                  <span key={k} className="badge badge-slate" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                                    @{k} = "{String(v)}"
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: CLEAN SOURCE CODE WORKSPACE */}
      {activeTab === 'code' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) 1fr', gap: '16px', alignItems: 'start' }}>
          
          {/* File Tree */}
          <div className="card-panel" style={{ padding: '14px', background: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
              SOLUTION FILES
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {allFiles.map((file) => {
                const isSelected = activeFileId === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => handleOpenFile(file.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(2, 132, 199, 0.2)' : 'transparent',
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.785rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <FileCode size={13} style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{file.name}</span>
                    </div>
                    <span className="badge badge-slate" style={{ fontSize: '0.625rem', padding: '1px 4px' }}>
                      {file.language}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="card-panel" style={{ padding: 0, overflow: 'hidden', minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Editor Tab Bar */}
            <div style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
              {openTabs.length === 0 ? (
                <div style={{ padding: '8px 14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  No open files
                </div>
              ) : (
                openTabs.map((tabId) => {
                  const file = allFiles.find((f) => f.id === tabId);
                  if (!file) return null;
                  const isActive = activeFileId === tabId;
                  return (
                    <div
                      key={tabId}
                      onClick={() => setActiveFileId(tabId)}
                      style={{
                        padding: '8px 12px',
                        background: isActive ? 'var(--bg-primary)' : 'transparent',
                        borderRight: '1px solid var(--border-subtle)',
                        borderTop: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontSize: '0.775rem',
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        userSelect: 'none'
                      }}
                    >
                      <span>{file.name}</span>
                      <button
                        onClick={(e) => handleCloseTab(e, tabId)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '1px', display: 'flex' }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Active Code or Empty Canvas */}
            {activeFile ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ padding: '8px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {activeFile.path}
                  </span>
                  <button 
                    onClick={() => setShowCopyConfirm(true)} 
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '0.725rem', padding: '3px 8px' }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy Code'}
                  </button>
                </div>

                <div style={{ display: 'flex', flex: 1, background: 'var(--bg-primary)', overflowX: 'auto', maxHeight: '500px' }}>
                  <div style={{ padding: '14px 10px', background: 'rgba(0,0,0,0.15)', borderRight: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.55, textAlign: 'right', userSelect: 'none' }}>
                    {activeFile.code.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  <pre style={{ margin: 0, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.55, color: '#38bdf8', flex: 1, overflowX: 'auto', whiteSpace: 'pre' }}>
                    {activeFile.code}
                  </pre>
                </div>
              </div>
            ) : (
              <div style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
                <FileCode size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  No Source File Open
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '340px', marginBottom: '16px' }}>
                  Select any backend file from the list on the left to inspect its implementation.
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={() => handleOpenFile('reg-cs')} className="btn btn-sm btn-secondary">
                    RegistrationPage.aspx.cs
                  </button>
                  <button onClick={() => handleOpenFile('dbhelper')} className="btn btn-sm btn-secondary">
                    DatabaseHelper.cs
                  </button>
                  <button onClick={() => handleOpenFile('program-cs')} className="btn btn-sm btn-secondary">
                    Program.cs
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showCopyConfirm}
        title="Copy Source Code"
        message={`Copy full contents of "${activeFile?.name}" to your clipboard?`}
        confirmText="Yes, Copy"
        cancelText="Cancel"
        onConfirm={executeConfirmedCopy}
        onCancel={() => setShowCopyConfirm(false)}
      />

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Event Logs"
        message="Are you sure you want to clear all active transaction logs?"
        confirmText="Yes, Clear"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={executeConfirmedClear}
        onCancel={() => setShowClearConfirm(false)}
      />

    </div>
  );
}
