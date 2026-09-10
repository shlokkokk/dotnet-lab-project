import React, { useState, useEffect } from 'react';
import {
  Database, User, LogOut, Terminal, Sun, Moon, BookOpen,
  MessageSquare, UserPlus, LogIn, Activity
} from 'lucide-react';
import { checkServerHealth } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function Navigation({ activeTab, setActiveTab, currentUser, onLogout, theme, toggleTheme }) {
  const [serverOnline, setServerOnline] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const ping = async () => {
      const r = await checkServerHealth();
      setServerOnline(!!r);
    };
    ping();
    const iv = setInterval(ping, 2500);
    return () => clearInterval(iv);
  }, []);

  const navItems = [
    { id: 'register', label: 'Registration', shortLabel: 'Register', icon: UserPlus },
    { id: 'admin', label: 'Database', shortLabel: 'Database', icon: Database },
    ...(currentUser?.usertype === 'Student' ? [{ id: 'student', label: 'Student Portal', shortLabel: 'Portal', icon: BookOpen }] : []),
    { id: 'feedback', label: 'Feedback', shortLabel: 'Feedback', icon: MessageSquare },
    { id: 'backend', label: 'Backend', shortLabel: 'Backend', icon: Terminal },
  ];

  return (
    <>
      {/* ── TOP HEADER (Desktop & Mobile) ── */}
      <header className="nav-header">
        <div className="nav-container">

          {/* Brand */}
          <div
            className="brand-group"
            onClick={() => setActiveTab('register')}
          >
            <div className="brand-logo-box">
              <img
                src={theme === 'light' ? '/msu_logo_black.png' : '/msu_logo_white.png'}
                alt="MSU Baroda"
              />
            </div>
            <div className="brand-text-col">
              <span className="brand-title">
                MSU Polytechnic
              </span>
              <span className="brand-subtext">
                ACADEMIC PORTAL
              </span>
            </div>
          </div>

          {/* Right side controls */}
          <div className="nav-controls-group">

            {/* Server health badge */}
            <div
              className={`server-status-pill ${serverOnline ? 'online' : 'offline'}`}
              title={serverOnline ? 'ASP.NET Core on Port 5000' : 'LocalDB mode'}
            >
              <div className={`pulse-dot ${serverOnline ? 'online' : 'offline'}`} />
              <span className="server-status-text">{serverOnline ? '.NET Live' : 'LocalDB'}</span>
            </div>

            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title="Toggle theme"
              aria-label="Toggle color theme"
            >
              {theme === 'dark'
                ? <Sun size={14} style={{ color: 'var(--accent-amber)' }} />
                : <Moon size={14} style={{ color: 'var(--accent-indigo)' }} />}
            </button>

            {/* User Auth status / button */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.675rem', padding: '3px 8px', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <User size={10} />
                  {currentUser.username}
                </span>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="btn btn-danger btn-icon-sm"
                  title="Sign out"
                  style={{ width: '30px', height: '30px' }}
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="btn btn-primary nav-signin-btn"
              >
                <LogIn size={12} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* ── DESKTOP SUBNAV STRIP (Hidden on mobile) ── */}
        <div className="subnav-bar desktop-only-nav">
          <div className="subnav-container">
            <nav className="nav-tabs-wrapper" aria-label="Main navigation">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon size={13} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── MOBILE NATIVE BOTTOM NAVIGATION BAR (Visible ONLY on phones) ── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <div className="mobile-bottom-nav-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                aria-label={item.label}
              >
                <div className="mobile-tab-icon-wrapper">
                  <Icon size={18} />
                </div>
                <span className="mobile-tab-label">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
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
