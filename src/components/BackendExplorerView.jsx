import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Server, Database, Terminal, Code2, FileCode, Copy, Check,
  RotateCcw, Radio, ChevronDown, ChevronRight, X, Layers, Activity,
  ArrowLeft, FolderOpen, Search, Download, WrapText, FileText,
  Filter, Sparkles, CornerDownRight, CheckCircle2
} from 'lucide-react';
import { backendCategories } from '../data/backendCodeData';
import { checkServerHealth, getAdoLogs, clearAdoLogs } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function BackendExplorerView() {
  const [activeMainTab, setActiveMainTab] = useState('code');
  const [liveLogs, setLiveLogs] = useState([]);
  const [serverOnline, setServerOnline] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // File explorer state
  const [activeFileId, setActiveFileId] = useState('reg-aspx');
  const [openTabs, setOpenTabs] = useState(['reg-aspx', 'reg-cs', 'program-cs']);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState('all'); // 'all', 'name', 'code'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [wrapCode, setWrapCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const [mobileView, setMobileView] = useState('files'); // 'files' | 'editor'

  const searchInputRef = useRef(null);

  const allFiles = useMemo(() => backendCategories.flatMap(c => c.files), []);
  const activeFile = useMemo(() => allFiles.find(f => f.id === activeFileId) || null, [allFiles, activeFileId]);

  useEffect(() => {
    const load = async () => {
      setServerOnline(!!(await checkServerHealth()));
      setLiveLogs(getAdoLogs());
    };
    load();
    const iv = setInterval(load, 2500);
    return () => clearInterval(iv);
  }, []);

  // Keyboard shortcut: Press '/' or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setActiveMainTab('code');
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenFile = (fileId) => {
    if (!openTabs.includes(fileId)) {
      setOpenTabs(p => [...p, fileId]);
    }
    setActiveFileId(fileId);
    setMobileView('editor');
  };

  const handleCloseTab = (e, fileId) => {
    e.stopPropagation();
    const next = openTabs.filter(id => id !== fileId);
    setOpenTabs(next);
    if (activeFileId === fileId) {
      setActiveFileId(next.length > 0 ? next[next.length - 1] : null);
    }
  };

  const toggleCategory = (catId) => {
    setCollapsedCategories(p => ({ ...p, [catId]: !p[catId] }));
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
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered files logic with multi-field search and match counting
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return backendCategories.map(cat => {
      if (selectedCategory !== 'all' && cat.id !== selectedCategory) {
        return { ...cat, files: [] };
      }

      const matchingFiles = cat.files.map(file => {
        if (!query) {
          return { ...file, matchType: null, codeMatchesCount: 0 };
        }

        const nameMatch = file.name.toLowerCase().includes(query);
        const pathMatch = file.path.toLowerCase().includes(query);
        const tagMatch = file.tag?.toLowerCase().includes(query);
        const summaryMatch = file.summary?.toLowerCase().includes(query);

        let codeMatchesCount = 0;
        if (searchScope === 'all' || searchScope === 'code') {
          const lines = file.code.toLowerCase().split('\n');
          codeMatchesCount = lines.filter(l => l.includes(query)).length;
        }

        let isMatch = false;
        let matchType = '';

        if (searchScope === 'name') {
          isMatch = nameMatch || pathMatch;
          matchType = 'Name match';
        } else if (searchScope === 'code') {
          isMatch = codeMatchesCount > 0;
          matchType = `${codeMatchesCount} match${codeMatchesCount > 1 ? 'es' : ''} in code`;
        } else {
          isMatch = nameMatch || pathMatch || tagMatch || summaryMatch || (codeMatchesCount > 0);
          if (nameMatch) matchType = 'Name match';
          else if (codeMatchesCount > 0) matchType = `${codeMatchesCount} code match${codeMatchesCount > 1 ? 'es' : ''}`;
          else if (tagMatch || summaryMatch) matchType = 'Summary match';
        }

        return isMatch ? { ...file, matchType, codeMatchesCount } : null;
      }).filter(Boolean);

      return {
        ...cat,
        files: matchingFiles
      };
    }).filter(cat => cat.files.length > 0);
  }, [searchQuery, searchScope, selectedCategory]);

  const totalFilteredCount = useMemo(() => {
    return searchResults.reduce((acc, c) => acc + c.files.length, 0);
  }, [searchResults]);

  // Highlight query in active file's code view if search active
  const activeFileLines = useMemo(() => {
    if (!activeFile) return [];
    return activeFile.code.split('\n');
  }, [activeFile]);

  const queryTrimmed = searchQuery.trim().toLowerCase();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-up">

      {/* ── Top Header Card ── */}
      <div className="card-panel backend-top-header" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: 'var(--r-sm)',
            background: 'linear-gradient(135deg, rgba(2,132,199,0.18) 0%, rgba(99,102,241,0.18) 100%)',
            color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(56,189,248,0.25)', flexShrink: 0
          }}>
            <Server size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.96rem', fontWeight: 750, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
              Backend &amp; Source Explorer
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <div className={`pulse-dot ${serverOnline ? 'online' : 'offline'}`} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap' }}>{serverOnline ? 'ASP.NET Core 9.0' : 'LocalDB'}</span>
              <span>·</span>
              <span style={{ whiteSpace: 'nowrap' }}>{allFiles.length} Solution Files</span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="backend-main-tabs" style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => { setActiveMainTab('code'); }}
            className={`btn btn-sm ${activeMainTab === 'code' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', height: '32px', padding: '0 12px' }}
          >
            <Code2 size={12} />
            Source Files
            <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '0 5px' }}>
              {allFiles.length}
            </span>
          </button>
          <button
            onClick={() => setActiveMainTab('console')}
            className={`btn btn-sm ${activeMainTab === 'console' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', height: '32px', padding: '0 12px' }}
          >
            <Activity size={12} />
            ADO.NET Feed
            {liveLogs.length > 0 && (
              <span className="badge badge-slate" style={{ fontSize: '0.6rem', padding: '0 5px' }}>
                {liveLogs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── TAB 1: Source Code Explorer ── */}
      {activeMainTab === 'code' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Search and Filter Bar */}
          <div className="card-panel" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Top row: Search input + Scope toggle */}
            <div className="search-scope-row">
              
              {/* Search input container */}
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-input"
                  placeholder="Search files or code content... (Press '/' to focus)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: '36px',
                    paddingRight: searchQuery ? '32px' : '12px',
                    fontSize: '0.84rem',
                    height: '38px'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                      padding: '4px', display: 'flex', borderRadius: '4px'
                    }}
                    title="Clear search (Esc)"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search Scope selector */}
              <div className="search-scope-toggle" style={{
                display: 'inline-flex', alignItems: 'center', gap: '2px',
                background: 'var(--bg-tertiary)', padding: '3px',
                borderRadius: 'var(--r-sm)', border: '1px solid var(--border-soft)',
                height: '38px', boxSizing: 'border-box', flexShrink: 0
              }}>
                {[
                  { id: 'all', label: 'All Fields' },
                  { id: 'name', label: 'Filename' },
                  { id: 'code', label: 'Code Content' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSearchScope(s.id)}
                    style={{
                      padding: '5px 11px', fontSize: '0.74rem', border: 'none', borderRadius: '4px',
                      background: searchScope === s.id ? 'var(--accent-blue)' : 'transparent',
                      color: searchScope === s.id ? '#ffffff' : 'var(--text-muted)',
                      fontWeight: searchScope === s.id ? 650 : 450,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap', height: '30px'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom row: Category Filter Tabs */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
              paddingTop: '2px'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 650, display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0, marginRight: '2px' }}>
                <Filter size={12} style={{ color: 'var(--accent-cyan)' }} /> Tier:
              </span>
              
              <button
                onClick={() => setSelectedCategory('all')}
                className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                All Files
                <span className="badge badge-slate" style={{ fontSize: '0.6rem', padding: '0 5px' }}>{allFiles.length}</span>
              </button>

              {backendCategories.map(cat => {
                const shortLabel = cat.id === 'webforms-ui' ? 'Web Forms'
                  : cat.id === 'code-behind' ? 'Code-Behind'
                  : cat.id === 'data-layer' ? 'Database & ADO.NET'
                  : 'Server & DevOps';

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    {shortLabel}
                    <span className="badge badge-slate" style={{ fontSize: '0.6rem', padding: '0 5px' }}>{cat.files.length}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile view switchers */}
          <div className="mobile-code-toggle">
            <div style={{
              display: 'flex', background: 'var(--bg-primary)', padding: '4px',
              borderRadius: 'var(--r-sm)', border: '1px solid var(--border-soft)', gap: '4px'
            }}>
              <button
                onClick={() => setMobileView('files')}
                className={`btn btn-sm ${mobileView === 'files' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, border: 'none' }}
              >
                <FolderOpen size={13} />
                Files ({totalFilteredCount})
              </button>
              <button
                onClick={() => setMobileView('editor')}
                className={`btn btn-sm ${mobileView === 'editor' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, border: 'none' }}
              >
                <Code2 size={13} />
                {activeFile ? activeFile.name : 'Code Editor'}
              </button>
            </div>
          </div>

          {/* Main Grid: File Tree + Code Editor */}
          <div className="backend-code-grid">

            {/* ── Left Column: Solution File Tree ── */}
            <div className={`card-panel backend-file-panel ${mobileView === 'editor' ? 'mobile-hide' : ''}`} style={{ padding: '14px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em' }}>
                  SOLUTION EXPLORER
                </div>
                <span className="badge badge-slate" style={{ fontSize: '0.625rem' }}>
                  {totalFilteredCount} of {allFiles.length}
                </span>
              </div>

              {/* Category Tree */}
              {searchResults.length === 0 ? (
                <div style={{ padding: '24px 12px', textAlign: 'center' }}>
                  <Search size={24} style={{ color: 'var(--text-muted)', opacity: 0.5, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>No matching files</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Try adjusting your search query or filter.</div>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="btn btn-sm btn-outline"
                    style={{ marginTop: '10px', fontSize: '0.7rem' }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '580px', paddingRight: '2px' }}>
                  {searchResults.map(cat => {
                    const isCollapsed = !!collapsedCategories[cat.id];
                    return (
                      <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        
                        {/* Category Header */}
                        <div
                          onClick={() => toggleCategory(cat.id)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '6px 8px', borderRadius: '4px', cursor: 'pointer',
                            userSelect: 'none', background: 'rgba(0,0,0,0.1)'
                          }}
                          title={cat.description}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                            {isCollapsed ? <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />}
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cat.name.split(' (')[0]}
                            </span>
                          </div>
                          <span className="badge badge-slate" style={{ fontSize: '0.575rem', padding: '0 4px' }}>
                            {cat.files.length}
                          </span>
                        </div>

                        {/* Files under Category */}
                        {!isCollapsed && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '8px' }}>
                            {cat.files.map(file => {
                              const isActive = activeFileId === file.id;
                              return (
                                <button
                                  key={file.id}
                                  onClick={() => handleOpenFile(file.id)}
                                  style={{
                                    width: '100%', textAlign: 'left', padding: '7px 10px',
                                    border: 'none', borderRadius: 'var(--r-xs)',
                                    background: isActive
                                      ? 'linear-gradient(135deg, rgba(2,132,199,0.2) 0%, rgba(99,102,241,0.18) 100%)'
                                      : 'transparent',
                                    borderLeft: `3px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}`,
                                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)',
                                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                    gap: '2px', fontSize: '0.785rem', transition: 'all 0.15s ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                                      <FileCode size={13} style={{ flexShrink: 0, color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isActive ? 600 : 400 }}>
                                        {file.name}
                                      </span>
                                    </div>
                                    <span className="badge badge-slate" style={{ fontSize: '0.575rem', flexShrink: 0 }}>
                                      {file.language}
                                    </span>
                                  </div>

                                  {/* Match Indicator Pill */}
                                  {file.matchType && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '19px', marginTop: '1px' }}>
                                      <span style={{ fontSize: '0.625rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                                        ↳ {file.matchType}
                                      </span>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Right Column: Code Editor & Viewer ── */}
            <div className={`card-panel backend-editor-panel ${mobileView === 'files' ? 'mobile-hide' : ''}`} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '560px' }}>

              {/* Mobile back bar */}
              <div className="mobile-back-bar">
                <button
                  onClick={() => setMobileView('files')}
                  className="btn btn-sm btn-outline"
                  style={{ fontSize: '0.75rem' }}
                >
                  <ArrowLeft size={13} />
                  Back to Files List
                </button>
              </div>

              {/* Open Tabs Ribbon */}
              <div style={{
                background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0
              }}>
                {openTabs.length === 0 ? (
                  <div style={{ padding: '9px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    No open files
                  </div>
                ) : openTabs.map(tabId => {
                  const f = allFiles.find(x => x.id === tabId);
                  if (!f) return null;
                  const isAct = activeFileId === tabId;
                  return (
                    <div
                      key={tabId}
                      onClick={() => { setActiveFileId(tabId); setMobileView('editor'); }}
                      style={{
                        padding: '9px 14px', background: isAct ? 'var(--bg-primary)' : 'transparent',
                        borderRight: '1px solid var(--border-subtle)',
                        borderTop: `2px solid ${isAct ? 'var(--accent-cyan)' : 'transparent'}`,
                        color: isAct ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontSize: '0.775rem', fontWeight: isAct ? 600 : 400,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        userSelect: 'none', whiteSpace: 'nowrap', flexShrink: 0
                      }}
                    >
                      <FileCode size={12} style={{ color: isAct ? 'var(--accent-cyan)' : 'inherit' }} />
                      {f.name}
                      <button
                        onClick={e => handleCloseTab(e, tabId)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', borderRadius: '3px' }}
                        title="Close tab"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Code Viewer */}
              {activeFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  {/* File Metadata & Action Bar */}
                  <div style={{
                    padding: '8px 16px', background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <span className="badge badge-blue">{activeFile.tag || activeFile.language.toUpperCase()}</span>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {activeFile.path}
                      </span>
                      <span className="badge badge-slate" style={{ fontSize: '0.625rem' }}>
                        {activeFileLines.length} lines
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => setWrapCode(!wrapCode)}
                        className={`btn btn-sm ${wrapCode ? 'btn-secondary' : 'btn-outline'}`}
                        style={{ fontSize: '0.725rem', padding: '4px 8px' }}
                        title="Toggle soft word wrap"
                      >
                        <WrapText size={12} />
                        {wrapCode ? 'Wrap: ON' : 'Wrap'}
                      </button>
                      
                      <button
                        onClick={handleDownloadFile}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.725rem', padding: '4px 8px' }}
                        title="Download raw source file"
                      >
                        <Download size={12} />
                        Download
                      </button>

                      <button
                        onClick={() => setShowCopyConfirm(true)}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.725rem', padding: '4px 8px' }}
                      >
                        {copied ? <Check size={12} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={12} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  {activeFile.summary && (
                    <div style={{
                      padding: '8px 16px', background: 'rgba(2,132,199,0.06)',
                      borderBottom: '1px solid rgba(56,189,248,0.15)',
                      display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)'
                    }}>
                      <FileText size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{activeFile.summary}</span>
                    </div>
                  )}

                  {/* Code Block with Unified Line Numbers & Search Highlight */}
                  <div style={{
                    flex: 1,
                    background: 'var(--bg-primary)',
                    overflow: 'auto',
                    maxHeight: '620px',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'table',
                      minWidth: '100%',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.785rem',
                      lineHeight: 1.65,
                      padding: '8px 0'
                    }}>
                      {activeFileLines.map((line, i) => {
                        const isMatched = queryTrimmed && (searchScope === 'all' || searchScope === 'code') && line.toLowerCase().includes(queryTrimmed);
                        return (
                          <div
                            key={i}
                            style={{
                              display: 'table-row',
                              background: isMatched ? 'rgba(56,189,248,0.14)' : 'transparent'
                            }}
                          >
                            <span
                              style={{
                                display: 'table-cell',
                                padding: '1px 12px',
                                textAlign: 'right',
                                color: isMatched ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                fontWeight: isMatched ? 700 : 400,
                                userSelect: 'none',
                                borderRight: '1px solid var(--border-subtle)',
                                background: isMatched ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.22)',
                                width: '1%',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {i + 1}
                            </span>
                            <span
                              style={{
                                display: 'table-cell',
                                padding: '1px 16px',
                                whiteSpace: wrapCode ? 'pre-wrap' : 'pre',
                                wordBreak: wrapCode ? 'break-all' : 'normal',
                                color: isMatched ? '#ffffff' : '#38bdf8',
                                tabSize: 4
                              }}
                            >
                              {line || ' '}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state" style={{ flex: 1 }}>
                  <Layers size={42} style={{ color: 'var(--accent-cyan)', opacity: 0.3 }} />
                  <h3>No File Selected</h3>
                  <p>Select a file from the solution tree to inspect its source code.</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
                    {['reg-aspx', 'reg-cs', 'program-cs', 'sql-schema'].map(id => {
                      const f = allFiles.find(x => x.id === id);
                      return f ? (
                        <button key={id} onClick={() => handleOpenFile(id)} className="btn btn-sm btn-secondary">
                          {f.name}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 2: Real-time ADO.NET Event Feed ── */}
      {activeMainTab === 'console' && (
        <div className="card-panel" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '14px 20px', background: 'rgba(0,0,0,0.15)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Real-Time ADO.NET Event Feed
              </span>
            </div>
            {liveLogs.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.75rem' }}
              >
                <RotateCcw size={12} />
                Clear Feed
              </button>
            )}
          </div>

          {liveLogs.length === 0 ? (
            <div className="empty-state">
              <Radio size={38} style={{ color: 'var(--accent-cyan)', opacity: 0.35 }} />
              <h3>Waiting for Transaction Activity</h3>
              <p>Submit a registration, sign in, or post feedback to watch live ADO.NET queries stream here in real time.</p>
            </div>
          ) : (
            <div>
              {liveLogs.map(log => {
                const isExp = expandedLogId === log.id;
                return (
                  <div
                    key={log.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isExp ? 'var(--bg-secondary)' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div
                      onClick={() => setExpandedLogId(isExp ? null : log.id)}
                      style={{
                        padding: '13px 20px', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer', gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <span className={`badge ${log.type?.includes('INSERT') ? 'badge-emerald' : log.type?.includes('SELECT') ? 'badge-blue' : 'badge-amber'}`}>
                          {log.type}
                        </span>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{log.title}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>[{log.table}]</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{log.timestamp}</span>
                        <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                      </div>
                    </div>

                    {isExp && (
                      <div style={{ padding: '0 20px 16px' }}>
                        <div style={{ background: 'var(--bg-primary)', padding: '14px 16px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px', letterSpacing: '0.07em' }}>
                            EXECUTED ADO.NET BLOCK:
                          </div>
                          <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.775rem', color: '#38bdf8', overflowX: 'auto', lineHeight: 1.6 }}>
                            {log.csharpCode || '// Command executed successfully.'}
                          </pre>
                          {log.parameters && Object.keys(log.parameters).length > 0 && (
                            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                                PARAMETERS:
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {Object.entries(log.parameters).map(([k, v]) => (
                                  <span key={k} className="badge badge-slate" style={{ fontFamily: 'var(--font-mono)' }}>
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

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={showCopyConfirm}
        title="Copy Source Code"
        message={`Copy contents of "${activeFile?.name}" to clipboard?`}
        confirmText="Copy"
        cancelText="Cancel"
        onConfirm={executeConfirmedCopy}
        onCancel={() => setShowCopyConfirm(false)}
      />
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Logs"
        message="Remove all transaction log entries?"
        confirmText="Clear All"
        cancelText="Cancel"
        isDanger
        onConfirm={executeConfirmedClear}
        onCancel={() => setShowClearConfirm(false)}
      />

      {/* Scoped CSS styling for filter pills and responsive layout */}
      <style>{`
        .filter-pill {
          padding: 4px 10px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border-soft);
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 0.735rem;
          font-weight: 550;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }
        .filter-pill:hover {
          color: var(--text-primary);
          border-color: var(--border-medium);
          background: var(--bg-elevated);
        }
        .filter-pill.active {
          background: var(--accent-blue);
          color: #ffffff;
          border-color: var(--accent-blue);
          box-shadow: 0 2px 8px rgba(2,132,199,0.3);
        }
        .search-scope-row {
          display: flex;
          gap: 10px;
          align-items: center;
          width: 100%;
        }
        .mobile-code-toggle { display: none; }
        .mobile-back-bar    { display: none; }
        .backend-code-grid  {
          display: grid;
          grid-template-columns: minmax(260px, 300px) 1fr;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .backend-top-header {
            flex-direction: column;
            align-items: stretch !important;
            gap: 12px !important;
            padding: 12px 14px !important;
          }
          .backend-main-tabs {
            width: 100%;
            display: flex;
          }
          .backend-main-tabs button {
            flex: 1;
            justify-content: center;
          }
          .search-scope-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          .search-scope-toggle {
            display: flex !important;
            width: 100% !important;
          }
          .search-scope-toggle button {
            flex: 1;
            text-align: center;
          }
          .mobile-code-toggle { display: block; margin-bottom: 8px; }
          .mobile-back-bar    { display: flex; padding: 8px 12px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-subtle); }
          .backend-code-grid  { display: block !important; }
          .mobile-hide        { display: none !important; }
        }
      `}</style>
    </div>
  );
}
