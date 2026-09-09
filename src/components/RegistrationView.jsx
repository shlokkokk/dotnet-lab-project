import React, { useState, useEffect } from 'react';
import { UserPlus, ShieldAlert, CheckCircle2, RotateCcw, Sparkles, AlertCircle, Eye, EyeOff, Database, Plus, X } from 'lucide-react';
import { fetchUsers, registerUserApi, saveUsers } from '../services/db';
import { simulateRegistrationInsert } from '../services/adoSimulator';
import ConfirmModal from './ConfirmModal';

const DEFAULT_HOBBIES = ['Reading', 'Playing', 'Dancing', 'Coding', 'Music', 'Robotics'];

export default function RegistrationView({ onRegistrationSuccess, onNavigateToDb }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    birthdate: '',
    gender: 'Male',
    hobbies: ['Reading'],
    age: '',
    username: '',
    password: '',
    confirmpassword: '',
    email: '',
    usertype: 'Student',
    mobile: ''
  });

  const [availableHobbies, setAvailableHobbies] = useState(DEFAULT_HOBBIES);
  const [customHobbyInput, setCustomHobbyInput] = useState('');

  const [existingUsers, setExistingUsers] = useState([]);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modals
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const u = await fetchUsers();
      if (u) setExistingUsers(u);
    };
    load();
  }, []);

  const handleKeyDownNext = (e, nextId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const el = document.getElementById(nextId);
      if (el) {
        el.focus();
      }
    }
  };

  const handleBirthdateChange = (e) => {
    const bdate = e.target.value;
    let calculatedAge = formData.age;
    if (bdate) {
      const today = new Date();
      const birthDate = new Date(bdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 0 && age <= 120) {
        calculatedAge = String(age);
      }
    }
    setFormData((prev) => ({
      ...prev,
      birthdate: bdate,
      age: calculatedAge
    }));
  };

  const handleHobbyToggle = (hobby) => {
    setFormData((prev) => {
      const exists = prev.hobbies.includes(hobby);
      const updated = exists ? prev.hobbies.filter((h) => h !== hobby) : [...prev.hobbies, hobby];
      return { ...prev, hobbies: updated };
    });
  };

  const handleAddCustomHobby = (e) => {
    if (e) e.preventDefault();
    const clean = customHobbyInput.trim();
    if (!clean) return;

    if (!availableHobbies.includes(clean)) {
      setAvailableHobbies((prev) => [...prev, clean]);
    }
    if (!formData.hobbies.includes(clean)) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, clean]
      }));
    }
    setCustomHobbyInput('');
  };

  const handleRemoveCustomHobby = (hobby, e) => {
    e.stopPropagation();
    setAvailableHobbies((prev) => prev.filter((h) => h !== hobby));
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((h) => h !== hobby)
    }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Full name must contain at least 2 characters.';
    }

    if (!formData.address.trim()) {
      errors.address = 'Residential address is required.';
    }

    if (!formData.birthdate) {
      errors.birthdate = 'Birthdate must be selected.';
    } else {
      const bYear = new Date(formData.birthdate).getFullYear();
      const currYear = new Date().getFullYear();
      if (bYear > currYear) {
        errors.birthdate = 'Birthdate cannot be in the future.';
      }
    }
    
    const numAge = parseInt(formData.age, 10);
    if (!formData.age || isNaN(numAge) || numAge < 16 || numAge > 100) {
      errors.age = 'Age must be between 16 and 100.';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required.';
    } else if (existingUsers.some((u) => (u.username || '').toLowerCase() === formData.username.trim().toLowerCase())) {
      errors.username = 'Username already registered in database.';
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    } else if (existingUsers.some((u) => (u.email || '').toLowerCase() === formData.email.trim().toLowerCase())) {
      errors.email = 'Email address is already registered in database.';
    }

    const mobileClean = formData.mobile.replace(/\D/g, '');
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required.';
    } else if (mobileClean.length !== 10) {
      errors.mobile = 'Mobile number must be exactly 10 digits.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmpassword) {
      errors.confirmpassword = 'Passwords do not match.';
    }

    if (formData.hobbies.length === 0) {
      errors.hobbies = 'Select at least one hobby.';
    }

    return errors;
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, percent: 0, label: '', color: 'transparent' };
    
    let checks = 0;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const isLongEnough = pwd.length >= 8;
    const isVeryLong = pwd.length >= 12;

    if (hasLower) checks++;
    if (hasUpper) checks++;
    if (hasDigit) checks++;
    if (hasSpecial) checks++;
    if (isLongEnough) checks++;
    if (isVeryLong) checks++;

    if (pwd.length < 6) {
      return { score: 1, percent: 25, label: 'Too Short (< 6 chars)', color: 'var(--accent-rose)' };
    }

    if (checks <= 2) {
      return { score: 1, percent: 35, label: 'Weak', color: 'var(--accent-rose)' };
    }
    if (checks <= 4) {
      return { score: 2, percent: 70, label: 'Moderate', color: 'var(--accent-amber)' };
    }
    return { score: 3, percent: 100, label: 'Strong', color: 'var(--accent-emerald)' };
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleFormSubmitClick = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTouched({
      name: true,
      address: true,
      birthdate: true,
      age: true,
      username: true,
      password: true,
      confirmpassword: true,
      email: true,
      mobile: true
    });

    if (!isValid) return;

    // Open confirmation modal
    setShowSubmitConfirm(true);
  };

  const executeConfirmedSubmit = async () => {
    setShowSubmitConfirm(false);

    const newUser = {
      id: Date.now(),
      name: formData.name.trim(),
      address: formData.address.trim(),
      birthdate: formData.birthdate,
      gender: formData.gender,
      hobbies: formData.hobbies.join(', '),
      age: formData.age,
      username: formData.username.trim(),
      password: formData.password,
      confirmpassword: formData.confirmpassword,
      email: formData.email.trim(),
      usertype: formData.usertype,
      mobile: formData.mobile.trim(),
      createdAt: new Date().toISOString()
    };

    saveUsers([newUser, ...existingUsers]);
    setExistingUsers((prev) => [newUser, ...prev]);

    await registerUserApi(newUser);
    simulateRegistrationInsert(newUser);

    setSuccessMessage({
      title: 'Registration Record Successfully Created',
      username: newUser.username,
      usertype: newUser.usertype
    });
  };

  const executeConfirmedReset = () => {
    setShowResetConfirm(false);
    setFormData({
      name: '',
      address: '',
      birthdate: '',
      gender: 'Male',
      hobbies: ['Reading'],
      age: '',
      username: '',
      password: '',
      confirmpassword: '',
      email: '',
      usertype: 'Student',
      mobile: ''
    });
    setTouched({});
    setIsSubmitted(false);
    setSuccessMessage(null);
  };

  const handleSampleDataClick = () => {
    setShowSampleConfirm(true);
  };

  const executeConfirmedSampleData = () => {
    setShowSampleConfirm(false);
    const rnd = Math.floor(100 + Math.random() * 900);
    const randomMobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    setFormData({
      name: `Student User ${rnd}`,
      address: `Campus Residence, University Road, Vadodara`,
      birthdate: `2004-05-15`,
      gender: `Male`,
      hobbies: ['Coding', 'Reading', 'Robotics'],
      age: `20`,
      username: `student_${rnd}`,
      password: `Pass@${rnd}#2024`,
      confirmpassword: `Pass@${rnd}#2024`,
      email: `student${rnd}@example.com`,
      usertype: `Student`,
      mobile: randomMobile
    });
    setTouched({});
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      
      {/* Top Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom: '4px' }}>
            Academic Registration System
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Student &amp; Faculty Registration Portal
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Stores structured records in database table <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>dbo.regdb</code>
          </p>
        </div>

        <button onClick={handleSampleDataClick} className="btn btn-secondary btn-sm" title="Populate valid demo attributes">
          <Sparkles size={13} style={{ color: 'var(--accent-amber)' }} />
          Quick-Fill Sample Data
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="card-panel" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.08)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={22} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {successMessage.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: '12px' }}>
                Account for <strong>{successMessage.username}</strong> ({successMessage.usertype}) is verified and persisted in <code style={{ fontFamily: 'var(--font-mono)' }}>dbo.regdb</code>.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-sm btn-primary" onClick={() => onRegistrationSuccess(successMessage.username, successMessage.usertype)}>
                  Go to Login
                </button>
                <button className="btn btn-sm btn-secondary" onClick={onNavigateToDb}>
                  <Database size={12} />
                  View in dbo.regdb Table
                </button>
                <button className="btn btn-sm btn-outline" onClick={() => setSuccessMessage(null)}>
                  Create Another Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="card-panel" style={{ padding: '24px' }}>
        <form onSubmit={handleFormSubmitClick} noValidate>
          
          {/* Section 1 */}
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
            1. PERSONAL PROFILE
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                className={`form-input ${(touched.name || isSubmitted) && errors.name ? 'error' : touched.name && !errors.name ? 'valid' : ''}`}
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onBlur={() => setTouched({ ...touched, name: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-email')}
              />
              {(touched.name || isSubmitted) && errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                className={`form-input ${(touched.email || isSubmitted) && errors.email ? 'error' : touched.email && !errors.email ? 'valid' : ''}`}
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => setTouched({ ...touched, email: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-mobile')}
              />
              {(touched.email || isSubmitted) && errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-mobile">
                Mobile Number (10 Digits) <span className="required">*</span>
              </label>
              <input
                id="reg-mobile"
                type="tel"
                maxLength={10}
                className={`form-input ${(touched.mobile || isSubmitted) && errors.mobile ? 'error' : touched.mobile && !errors.mobile ? 'valid' : ''}`}
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                onBlur={() => setTouched({ ...touched, mobile: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-address')}
              />
              {(touched.mobile || isSubmitted) && errors.mobile && <span className="form-error">{errors.mobile}</span>}
            </div>

          </div>

          {/* Address */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" htmlFor="reg-address">
              Residential Address <span className="required">*</span>
            </label>
            <textarea
              id="reg-address"
              rows={2}
              className={`form-textarea ${(touched.address || isSubmitted) && errors.address ? 'error' : ''}`}
              placeholder="Enter residential address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              onBlur={() => setTouched({ ...touched, address: true })}
            />
            {(touched.address || isSubmitted) && errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          {/* Demographic Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            
            {/* Birthdate */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-birthdate">
                Birthdate <span className="required">*</span>
              </label>
              <input
                id="reg-birthdate"
                type="date"
                className={`form-input ${(touched.birthdate || isSubmitted) && errors.birthdate ? 'error' : ''}`}
                value={formData.birthdate}
                onChange={handleBirthdateChange}
                onBlur={() => setTouched({ ...touched, birthdate: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-age')}
              />
              {(touched.birthdate || isSubmitted) && errors.birthdate && <span className="form-error">{errors.birthdate}</span>}
            </div>

            {/* Age */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-age">
                Age (Years) <span className="required">*</span>
              </label>
              <input
                id="reg-age"
                type="number"
                min="16"
                max="100"
                className={`form-input ${(touched.age || isSubmitted) && errors.age ? 'error' : ''}`}
                placeholder="Auto-calculated or enter age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                onBlur={() => setTouched({ ...touched, age: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-role')}
              />
              {(touched.age || isSubmitted) && errors.age && <span className="form-error">{errors.age}</span>}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">
                User Role <span className="required">*</span>
              </label>
              <select
                id="reg-role"
                className="form-select"
                value={formData.usertype}
                onChange={(e) => setFormData({ ...formData, usertype: e.target.value })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-username')}
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

          </div>

          {/* Gender */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">
              Gender <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* Hobbies with Custom Add option */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <div className="form-label-row">
              <span className="form-label">
                Hobbies &amp; Interests <span className="required">*</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {formData.hobbies.length} selected
              </span>
            </div>

            {/* Hobby Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {availableHobbies.map((hobby) => {
                const checked = formData.hobbies.includes(hobby);
                const isCustom = !DEFAULT_HOBBIES.includes(hobby);
                return (
                  <label 
                    key={hobby} 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '0.785rem', 
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: checked ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-primary)',
                      border: checked ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                      color: checked ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleHobbyToggle(hobby)}
                    />
                    <span>{hobby}</span>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveCustomHobby(hobby, e)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 2px' }}
                        title="Remove custom hobby"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Add Custom Hobby Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.775rem', padding: '6px 10px' }}
                  placeholder="Type custom hobby..."
                  value={customHobbyInput}
                  onChange={(e) => setCustomHobbyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomHobby();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomHobby}
                className="btn btn-sm btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                title="Add to hobbies list"
              >
                <Plus size={12} />
                Add Hobby
              </button>
            </div>

            {errors.hobbies && isSubmitted && <span className="form-error">{errors.hobbies}</span>}
          </div>

          {/* Section 2: Security */}
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
            2. ACCOUNT SECURITY
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            
            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">
                Portal Username <span className="required">*</span>
              </label>
              <input
                id="reg-username"
                type="text"
                className={`form-input ${(touched.username || isSubmitted) && errors.username ? 'error' : touched.username && !errors.username ? 'valid' : ''}`}
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.trim() })}
                onBlur={() => setTouched({ ...touched, username: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-password')}
              />
              {(touched.username || isSubmitted) && errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="reg-password">Password <span className="required">*</span></label>
                <span style={{ fontSize: '0.7rem', color: pwdStrength.color, fontWeight: 600 }}>
                  {pwdStrength.label}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${(touched.password || isSubmitted) && errors.password ? 'error' : ''}`}
                  placeholder="Min 6 characters"
                  style={{ paddingRight: '38px' }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  onKeyDown={(e) => handleKeyDownNext(e, 'reg-confirmpassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {formData.password && (
                <div style={{ marginTop: '5px' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          borderRadius: '2px',
                          background: pwdStrength.score >= step ? pwdStrength.color : 'var(--border-subtle)',
                          transition: 'background 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {(touched.password || isSubmitted) && errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirmpassword">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                id="reg-confirmpassword"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${(touched.confirmpassword || isSubmitted) && errors.confirmpassword ? 'error' : touched.confirmpassword && !errors.confirmpassword ? 'valid' : ''}`}
                placeholder="Confirm password"
                style={{ paddingRight: '38px' }}
                value={formData.confirmpassword}
                onChange={(e) => setFormData({ ...formData, confirmpassword: e.target.value })}
                onBlur={() => setTouched({ ...touched, confirmpassword: true })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFormSubmitClick(e);
                  }
                }}
              />
              {(touched.confirmpassword || isSubmitted) && errors.confirmpassword && <span className="form-error">{errors.confirmpassword}</span>}
            </div>

          </div>

          {/* Validation Summary Notification */}
          {isSubmitted && Object.keys(errors).length > 0 && (
            <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <ShieldAlert size={14} />
                <span>Please correct the following errors</span>
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.75rem', color: 'var(--accent-rose)', lineHeight: 1.45 }}>
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button type="button" onClick={() => setShowResetConfirm(true)} className="btn btn-outline">
              <RotateCcw size={13} />
              Reset Form
            </button>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={14} />
              Submit Registration
            </button>
          </div>

        </form>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmModal
        isOpen={showSubmitConfirm}
        title="Confirm Registration Submission"
        message={`Are you sure you want to register ${formData.name || 'this user'} as ${formData.usertype} and save the record to dbo.regdb?`}
        confirmText="Yes, Submit"
        cancelText="Review Form"
        onConfirm={executeConfirmedSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Registration Form"
        message="Are you sure you want to clear all entered fields? Any unsaved data will be lost."
        confirmText="Yes, Reset"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={executeConfirmedReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      <ConfirmModal
        isOpen={showSampleConfirm}
        title="Populate Sample Data"
        message="Are you sure you want to auto-fill sample registration data? Any current input in the form will be replaced."
        confirmText="Yes, Auto-Fill"
        cancelText="Cancel"
        onConfirm={executeConfirmedSampleData}
        onCancel={() => setShowSampleConfirm(false)}
      />

    </div>
  );
}
