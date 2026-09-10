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
  ArrowLeft,
  CheckCircle2,
  FolderCode
} from 'lucide-react';
import { backendCategories } from '../data/backendCodeData';
import { checkServerHealth, getAdoLogs, clearAdoLogs } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function BackendExplorerView() {
  const [activeMainTab, setActiveMainTab] = useState('console'); // 'console' | 'code'
  
  // Console state
  const [liveLogs, setLiveLogs] = useState([]);
  const [serverOnline, setServerOnline] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Code IDE state
  const [activeFileId, setActiveFileId] = useState('reg-cs');
  const [openTabs, setOpenTabs] = useState(['reg-cs']);
  const [copied, setCopied] = useState(false);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const [mobileCodeView, setMobileCodeView] = useState('editor'); // 'files' | 'editor'

  const allFiles = backendCategories.flatMap((c) => c.files);
  const activeFile = allFiles.find((f) => f.id === activeFileId) || allFiles[0];

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
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
    setMobileCodeView('editor');
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
    <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Header Card */}
      <div className="card-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: 'var(--radius-sm)', 
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)', 
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            flexShrink: 0
          }}>
            <Server size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Backend Architecture &amp; Execution
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
              <div className={`pulse-dot ${serverOnline ? 'online' : 'offline'}`} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {serverOnline ? 'ASP.NET Core (Port 5000) Active' : 'Client Mode'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>&bull;</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                academic_portal.db
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', width: 'auto' }}>
          <button
            onClick={() => setActiveMainTab('console')}
            className={`btn btn-sm ${activeMainTab === 'console' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '7px 14px' }}
          >
            <Activity size={14} />
            <span>Execution Logs</span>
            {liveLogs.length > 0 && (
              <span className="badge badge-slate" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                {liveLogs.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveMainTab('code')}
            className={`btn btn-sm ${activeMainTab === 'code' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '7px 14px' }}
          >
            <Code2 size={14} />
            <span>Source Code</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
              {allFiles.length}
            </span>
          </button>
        </div>

      </div>

      {/* TAB 1: LIVE SERVER EXECUTION CONSOLE */}
      {activeMainTab === 'console' && (
        <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
          
          <div style={{ padding: '14px 18px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
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
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Radio size={36} style={{ margin: '0 auto 12px', opacity: 0.4, color: 'var(--accent-cyan)' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Server is idle and waiting for incoming requests
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
                Submit a new student registration, log in, or submit feedback to watch live ADO.NET and SQL queries stream here in real time.
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
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <span className={`badge ${log.type?.includes('INSERT') ? 'badge-emerald' : log.type?.includes('SELECT') ? 'badge-blue' : 'badge-amber'}`} style={{ fontSize: '0.675rem', flexShrink: 0 }}>
                          {log.type}
                        </span>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {log.title}
                          </span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
                            [{log.table}]
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {log.timestamp}
                        </span>
                        <ChevronDown size={15} style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '0 18px 16px 18px' }}>
                        <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                            EXECUTED ADO.NET CODE BLOCK:
                          </div>
                          <pre style={{ 
                            margin: 0, 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '0.775rem', 
                            color: '#38bdf8', 
                            overflowX: 'auto',
                            lineHeight: 1.55 
                          }}>
                            {log.csharpCode || '// Command executed successfully.'}
                          </pre>

                          {log.parameters && Object.keys(log.parameters).length > 0 && (
                            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                                RUNTIME PARAMETERS:
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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

      {/* TAB 2: SOURCE CODE EXPLORER & WORKSPACE (Responsive for PC & Phone) */}
      {activeMainTab === 'code' && (
        <div className="backend-code-layout">
          
          {/* Mobile View Switcher Pill Bar (Visible on mobile screens) */}
          <div className="mobile-code-nav" style={{ display: 'none', marginBottom: '10px' }}>
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', width: '100%' }}>
              <button
                onClick={() => setMobileCodeView('files')}
                className={`btn btn-sm ${mobileCodeView === 'files' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, border: 'none' }}
              >
                <FolderCode size={14} />
                Solution Files ({allFiles.length})
              </button>
              <button
                onClick={() => setMobileCodeView('editor')}
                className={`btn btn-sm ${mobileCodeView === 'editor' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, border: 'none' }}
              >
                <Code2 size={14} />
                {activeFile ? activeFile.name : 'Code Viewer'}
              </button>
            </div>
          </div>

          <div className="backend-code-grid">
            
            {/* File Tree / Solution Explorer */}
            <div className={`backend-file-tree card-panel ${mobileCodeView === 'editor' ? 'mobile-hidden' : ''}`} style={{ padding: '16px', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                  SOLUTION FILES
                </div>
                <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                  {allFiles.length} Files
                </span>
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
                        padding: '9px 12px',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)' : 'transparent',
                        borderLeft: isSelected ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                        color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8125rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <FileCode size={14} style={{ flexShrink: 0, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                        <span style={{ fontWeight: isSelected ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                      </div>
                      <span className="badge badge-slate" style={{ fontSize: '0.625rem', padding: '1px 5px', flexShrink: 0 }}>
                        {file.language}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code Viewer Panel */}
            <div className={`backend-code-editor card-panel ${mobileCodeView === 'files' ? 'mobile-hidden' : ''}`} style={{ padding: 0, overflow: 'hidden', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
              
              {/* Mobile Back to Files banner */}
              <div className="mobile-editor-header" style={{ display: 'none', padding: '8px 12px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <button 
                  onClick={() => setMobileCodeView('files')}
                  className="btn btn-sm btn-outline"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  <ArrowLeft size={13} /> Back to Files List
                </button>
              </div>

              {/* Editor Tab Bar */}
              <div style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {openTabs.length === 0 ? (
                  <div style={{ padding: '10px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
                        onClick={() => {
                          setActiveFileId(tabId);
                          setMobileCodeView('editor');
                        }}
                        style={{
                          padding: '10px 14px',
                          background: isActive ? 'var(--bg-primary)' : 'transparent',
                          borderRight: '1px solid var(--border-subtle)',
                          borderTop: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                          color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                          fontSize: '0.785rem',
                          fontWeight: isActive ? 600 : 400,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          userSelect: 'none',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                      >
                        <FileCode size={13} style={{ color: isActive ? 'var(--accent-cyan)' : 'inherit' }} />
                        <span>{file.name}</span>
                        <button
                          onClick={(e) => handleCloseTab(e, tabId)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', borderRadius: '2px' }}
                          title="Close tab"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Active Code Area */}
              {activeFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  {/* File Metadata Bar */}
                  <div style={{ padding: '9px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{activeFile.language.toUpperCase()}</span>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {activeFile.path}
                      </span>
                    </div>

                    <button 
                      onClick={() => setShowCopyConfirm(true)} 
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      {copied ? <Check size={12} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
                    </button>
                  </div>

                  {/* Code Block with Line Numbers */}
                  <div style={{ display: 'flex', flex: 1, background: 'var(--bg-primary)', overflowX: 'auto', maxHeight: '550px' }}>
                    <div style={{ 
                      padding: '16px 12px', 
                      background: 'rgba(0,0,0,0.2)', 
                      borderRight: '1px solid var(--border-subtle)', 
                      color: 'var(--text-muted)', 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.775rem', 
                      lineHeight: 1.6, 
                      textAlign: 'right', 
                      userSelect: 'none',
                      flexShrink: 0
                    }}>
                      {activeFile.code.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    <pre style={{ 
                      margin: 0, 
                      padding: '16px 18px', 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.785rem', 
                      lineHeight: 1.6, 
                      color: '#38bdf8', 
                      flex: 1, 
                      overflowX: 'auto', 
                      whiteSpace: 'pre',
                      tabSize: 4
                    }}>
                      {activeFile.code}
                    </pre>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
                  <FileCode size={44} style={{ color: 'var(--text-muted)', marginBottom: '14px', opacity: 0.5 }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    No Source File Open
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', maxWidth: '360px', marginBottom: '18px' }}>
                    Select any backend architecture file from the solution tree to inspect its implementation.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
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

      {/* Responsive Styles Injection */}
      <style>{`
        .backend-code-grid {
          display: grid;
          grid-template-columns: minmax(240px, 280px) 1fr;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .mobile-code-nav {
            display: block !important;
          }
          .mobile-editor-header {
            display: flex !important;
          }
          .backend-code-grid {
            display: block !important;
          }
          .mobile-hidden {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
