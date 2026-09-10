import React, { useState, useEffect } from 'react';
import {
  UserPlus, CheckCircle2, RotateCcw, Sparkles, Eye, EyeOff,
  Plus, X, User, Lock, Heart
} from 'lucide-react';
import { fetchUsers, registerUserApi, saveUsers } from '../services/db';
import { simulateRegistrationInsert } from '../services/adoSimulator';
import ConfirmModal from './ConfirmModal';

const DEFAULT_HOBBIES = ['Reading', 'Playing', 'Dancing', 'Coding', 'Music', 'Robotics'];

export default function RegistrationView({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    name: '', address: '', birthdate: '', gender: 'Male',
    hobbies: ['Reading'], age: '', username: '', password: '',
    confirmpassword: '', email: '', usertype: 'Student', mobile: ''
  });

  const [availableHobbies, setAvailableHobbies] = useState(DEFAULT_HOBBIES);
  const [customHobbyInput, setCustomHobbyInput] = useState('');
  const [existingUsers, setExistingUsers] = useState([]);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);

  useEffect(() => {
    fetchUsers().then(u => { if (u) setExistingUsers(u); });
  }, []);

  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }));
  const touch = (key) => setTouched(p => ({ ...p, [key]: true }));

  const handleBirthdateChange = (e) => {
    const bdate = e.target.value;
    let age = formData.age;
    if (bdate) {
      const today = new Date();
      const bd = new Date(bdate);
      let a = today.getFullYear() - bd.getFullYear();
      const m = today.getMonth() - bd.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
      if (a >= 0 && a <= 120) age = String(a);
    }
    setFormData(p => ({ ...p, birthdate: bdate, age }));
  };

  const handleHobbyToggle = (h) =>
    setFormData(p => ({
      ...p, hobbies: p.hobbies.includes(h)
        ? p.hobbies.filter(x => x !== h)
        : [...p.hobbies, h]
    }));

  const handleAddCustomHobby = (e) => {
    if (e) e.preventDefault();
    const c = customHobbyInput.trim();
    if (!c) return;
    if (!availableHobbies.includes(c)) setAvailableHobbies(p => [...p, c]);
    if (!formData.hobbies.includes(c)) setFormData(p => ({ ...p, hobbies: [...p.hobbies, c] }));
    setCustomHobbyInput('');
  };

  const handleRemoveCustomHobby = (h, e) => {
    e.stopPropagation();
    setAvailableHobbies(p => p.filter(x => x !== h));
    setFormData(p => ({ ...p, hobbies: p.hobbies.filter(x => x !== h) }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) e.name = 'Full name required (min 2 chars).';
    if (!formData.address.trim()) e.address = 'Address is required.';
    if (!formData.birthdate) e.birthdate = 'Birthdate is required.';
    else if (new Date(formData.birthdate).getFullYear() > new Date().getFullYear()) e.birthdate = 'Birthdate cannot be future.';
    const numAge = parseInt(formData.age, 10);
    if (!formData.age || isNaN(numAge) || numAge < 16 || numAge > 100) e.age = 'Age must be 16–100.';
    if (!formData.username.trim()) e.username = 'Username is required.';
    else if (existingUsers.some(u => (u.username || '').toLowerCase() === formData.username.trim().toLowerCase())) e.username = 'Username already taken.';
    const emailRx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formData.email.trim()) e.email = 'Email is required.';
    else if (!emailRx.test(formData.email.trim())) e.email = 'Invalid email format.';
    else if (existingUsers.some(u => (u.email || '').toLowerCase() === formData.email.trim().toLowerCase())) e.email = 'Email already registered.';
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length !== 10) e.mobile = 'Valid 10-digit mobile required.';
    if (!formData.password) e.password = 'Password required.';
    else if (formData.password.length < 6) e.password = 'Min 6 characters.';
    if (formData.password !== formData.confirmpassword) e.confirmpassword = 'Passwords do not match.';
    if (formData.hobbies.length === 0) e.hobbies = 'Select at least one hobby.';
    return e;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { percent: 0, label: '', color: 'transparent' };
    let s = 0;
    if (/[a-z]/.test(pwd)) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    if (pwd.length >= 8) s++;
    if (pwd.length >= 12) s++;
    if (s <= 2) return { percent: 30, label: 'Weak', color: 'var(--accent-rose)' };
    if (s <= 4) return { percent: 65, label: 'Medium', color: 'var(--accent-amber)' };
    return { percent: 100, label: 'Strong', color: 'var(--accent-emerald)' };
  };

  const pwdStr = getPasswordStrength(formData.password);

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTouched({ name: true, address: true, birthdate: true, age: true, username: true, password: true, confirmpassword: true, email: true, mobile: true });
    if (isValid) setShowSubmitConfirm(true);
  };

  const executeConfirmedSubmit = async () => {
    setShowSubmitConfirm(false);
    const newUser = {
      id: Date.now(),
      name: formData.name.trim(), address: formData.address.trim(),
      birthdate: formData.birthdate, gender: formData.gender,
      hobbies: formData.hobbies.join(', '), age: formData.age,
      username: formData.username.trim(), password: formData.password,
      confirmpassword: formData.confirmpassword,
      email: formData.email.trim(), usertype: formData.usertype,
      mobile: parseInt(formData.mobile.replace(/\D/g, ''), 10) || 0
    };
    const updated = [...existingUsers, newUser];
    setExistingUsers(updated);
    saveUsers(updated);
    await registerUserApi(newUser);
    simulateRegistrationInsert(newUser);
    setSuccessMessage(`"${newUser.name}" registered and saved to dbo.regdb.`);
    setTimeout(() => onRegistrationSuccess(newUser.username, newUser.usertype), 1800);
  };

  const handleFillSample = () => {
    const idx = Math.floor(Math.random() * 1000);
    setFormData({
      name: 'Rahul Sharma', address: '402, Sayaji Residency, Vadodara, Gujarat 390002',
      birthdate: '2004-05-18', gender: 'Male', hobbies: ['Coding', 'Reading', 'Robotics'],
      age: '22', username: `rahul_${idx}`, password: 'Password@123',
      confirmpassword: 'Password@123', email: `rahul.sharma${idx}@msu.edu`,
      usertype: 'Student', mobile: '9876543210'
    });
    setTouched({});
    setIsSubmitted(false);
    setShowSampleConfirm(false);
  };

  const handleResetForm = () => {
    setFormData({
      name: '', address: '', birthdate: '', gender: 'Male', hobbies: ['Reading'],
      age: '', username: '', password: '', confirmpassword: '', email: '',
      usertype: 'Student', mobile: ''
    });
    setTouched({});
    setIsSubmitted(false);
    setShowResetConfirm(false);
  };

  const fieldErr = (key) => (touched[key] || isSubmitted) && errors[key] ? errors[key] : null;
  const fieldOk  = (key) => touched[key] && !errors[key];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-up">

      {/* Page header */}
      <div className="page-header">
        <div className="badge badge-blue" style={{ marginBottom: '8px' }}>
          MSU Baroda · Polytechnic IT Portal
        </div>
        <h1>Student Registration</h1>
        <p>
          ADO.NET parameterized INSERT targeting{' '}
          <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.85em' }}>dbo.regdb</code>
        </p>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>Registration Successful</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{successMessage}</div>
          </div>
        </div>
      )}

      {/* ── Single unified form card ── */}
      <form onSubmit={handleSubmitClick} noValidate>
        <div className="card-panel" style={{ overflow: 'hidden' }}>

          {/* Card header */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '10px',
            background: 'rgba(0,0,0,0.12)'
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                New Registration Form
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                All fields marked * are required
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setShowSampleConfirm(true)} className="btn btn-secondary btn-sm">
                <Sparkles size={13} style={{ color: 'var(--accent-amber)' }} />
                Fill Sample
              </button>
              <button type="button" onClick={() => setShowResetConfirm(true)} className="btn btn-outline btn-sm">
                <RotateCcw size={13} />
                Reset
              </button>
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── SECTION: Credentials ── */}
            <div className="form-section-label">
              <Lock size={12} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
              Account Credentials
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>

              {/* Username */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-username">
                  Username <span className="required">*</span>
                </label>
                <input
                  id="reg-username" type="text"
                  className={`form-input ${fieldErr('username') ? 'error' : fieldOk('username') ? 'valid' : ''}`}
                  placeholder="e.g. shlok_poly"
                  value={formData.username}
                  onChange={e => set('username', e.target.value)}
                  onBlur={() => touch('username')}
                />
                {fieldErr('username') && <span className="form-error">{fieldErr('username')}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="reg-email" type="email"
                  className={`form-input ${fieldErr('email') ? 'error' : fieldOk('email') ? 'valid' : ''}`}
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={e => set('email', e.target.value)}
                  onBlur={() => touch('email')}
                />
                {fieldErr('email') && <span className="form-error">{fieldErr('email')}</span>}
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-mobile">
                  Mobile (10 digits) <span className="required">*</span>
                </label>
                <input
                  id="reg-mobile" type="tel" maxLength={10}
                  className={`form-input ${fieldErr('mobile') ? 'error' : fieldOk('mobile') ? 'valid' : ''}`}
                  placeholder="10-digit number"
                  value={formData.mobile}
                  onChange={e => set('mobile', e.target.value.replace(/\D/g, ''))}
                  onBlur={() => touch('mobile')}
                />
                {fieldErr('mobile') && <span className="form-error">{fieldErr('mobile')}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${fieldErr('password') ? 'error' : ''}`}
                    placeholder="Min 6 characters"
                    style={{ paddingRight: '40px' }}
                    value={formData.password}
                    onChange={e => set('password', e.target.value)}
                    onBlur={() => touch('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {formData.password && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Strength</span>
                      <span style={{ color: pwdStr.color, fontWeight: 700 }}>{pwdStr.label}</span>
                    </div>
                    <div style={{ height: '3px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                      <div style={{ width: `${pwdStr.percent}%`, height: '100%', background: pwdStr.color, transition: 'width 0.35s ease, background 0.35s ease', borderRadius: 'var(--r-full)' }} />
                    </div>
                  </div>
                )}
                {fieldErr('password') && <span className="form-error">{fieldErr('password')}</span>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${fieldErr('confirmpassword') ? 'error' : fieldOk('confirmpassword') ? 'valid' : ''}`}
                  placeholder="Re-enter password"
                  value={formData.confirmpassword}
                  onChange={e => set('confirmpassword', e.target.value)}
                  onBlur={() => touch('confirmpassword')}
                />
                {fieldErr('confirmpassword') && <span className="form-error">{fieldErr('confirmpassword')}</span>}
              </div>

            </div>

            {/* ── SECTION: Personal Info ── */}
            <div className="form-section-label" style={{ marginTop: '4px' }}>
              <User size={12} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
              Personal Details
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="reg-name" type="text"
                  className={`form-input ${fieldErr('name') ? 'error' : fieldOk('name') ? 'valid' : ''}`}
                  placeholder="e.g. Shlok Shah"
                  value={formData.name}
                  onChange={e => set('name', e.target.value)}
                  onBlur={() => touch('name')}
                />
                {fieldErr('name') && <span className="form-error">{fieldErr('name')}</span>}
              </div>

              {/* Birthdate */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-birthdate">
                  Birthdate <span className="required">*</span>
                </label>
                <input
                  id="reg-birthdate" type="date"
                  className={`form-input ${fieldErr('birthdate') ? 'error' : ''}`}
                  value={formData.birthdate}
                  onChange={handleBirthdateChange}
                  onBlur={() => touch('birthdate')}
                />
                {fieldErr('birthdate') && <span className="form-error">{fieldErr('birthdate')}</span>}
              </div>

              {/* Age */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-age">
                  Age <span className="required">*</span>
                </label>
                <input
                  id="reg-age" type="number" min="16" max="100"
                  className={`form-input ${fieldErr('age') ? 'error' : ''}`}
                  placeholder="Auto-calculated"
                  value={formData.age}
                  onChange={e => set('age', e.target.value)}
                  onBlur={() => touch('age')}
                />
                {fieldErr('age') && <span className="form-error">{fieldErr('age')}</span>}
              </div>

              {/* Role */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-role">
                  Portal Role <span className="required">*</span>
                </label>
                <select
                  id="reg-role" className="form-select"
                  value={formData.usertype}
                  onChange={e => set('usertype', e.target.value)}
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

            </div>

            {/* Gender */}
            <div className="form-group">
              <label className="form-label">Gender <span className="required">*</span></label>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', paddingTop: '2px' }}>
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)', userSelect: 'none' }}>
                    <input
                      type="radio" name="gender" value={g}
                      checked={formData.gender === g}
                      onChange={() => set('gender', g)}
                      style={{ accentColor: 'var(--accent-cyan)' }}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-address">
                Residential Address <span className="required">*</span>
              </label>
              <textarea
                id="reg-address" rows={2}
                className={`form-textarea ${fieldErr('address') ? 'error' : ''}`}
                placeholder="Full residential address"
                value={formData.address}
                onChange={e => set('address', e.target.value)}
                onBlur={() => touch('address')}
              />
              {fieldErr('address') && <span className="form-error">{fieldErr('address')}</span>}
            </div>

            {/* ── SECTION: Hobbies ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <div className="form-section-label" style={{ flex: 1 }}>
                <Heart size={12} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                Hobbies &amp; Interests
              </div>
              <span className="badge badge-amber">{formData.hobbies.length} Selected</span>
            </div>

            {/* Hobby chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableHobbies.map(h => {
                const sel = formData.hobbies.includes(h);
                const isCustom = !DEFAULT_HOBBIES.includes(h);
                return (
                  <span
                    key={h}
                    className={`hobby-chip ${sel ? 'selected' : ''}`}
                    onClick={() => handleHobbyToggle(h)}
                  >
                    <input
                      type="checkbox" checked={sel}
                      onChange={() => handleHobbyToggle(h)}
                      style={{ display: 'none' }}
                    />
                    {h}
                    {isCustom && (
                      <button
                        type="button"
                        onClick={e => handleRemoveCustomHobby(h, e)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', padding: 0, marginLeft: '2px' }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Custom hobby input */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                style={{ maxWidth: '220px', fontSize: '0.8rem', padding: '7px 12px' }}
                placeholder="Add custom hobby..."
                value={customHobbyInput}
                onChange={e => setCustomHobbyInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomHobby(); } }}
              />
              <button type="button" onClick={handleAddCustomHobby} className="btn btn-sm btn-outline">
                <Plus size={13} />
                Add Tag
              </button>
            </div>
            {fieldErr('hobbies') && <span className="form-error">{fieldErr('hobbies')}</span>}

          </div>

          {/* Card footer / submit */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', justifyContent: 'flex-end',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <button type="submit" className="btn btn-primary btn-lg">
              <UserPlus size={16} />
              Submit Registration
            </button>
          </div>

        </div>
      </form>

      {/* Modals */}
      <ConfirmModal
        isOpen={showSubmitConfirm}
        title="Confirm Registration"
        message={`Save "${formData.name}" (@${formData.username}) to dbo.regdb?`}
        confirmText="Yes, Register"
        cancelText="Review"
        onConfirm={executeConfirmedSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Form"
        message="Clear all input fields? This cannot be undone."
        confirmText="Clear Form"
        cancelText="Cancel"
        isDanger
        onConfirm={handleResetForm}
        onCancel={() => setShowResetConfirm(false)}
      />
      <ConfirmModal
        isOpen={showSampleConfirm}
        title="Auto-Fill Sample Data"
        message="Populate the form with realistic student data?"
        confirmText="Fill Data"
        cancelText="Cancel"
        onConfirm={handleFillSample}
        onCancel={() => setShowSampleConfirm(false)}
      />
    </div>
  );
}
