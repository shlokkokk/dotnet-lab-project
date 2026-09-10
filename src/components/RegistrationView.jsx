import React, { useState, useEffect } from 'react';
import { UserPlus, ShieldAlert, CheckCircle2, RotateCcw, Sparkles, AlertCircle, Eye, EyeOff, Database, Plus, X, User, Lock, Mail, Phone, MapPin, Calendar, Heart, Shield } from 'lucide-react';
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

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

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

    if (checks <= 2) {
      return { score: 1, percent: 30, label: 'Weak', color: '#f43f5e' };
    } else if (checks <= 4) {
      return { score: 2, percent: 65, label: 'Medium', color: '#f59e0b' };
    } else {
      return { score: 3, percent: 100, label: 'Strong', color: '#10b981' };
    }
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleSubmitClick = (e) => {
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

    if (isValid) {
      setShowSubmitConfirm(true);
    }
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
      mobile: parseInt(formData.mobile.replace(/\D/g, ''), 10) || 0
    };

    const updated = [...existingUsers, newUser];
    setExistingUsers(updated);
    saveUsers(updated);

    // Live API call
    await registerUserApi(newUser);

    // Simulate ADO.NET query execution
    simulateRegistrationInsert(newUser);

    setSuccessMessage(`Registration successful for "${newUser.name}". Stored into dbo.regdb table.`);

    setTimeout(() => {
      onRegistrationSuccess(newUser.username, newUser.usertype);
    }, 1800);
  };

  const handleFillSample = () => {
    const sampleIndex = Math.floor(Math.random() * 1000);
    setFormData({
      name: `Rahul Sharma`,
      address: `402, Sayaji Residency, Near Polytechnic, Vadodara, Gujarat 390002`,
      birthdate: '2004-05-18',
      gender: 'Male',
      hobbies: ['Coding', 'Reading', 'Robotics'],
      age: '22',
      username: `rahul_${sampleIndex}`,
      password: 'Password@123',
      confirmpassword: 'Password@123',
      email: `rahul.sharma${sampleIndex}@msu.edu`,
      usertype: 'Student',
      mobile: '9876543210'
    });
    setTouched({});
    setIsSubmitted(false);
    setShowSampleConfirm(false);
  };

  const handleResetForm = () => {
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
    setShowResetConfirm(false);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <div className="badge badge-blue" style={{ marginBottom: '6px' }}>
          MSU Baroda &bull; Polytechnic IT Portal
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Academic Registration (RegistrationPage.aspx)
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Submit user details with ADO.NET parameterized queries targeting database table <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>dbo.regdb</code>.
        </p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          color: 'var(--accent-emerald)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
        }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Registration Successful!</div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>{successMessage}</div>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmitClick} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* SECTION 1: ACCOUNT CREDENTIALS */}
        <div className="card-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(2, 132, 199, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Account &amp; Security Credentials
              </h2>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Username, email, mobile, and authentication password
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            
            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">
                Username <span className="required">*</span>
              </label>
              <input
                id="reg-username"
                type="text"
                className={`form-input ${(touched.username || isSubmitted) && errors.username ? 'error' : touched.username && !errors.username ? 'valid' : ''}`}
                placeholder="e.g. shlok_poly"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                onBlur={() => setTouched({ ...touched, username: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-email')}
              />
              {(touched.username || isSubmitted) && errors.username && <span className="form-error">{errors.username}</span>}
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
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                onBlur={() => setTouched({ ...touched, mobile: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-password')}
              />
              {(touched.mobile || isSubmitted) && errors.mobile && <span className="form-error">{errors.mobile}</span>}
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
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              
              {/* Strength Meter */}
              {formData.password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Strength:</span>
                    <span style={{ color: pwdStrength.color, fontWeight: 700 }}>{pwdStrength.label}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${pwdStrength.percent}%`, height: '100%', background: pwdStrength.color, transition: 'all 0.3s ease' }} />
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
                placeholder="Re-enter password"
                value={formData.confirmpassword}
                onChange={(e) => setFormData({ ...formData, confirmpassword: e.target.value })}
                onBlur={() => setTouched({ ...touched, confirmpassword: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-name')}
              />
              {(touched.confirmpassword || isSubmitted) && errors.confirmpassword && <span className="form-error">{errors.confirmpassword}</span>}
            </div>

          </div>
        </div>

        {/* SECTION 2: PERSONAL DEMOGRAPHICS */}
        <div className="card-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Personal &amp; Demographic Profile
              </h2>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Full name, residential address, birthdate, and institutional role
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                className={`form-input ${(touched.name || isSubmitted) && errors.name ? 'error' : touched.name && !errors.name ? 'valid' : ''}`}
                placeholder="e.g. Shlok Shah"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onBlur={() => setTouched({ ...touched, name: true })}
                onKeyDown={(e) => handleKeyDownNext(e, 'reg-address')}
              />
              {(touched.name || isSubmitted) && errors.name && <span className="form-error">{errors.name}</span>}
            </div>

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
                placeholder="Auto-calculated"
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
                Portal Role <span className="required">*</span>
              </label>
              <select
                id="reg-role"
                className="form-select"
                value={formData.usertype}
                onChange={(e) => setFormData({ ...formData, usertype: e.target.value })}
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

          </div>

          {/* Gender */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">
              Gender <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Residential Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-address">
              Residential Address <span className="required">*</span>
            </label>
            <textarea
              id="reg-address"
              rows={2}
              className={`form-textarea ${(touched.address || isSubmitted) && errors.address ? 'error' : ''}`}
              placeholder="Enter complete residential address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              onBlur={() => setTouched({ ...touched, address: true })}
            />
            {(touched.address || isSubmitted) && errors.address && <span className="form-error">{errors.address}</span>}
          </div>

        </div>

        {/* SECTION 3: HOBBIES & INTERESTS */}
        <div className="card-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={16} />
              </div>
              <div>
                <h2 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Hobbies &amp; Extracurricular Interests
                </h2>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Select one or more interests to bind to database column
                </div>
              </div>
            </div>

            <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
              {formData.hobbies.length} Selected
            </span>
          </div>

          {/* Hobby Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {availableHobbies.map((hobby) => {
              const checked = formData.hobbies.includes(hobby);
              const isCustom = !DEFAULT_HOBBIES.includes(hobby);
              return (
                <label 
                  key={hobby} 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '0.8125rem', 
                    fontWeight: 500,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: checked ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)' : 'var(--bg-primary)',
                    border: checked ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    color: checked ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
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
                      style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', padding: '0 2px' }}
                      title="Remove hobby tag"
                    >
                      <X size={13} />
                    </button>
                  )}
                </label>
              );
            })}
          </div>

          {/* Add Custom Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ maxWidth: '240px', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.8rem', padding: '7px 12px' }}
                placeholder="Type custom hobby tag..."
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
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.785rem', padding: '7px 12px' }}
            >
              <Plus size={13} />
              Add Tag
            </button>
          </div>
          {(touched.hobbies || isSubmitted) && errors.hobbies && <span className="form-error" style={{ marginTop: '8px' }}>{errors.hobbies}</span>}
        </div>

        {/* ACTION BUTTONS TOOLBAR */}
        <div className="card-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowSampleConfirm(true)}
              className="btn btn-sm btn-secondary"
            >
              <Sparkles size={14} style={{ color: 'var(--accent-amber)' }} />
              Fill Sample Data
            </button>

            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="btn btn-sm btn-outline"
            >
              <RotateCcw size={14} />
              Reset Form
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ padding: '10px 24px', fontSize: '0.875rem' }}
          >
            <UserPlus size={16} />
            Submit Registration
          </button>

        </div>

      </form>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showSubmitConfirm}
        title="Confirm Student Registration"
        message={`Save "${formData.name}" (@${formData.username}) to SQL table dbo.regdb?`}
        confirmText="Yes, Save to Database"
        cancelText="Review Form"
        onConfirm={executeConfirmedSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Registration Form"
        message="Are you sure you want to clear all input fields?"
        confirmText="Yes, Clear Form"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleResetForm}
        onCancel={() => setShowResetConfirm(false)}
      />

      <ConfirmModal
        isOpen={showSampleConfirm}
        title="Auto-Fill Sample Data"
        message="Populate the registration form with realistic student data?"
        confirmText="Yes, Fill Data"
        cancelText="Cancel"
        onConfirm={handleFillSample}
        onCancel={() => setShowSampleConfirm(false)}
      />

    </div>
  );
}
