import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import RegistrationView from './components/RegistrationView';
import LoginView from './components/LoginView';
import StudentPortalView from './components/StudentPortalView';
import FeedbackView from './components/FeedbackView';
import AdminView from './components/AdminView';
import BackendExplorerView from './components/BackendExplorerView';

const SESSION_KEY = 'msu_dotnet_session_user';
const THEME_KEY = 'msu_dotnet_theme';

export default function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  const [loginPrefill, setLoginPrefill] = useState({ username: '', usertype: 'Student' });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));

    if (user.usertype === 'Student') {
      setActiveTab('student');
    } else {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
    setActiveTab('login');
  };

  const handleRegistrationSuccess = (username, usertype) => {
    setLoginPrefill({ username, usertype });
    setActiveTab('login');
  };

  return (
    <div className="app-container">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="main-content">
        {activeTab === 'register' && (
          <RegistrationView 
            onRegistrationSuccess={handleRegistrationSuccess} 
            onNavigateToDb={() => setActiveTab('admin')} 
          />
        )}
        {activeTab === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            defaultUsername={loginPrefill.username}
            defaultUsertype={loginPrefill.usertype}
          />
        )}
        {activeTab === 'student' && <StudentPortalView user={currentUser} onLogout={handleLogout} />}
        {activeTab === 'admin' && <AdminView currentUser={currentUser} />}
        {activeTab === 'feedback' && <FeedbackView currentUser={currentUser} />}
        {activeTab === 'backend' && <BackendExplorerView />}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', padding: '16px', textAlign: 'center', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
            The Maharaja Sayajirao University of Baroda | Polytechnic IT
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Database System | dbo.regdb &amp; dbo.fd_table
          </div>
        </div>
      </footer>
    </div>
  );
}
