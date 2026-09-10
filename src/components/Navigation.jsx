import React, { useState, useEffect } from 'react';
import { Database, User, LogOut, Terminal, Sun, Moon, BookOpen, MessageSquare, UserPlus, LogIn, Activity } from 'lucide-react';
import { checkServerHealth } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function Navigation({ activeTab, setActiveTab, currentUser, onLogout, theme, toggleTheme }) {
  const [serverOnline, setServerOnline] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const ping = async () => { const r = await checkServerHealth(); setServerOnline(!!r); };
    ping();
    const iv = setInterval(ping, 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <header className="nav-header">

        {/* Top bar */}
        <div className="nav-container">

          {/* Brand */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0, userSelect: 'none' }}
            onClick={() => setActiveTab('register')}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border-soft)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              flexShrink: 0, padding: '3px'
            }}>
              <img
                src={theme === 'light' ? '/msu_logo_black.png' : '/msu_logo_white.png'}
                alt="MSU Baroda"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                MSU Polytechnic
              </span>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                ACADEMIC PORTAL
              </span>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Server badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: serverOnline ? 'rgba(16,185,129,0.08)' : 'transparent',
              border: `1px solid ${serverOnline ? 'rgba(16,185,129,0.22)' : 'var(--border-subtle)'}`,
              padding: '4px 10px', borderRadius: 'var(--r-full)',
              fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
              color: serverOnline ? 'var(--accent-emerald)' : 'var(--text-muted)',
              userSelect: 'none', transition: 'all 0.3s ease'
            }}
              title={serverOnline ? 'ASP.NET Core on Port 5000' : 'LocalDB mode'}
            >
              <div className={`pulse-dot ${serverOnline ? 'online' : 'offline'}`} />
              <span style={{ fontWeight: 600 }}>{serverOnline ? '.NET Live' : 'LocalDB'}</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline btn-icon"
              title="Toggle theme"
              aria-label="Toggle color theme"
            >
              {theme === 'dark'
                ? <Sun size={15} style={{ color: 'var(--accent-amber)' }} />
                : <Moon size={15} style={{ color: 'var(--accent-indigo)' }} />}
            </button>

            {/* Auth */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
                  <User size={11} />
                  {currentUser.username}
                </span>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="btn btn-danger btn-icon-sm"
                  title="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="btn btn-primary btn-sm"
              >
                <LogIn size={13} />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Tab strip */}
        <div className="subnav-bar">
          <div className="subnav-container">
            <nav className="nav-tabs-wrapper" aria-label="Main navigation">
              <button
                className={`nav-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                <UserPlus size={13} />
                Registration
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <Database size={13} />
                Database
              </button>

              {currentUser?.usertype === 'Student' && (
                <button
                  className={`nav-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
                  onClick={() => setActiveTab('student')}
                >
                  <BookOpen size={13} />
                  Student Portal
                </button>
              )}

              <button
                className={`nav-tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
                onClick={() => setActiveTab('feedback')}
              >
                <MessageSquare size={13} />
                Feedback
              </button>

              <button
                className={`nav-tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
                onClick={() => setActiveTab('backend')}
              >
                <Terminal size={13} />
                Backend
              </button>
            </nav>
          </div>
        </div>
      </header>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Sign Out"
        message={`End your session as "${currentUser?.username || 'user'}"?`}
        confirmText="Sign Out"
        cancelText="Stay"
        isDanger
        onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
