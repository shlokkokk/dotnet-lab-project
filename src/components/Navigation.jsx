import React, { useState, useEffect } from 'react';
import { Database, User, LogOut, Terminal, Sun, Moon, BookOpen, MessageSquare, UserPlus, LogIn, Activity } from 'lucide-react';
import { checkServerHealth } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function Navigation({ activeTab, setActiveTab, currentUser, onLogout, theme, toggleTheme }) {
  const [serverOnline, setServerOnline] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const ping = async () => {
      const res = await checkServerHealth();
      setServerOnline(!!res);
    };
    ping();
    const interval = setInterval(ping, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <>
      <header className="nav-header">
        <div className="nav-container">
          
          {/* Brand Identity */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }} 
            onClick={() => setActiveTab('register')}
            title="Go to Registration"
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-medium)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              flexShrink: 0,
              padding: '4px'
            }}>
              <img 
                src="/msu_logo.png" 
                alt="MSU Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                MSU Polytechnic
              </div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Academic &amp; Database System
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Live Server Indicator Pill */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: serverOnline ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                border: `1px solid ${serverOnline ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.725rem',
                fontFamily: 'var(--font-mono)',
                color: serverOnline ? 'var(--accent-emerald)' : 'var(--text-muted)',
                userSelect: 'none'
              }}
              title={serverOnline ? 'Connected to C# ASP.NET Core Engine on Port 5000' : 'Operating in Browser LocalDB Storage'}
            >
              <div className={`pulse-dot ${serverOnline ? 'online' : 'offline'}`} />
              <span style={{ fontWeight: 600 }}>{serverOnline ? '.NET Live' : 'LocalDB'}</span>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="btn btn-outline"
              title="Toggle theme"
              style={{ width: '34px', height: '34px', padding: 0, borderRadius: 'var(--radius-sm)' }}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun size={15} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={15} style={{ color: 'var(--accent-indigo)' }} />}
            </button>

            {/* User State / Sign In Button */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>
                  <User size={12} />
                  {currentUser.username}
                </span>
                <button 
                  onClick={handleLogoutClick}
                  className="btn btn-danger btn-sm"
                  title="Sign out"
                  style={{ padding: '6px 8px' }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="btn btn-primary btn-sm"
                style={{ padding: '6px 14px' }}
              >
                <LogIn size={13} />
                Sign In
              </button>
            )}

          </div>

        </div>

        {/* Scrollable Subnav Tab Strip */}
        <div className="subnav-bar">
          <div className="subnav-container">
            <div className="nav-tabs-wrapper">
              <button 
                className={`nav-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                <UserPlus size={14} />
                Registration
              </button>

              <button 
                className={`nav-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <Database size={14} />
                Database (dbo.regdb)
              </button>

              {currentUser && currentUser.usertype === 'Student' && (
                <button 
                  className={`nav-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
                  onClick={() => setActiveTab('student')}
                >
                  <BookOpen size={14} />
                  Student Portal
                </button>
              )}

              <button 
                className={`nav-tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
                onClick={() => setActiveTab('feedback')}
              >
                <MessageSquare size={14} />
                Feedback (dbo.fd_table)
              </button>

              <button 
                className={`nav-tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
                onClick={() => setActiveTab('backend')}
              >
                <Terminal size={14} />
                Backend Architecture
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Sign Out Confirmation"
        message={`Are you sure you want to end your current active session as "${currentUser?.username || 'user'}"?`}
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        isDanger={true}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
