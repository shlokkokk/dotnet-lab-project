import React, { useState } from 'react';
import { LogIn, ShieldAlert, Eye, EyeOff, Shield } from 'lucide-react';
import { getStoredUsers, loginUserApi } from '../services/db';
import { simulateLoginQuery } from '../services/adoSimulator';

const ROLES = ['Student', 'Faculty', 'Admin'];

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
    if (apiResult?.success && apiResult?.user) { onLoginSuccess(apiResult.user); return; }
    const users = getStoredUsers();
    const matched = users.find(u =>
      ((u.username || '').toLowerCase() === username.trim().toLowerCase() ||
       (u.email    || '').toLowerCase() === username.trim().toLowerCase()) &&
      u.password === password && u.usertype === usertype
    );
    if (matched) onLoginSuccess(matched);
    else setErrorMessage('Invalid credentials or role mismatch.');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '20px auto 0' }} className="fade-up">
      <div className="card-panel" style={{ overflow: 'hidden' }}>

        {/* Gradient top bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-indigo), var(--accent-violet))' }} />

        <div style={{ padding: '32px 28px 28px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: 'var(--r-md)',
              background: 'linear-gradient(135deg, rgba(2,132,199,0.2) 0%, rgba(99,102,241,0.2) 100%)',
              color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', border: '1px solid rgba(56,189,248,0.25)',
              boxShadow: '0 4px 20px rgba(2,132,199,0.2)'
            }}>
              <LogIn size={24} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Portal Sign In
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Authenticating via{' '}
              <span style={{ color: 'var(--accent-cyan)' }}>dbo.regdb</span>
            </p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Role picker */}
            <div className="form-group">
              <label className="form-label">
                <Shield size={12} />
                Role Access Level <span className="required">*</span>
              </label>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px',
                background: 'var(--bg-primary)', padding: '4px',
                borderRadius: 'var(--r-sm)', border: '1px solid var(--border-soft)'
              }}>
                {ROLES.map(r => (
                  <button
                    key={r} type="button"
                    onClick={() => setUsertype(r)}
                    className={`btn btn-sm ${usertype === r ? 'btn-primary' : 'btn-outline'}`}
                    style={{ border: 'none', padding: '6px', justifyContent: 'center' }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-username">
                Username or Email <span className="required">*</span>
              </label>
              <input
                id="login-username" type="text"
                className="form-input"
                placeholder="username or email address"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter password"
                  style={{ paddingRight: '42px' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '4px' }}
              disabled={loading}
            >
              <LogIn size={16} />
              {loading ? 'Authenticating...' : `Sign In as ${usertype}`}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', marginBottom: '10px' }}>
              DEMO ACCESS
            </div>
            <button
              type="button"
              onClick={() => { setUsertype('Admin'); setUsername('shlokshah412@gmail.com'); setPassword('Admin@412'); setErrorMessage(null); }}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.785rem', padding: '10px 14px' }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>
                Admin — <strong style={{ color: 'var(--text-primary)' }}>shlokshah412@gmail.com</strong>
              </span>
              <span className="badge badge-emerald">Quick Fill</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
