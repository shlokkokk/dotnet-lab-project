import React, { useState, useEffect } from 'react';
import { Database, User, LogOut, Terminal, Sun, Moon, BookOpen, MessageSquare, UserPlus, LogIn } from 'lucide-react';
import { checkServerHealth } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function Navigation({ activeTab, setActiveTab, currentUser, onLogout, theme, toggleTheme, onOpenInspector, logCount }) {
  const [serverOnline, setServerOnline] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const ping = async () => {
      const res = await checkServerHealth();
      setServerOnline(!!res);
    };
    ping();
    const interval = setInterval(ping, 1000);
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
          
          {/* Brand identity with official MSU Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }} onClick={() => setActiveTab('register')}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              flexShrink: 0,
              padding: '4px'
            }}>
              <img 
                src="/msu_logo.png" 
                alt="MSU Baroda Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                MSU Polytechnic
              </div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Registration &amp; Database System
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={toggleTheme}
              className="btn btn-sm btn-outline"
              title="Toggle color theme"
              style={{ width: '32px', height: '32px', padding: 0 }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '6px', borderLeft: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.675rem' }}>
                  {currentUser.username}
                </span>
                <button 
                  onClick={handleLogoutClick}
                  className="btn btn-sm btn-danger"
                  title="Log out"
                  style={{ padding: '4px 6px' }}
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="btn btn-sm btn-primary"
              >
                Sign In
              </button>
            )}
          </div>

        </div>

        {/* Clean Sub-navigation tab bar */}
        <div className="subnav-bar">
          <div className="subnav-container">
            <div className="nav-tabs-wrapper">
              <button 
                className={`btn btn-sm ${activeTab === 'register' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('register')}
              >
                <UserPlus size={13} />
                Registration Form
              </button>

              <button 
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('admin')}
              >
                <Database size={13} />
                Database (dbo.regdb)
              </button>

              {currentUser && currentUser.usertype === 'Student' && (
                <button 
                  className={`btn btn-sm ${activeTab === 'student' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setActiveTab('student')}
                >
                  <BookOpen size={13} />
                  Student Portal
                </button>
              )}

              <button 
                className={`btn btn-sm ${activeTab === 'feedback' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('feedback')}
              >
                <MessageSquare size={13} />
                Feedback (dbo.fd_table)
              </button>

              <button 
                className={`btn btn-sm ${activeTab === 'backend' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('backend')}
              >
                <Terminal size={13} style={{ color: 'var(--accent-cyan)' }} />
                Backend Architecture
              </button>
            </div>

            <div 
              className={`badge ${serverOnline ? 'badge-emerald' : 'badge-slate'}`}
              style={{ fontSize: '0.65rem', flexShrink: 0 }}
              title={serverOnline ? 'Connected to C# ASP.NET Core API on port 5000' : 'Operating in client storage mode'}
            >
              {serverOnline ? '.NET API Live' : 'Offline Storage'}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Sign Out Confirmation"
        message={`Are you sure you want to end your session as ${currentUser?.username || 'user'}?`}
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        isDanger={true}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
