import React, { useState } from 'react';
import { LogIn, KeyRound, ShieldAlert, CheckCircle2, User, Eye, EyeOff } from 'lucide-react';
import { getStoredUsers, loginUserApi } from '../services/db';
import { simulateLoginQuery } from '../services/adoSimulator';

export default function LoginView({ onLoginSuccess, defaultUsername = '', defaultUsertype = 'Student' }) {
  const [username, setUsername] = useState(defaultUsername || '');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState(defaultUsertype || 'Student');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);

    simulateLoginQuery(username.trim(), password, usertype);

    const apiResult = await loginUserApi(username.trim(), password, usertype);

    setLoading(false);

    if (apiResult && apiResult.success && apiResult.user) {
      onLoginSuccess(apiResult.user);
      return;
    }

    const users = getStoredUsers();
    const matched = users.find(
      (u) => 
        ((u.username || '').toLowerCase() === username.trim().toLowerCase() ||
         (u.email || '').toLowerCase() === username.trim().toLowerCase()) && 
        u.password === password && 
        u.usertype === usertype
    );

    if (matched) {
      onLoginSuccess(matched);
    } else {
      setErrorMessage('User does not exist or credentials invalid for selected role (ExecuteScalar count = 0).');
    }
  };

  const handleQuickLogin = (role, user, pass) => {
    setUsertype(role);
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '20px auto 0' }}>
      <div className="card-panel" style={{ padding: '28px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: 'var(--radius-sm)', 
            background: 'rgba(2, 132, 199, 0.15)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px'
          }}>
            <LogIn size={18} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Portal Authentication
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Session-backed authentication matching <code style={{ fontFamily: 'var(--font-mono)' }}>LoginPage.aspx</code>
          </p>
        </div>

        {errorMessage && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            border: '1px solid rgba(244, 63, 94, 0.25)', 
            padding: '10px 12px', 
            borderRadius: 'var(--radius-sm)', 
            color: 'var(--accent-rose)', 
            fontSize: '0.785rem', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={15} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">
              Role Access Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['Student', 'Faculty', 'Admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUsertype(role)}
                  className={`btn btn-sm ${usertype === role ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%' }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">
              Username or Email
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. shlok or shlokshah412@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }} disabled={loading}>
            <LogIn size={14} />
            {loading ? 'Executing ADO.NET Query...' : `Sign In as ${usertype}`}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '20px', paddingTop: '14px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
            ADMIN ACCESS CREDENTIALS
          </div>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('Admin', 'shlokshah412@gmail.com', 'Admin@412')}
            className="btn btn-sm btn-outline" 
            style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.75rem', padding: '6px 10px' }}
          >
            <span>Admin: <strong>shlokshah412@gmail.com</strong></span>
            <span className="badge badge-emerald">Quick Fill</span>
          </button>
        </div>

      </div>
    </div>
  );
}
