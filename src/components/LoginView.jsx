import React, { useState } from 'react';
import { LogIn, KeyRound, ShieldAlert, CheckCircle2, User, Eye, EyeOff, Shield } from 'lucide-react';
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
      setErrorMessage('Please enter both username/email and password.');
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
      setErrorMessage('Invalid credentials or mismatched role for the requested account.');
    }
  };

  const handleQuickLogin = (role, user, pass) => {
    setUsertype(role);
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div style={{ maxWidth: '460px', margin: '24px auto 0' }}>
      <div className="card-panel" style={{ padding: '32px 28px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
          }}>
            <LogIn size={22} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Academic Portal Sign In
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Authenticate session against SQL table <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>dbo.regdb</code>
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.12)', 
            border: '1px solid rgba(244, 63, 94, 0.3)', 
            padding: '12px 14px', 
            borderRadius: 'var(--radius-sm)', 
            color: 'var(--accent-rose)', 
            fontSize: '0.8125rem', 
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Role Switcher */}
          <div className="form-group">
            <label className="form-label">
              Role Access Level <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', background: 'var(--bg-primary)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              {['Student', 'Faculty', 'Admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUsertype(role)}
                  className={`btn btn-sm ${usertype === role ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', border: 'none', padding: '6px 8px' }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Username / Email */}
          <div className="form-group">
            <label className="form-label">
              Username or Registered Email <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. shlok or user@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              Account Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                style={{ paddingRight: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginTop: '6px' }} 
            disabled={loading}
          >
            <LogIn size={15} />
            {loading ? 'Authenticating ADO.NET...' : `Sign In as ${usertype}`}
          </button>
        </form>

        {/* Quick Credentials Helper */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '22px', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            DEMO ACCESS CREDENTIALS
          </div>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('Admin', 'shlokshah412@gmail.com', 'Admin@412')}
            className="btn btn-sm btn-outline" 
            style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.75rem', padding: '8px 12px' }}
          >
            <span>Admin: <strong>shlokshah412@gmail.com</strong></span>
            <span className="badge badge-emerald">Quick Fill</span>
          </button>
        </div>

      </div>
    </div>
  );
}
