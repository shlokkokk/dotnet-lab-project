import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, CheckSquare, Upload, CheckCircle2,
  Image as ImageIcon, Check, AlertCircle, Award
} from 'lucide-react';
import { fetchStudentElectives, saveStudentElectives, getStudentPhoto, saveStudentPhoto } from '../services/db';
import ConfirmModal from './ConfirmModal';

const courseCatalog = [
  { code: 'IT-301', branch: 'Information Technology', duration: '3 Years', intake: '60 Seats', subjects: ['Dot Net Technologies', 'Mobile App Dev', 'Computer Networks', 'Database Management', 'Cloud Infrastructure'] },
  { code: 'CE-302', branch: 'Computer Engineering', duration: '3 Years', intake: '120 Seats', subjects: ['Data Structures & Algorithms', 'Operating Systems', 'Microprocessor Systems', 'Software Engineering', 'AI Fundamentals'] },
  { code: 'ME-303', branch: 'Mechanical Engineering', duration: '3 Years', intake: '90 Seats', subjects: ['Thermodynamics', 'Fluid Mechanics', 'Theory of Machines', 'CAD/CAM Systems', 'Manufacturing Tech'] },
  { code: 'CV-304', branch: 'Civil Engineering', duration: '3 Years', intake: '60 Seats', subjects: ['Structural Analysis', 'Geotechnical Engineering', 'Surveying & Levelling', 'Concrete Technology', 'Hydrology'] },
  { code: 'AR-305', branch: 'Architecture', duration: '5 Years', intake: '40 Seats', subjects: ['Architectural Design', 'Building Construction', 'History of Architecture', 'Landscape Design', 'Urban Planning'] },
];

const coreSubjects = [
  { code: 'IT-501', name: 'Dot Net Technologies', credits: 5 },
  { code: 'IT-502', name: 'Mobile Application Development', credits: 4 },
  { code: 'IT-503', name: 'Computer Networks & Security', credits: 4 },
  { code: 'IT-504', name: 'Database Management Systems', credits: 3 },
];

const availableElectives = [
  { code: 'ELE-511', name: 'Cyber Security & Forensics', credits: 3 },
  { code: 'ELE-512', name: 'Cloud Computing & Microservices', credits: 3 },
  { code: 'ELE-513', name: 'Web Applications & REST APIs', credits: 3 },
  { code: 'ELE-514', name: 'Computer Organization & Architecture', credits: 3 },
];

export default function StudentPortalView({ user, onLogout }) {
  const [activeSubTab, setActiveSubTab] = useState('courses');
  const [selectedElectives, setSelectedElectives] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    if (user?.username) {
      fetchStudentElectives(user.username).then(e => { if (e) setSelectedElectives(e); });
      setPhotoUrl(getStudentPhoto(user.username));
    }
  }, [user]);

  const toggleElective = (name) => {
    setSelectedElectives(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name]);
    setConfirmed(false);
  };

  const executeConfirmedSave = async () => {
    setShowSaveConfirm(false);
    if (user?.username) {
      await saveStudentElectives(user.username, selectedElectives);
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 3000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadStatus({ error: true, text: 'Only image files (.jpg, .png) are permitted.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadStatus({ error: true, text: 'File exceeds maximum size of 2MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target.result;
      setPhotoUrl(result);
      if (user?.username) saveStudentPhoto(user.username, result);
      setUploadStatus({ error: false, text: `"${file.name}" uploaded successfully.` });
    };
    reader.readAsDataURL(file);
  };

  const SUB_TABS = [
    { key: 'courses',   label: 'Courses & Branches', icon: <BookOpen size={14} /> },
    { key: 'electives', label: `Electives (${selectedElectives.length})`, icon: <CheckSquare size={14} /> },
    { key: 'upload',    label: 'Document Upload', icon: <Upload size={14} /> },
  ];

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-up">

      {/* Profile hero */}
      <div className="card-panel" style={{
        padding: '22px 24px',
        background: 'linear-gradient(135deg, rgba(2,132,199,0.12) 0%, rgba(99,102,241,0.08) 100%)',
        border: '1px solid rgba(56,189,248,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: 'var(--r-md)',
              background: 'var(--bg-tertiary)',
              border: '2px solid rgba(56,189,248,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 4px 16px rgba(2,132,199,0.25)'
            }}>
              {photoUrl
                ? <img src={photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={28} style={{ color: 'var(--text-muted)' }} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {user?.name || user?.username || 'Student'}
                </h1>
                <span className="badge badge-emerald">Active Student</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>@{user?.username}</span>
                <span style={{ color: 'var(--border-soft)' }}>·</span>
                <span>Information Technology</span>
                <span style={{ color: 'var(--border-soft)' }}>·</span>
                <span>Semester 5 · 2026–27</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)', gap: '4px', flexWrap: 'wrap' }}>
        {SUB_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveSubTab(t.key)}
            className={`btn btn-sm ${activeSubTab === t.key ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: '1 1 auto', border: 'none', justifyContent: 'center' }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── COURSES TAB ── */}
      {activeSubTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Core subjects */}
          <div className="card-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: 'var(--r-sm)', background: 'rgba(56,189,248,0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Semester 5 Core Curriculum</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Compulsory subjects this term</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {coreSubjects.map(s => (
                <div key={s.code} style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-blue">{s.code}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.credits} Credits</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{s.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                    <CheckCircle2 size={11} /> Compulsory
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Programs catalog */}
          <div className="card-panel" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', fontSize: '0.95rem' }}>
              MSU Polytechnic Diploma Programs
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {courseCatalog.map(p => (
                <div key={p.code} className="card-panel-lift" style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all 0.2s var(--ease-spring)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.branch}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.duration} · {p.intake}</div>
                    </div>
                    <span className="badge badge-slate">{p.code}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {p.subjects.map((s, i) => <span key={i} className="badge badge-slate" style={{ fontSize: '0.64rem' }}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ELECTIVES TAB ── */}
      {activeSubTab === 'electives' && (
        <div className="card-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Elective Selection — Semester 5</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>Choose your specialization track. Selections are saved to your profile.</div>
            </div>
            <button onClick={() => setShowSaveConfirm(true)} className="btn btn-primary btn-sm">
              <Check size={13} />
              Save Selection
            </button>
          </div>

          {confirmed && (
            <div className="alert alert-success" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              Elective preferences saved successfully.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {availableElectives.map(el => {
              const sel = selectedElectives.includes(el.name);
              return (
                <div
                  key={el.code}
                  onClick={() => toggleElective(el.name)}
                  style={{
                    background: sel ? 'rgba(56,189,248,0.08)' : 'var(--bg-secondary)',
                    border: `1px solid ${sel ? 'rgba(56,189,248,0.35)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--r-sm)', padding: '16px', cursor: 'pointer',
                    transition: 'all 0.2s var(--ease-spring)',
                    display: 'flex', flexDirection: 'column', gap: '10px', userSelect: 'none',
                    boxShadow: sel ? '0 0 14px rgba(56,189,248,0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-indigo">{el.code}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{el.credits} Credits</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{el.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.73rem', color: sel ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: `2px solid ${sel ? 'var(--accent-cyan)' : 'var(--border-medium)'}`, background: sel ? 'var(--accent-cyan)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s ease' }}>
                      {sel && <Check size={9} style={{ color: '#fff' }} />}
                    </div>
                    {sel ? 'Selected' : 'Click to select'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── UPLOAD TAB ── */}
      {activeSubTab === 'upload' && (
        <div className="card-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Photo &amp; Document Upload</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              ASP.NET FileUpload with ServerValidate simulation
            </div>
          </div>

          {uploadStatus && (
            <div className={`alert ${uploadStatus.error ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '16px' }}>
              {uploadStatus.error ? <AlertCircle size={16} style={{ flexShrink: 0 }} /> : <CheckCircle2 size={16} style={{ flexShrink: 0 }} />}
              {uploadStatus.text}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
            {/* Drop zone */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--r-md)', padding: '32px 20px',
              textAlign: 'center', cursor: 'pointer', position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              transition: 'border-color 0.2s ease'
            }}>
              <input type="file" accept="image/*" onChange={handleFileUpload}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
              <ImageIcon size={38} style={{ color: 'var(--accent-cyan)', opacity: 0.7 }} />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Click to browse or drag &amp; drop
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                  JPG, PNG — max 2MB
                </div>
              </div>
              <button type="button" className="btn btn-sm btn-secondary" style={{ pointerEvents: 'none' }}>
                Select Image
              </button>
            </div>

            {/* Photo preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '128px', height: '128px', borderRadius: 'var(--r-md)',
                background: 'var(--bg-secondary)', border: '2px solid var(--border-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', boxShadow: 'var(--shadow-md)'
              }}>
                {photoUrl
                  ? <img src={photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      <User size={36} style={{ opacity: 0.35 }} />
                      <div style={{ fontSize: '0.65rem', marginTop: '4px' }}>No Photo</div>
                    </div>}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Profile Photo Preview</span>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Save Electives"
        message={`Save ${selectedElectives.length} elective choice(s) to your student profile?`}
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={executeConfirmedSave}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
}
