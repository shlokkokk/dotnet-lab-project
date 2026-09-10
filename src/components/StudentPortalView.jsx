import React, { useState, useEffect } from 'react';
import { User, BookOpen, CheckSquare, Upload, CheckCircle2, Image as ImageIcon, Award, LogOut, FileText, Check, AlertCircle } from 'lucide-react';
import { fetchStudentElectives, saveStudentElectives, getStudentPhoto, saveStudentPhoto } from '../services/db';
import ConfirmModal from './ConfirmModal';

const courseCatalog = [
  {
    code: 'IT-301',
    branch: 'Information Technology',
    duration: '3 Years (6 Semesters)',
    intake: '60 Seats',
    subjects: ['Dot Net Technologies', 'Mobile Application Dev', 'Computer Networks', 'Database Management', 'Cloud Infrastructure']
  },
  {
    code: 'CE-302',
    branch: 'Computer Engineering',
    duration: '3 Years (6 Semesters)',
    intake: '120 Seats',
    subjects: ['Data Structures & Algorithms', 'Operating Systems', 'Microprocessor Systems', 'Software Engineering', 'AI Fundamentals']
  },
  {
    code: 'ME-303',
    branch: 'Mechanical Engineering',
    duration: '3 Years (6 Semesters)',
    intake: '90 Seats',
    subjects: ['Thermodynamics', 'Fluid Mechanics', 'Theory of Machines', 'CAD / CAM Systems', 'Manufacturing Tech']
  },
  {
    code: 'CV-304',
    branch: 'Civil Engineering',
    duration: '3 Years (6 Semesters)',
    intake: '60 Seats',
    subjects: ['Structural Analysis', 'Geotechnical Engineering', 'Surveying & Levelling', 'Concrete Technology', 'Hydrology']
  },
  {
    code: 'AR-305',
    branch: 'Architecture',
    duration: '5 Years (10 Semesters)',
    intake: '40 Seats',
    subjects: ['Architectural Design', 'Building Construction', 'History of Architecture', 'Landscape Design', 'Urban Planning']
  }
];

const coreSubjects = [
  { code: 'IT-501', name: 'Dot Net Technologies', credits: 5, required: true },
  { code: 'IT-502', name: 'Mobile Application Development', credits: 4, required: true },
  { code: 'IT-503', name: 'Computer Networks & Security', credits: 4, required: true },
  { code: 'IT-504', name: 'Database Management Systems', credits: 3, required: true }
];

const availableElectives = [
  { code: 'ELE-511', name: 'Cyber Security & Forensics', credits: 3 },
  { code: 'ELE-512', name: 'Cloud Computing & Microservices', credits: 3 },
  { code: 'ELE-513', name: 'Web Applications & REST APIs', credits: 3 },
  { code: 'ELE-514', name: 'Computer Organization & Architecture', credits: 3 }
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
      const load = async () => {
        const electives = await fetchStudentElectives(user.username);
        if (electives) setSelectedElectives(electives);
        setPhotoUrl(getStudentPhoto(user.username));
      };
      load();
    }
  }, [user]);

  const toggleElective = (name) => {
    let updated;
    if (selectedElectives.includes(name)) {
      updated = selectedElectives.filter((e) => e !== name);
    } else {
      updated = [...selectedElectives, name];
    }
    setSelectedElectives(updated);
    setConfirmed(false);
  };

  const handleSaveElectivesClick = () => {
    setShowSaveConfirm(true);
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
      setUploadStatus({ error: true, text: 'Only image files (.jpg, .png) are permitted by ServerValidate.' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadStatus({ error: true, text: 'File size exceeds maximum limit of 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      setPhotoUrl(result);
      if (user?.username) {
        saveStudentPhoto(user.username, result);
      }
      setUploadStatus({
        error: false,
        text: `File "${file.name}" saved successfully to virtual path: \\images\\${file.name}`
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Student Profile Hero Banner */}
      <div className="card-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--bg-tertiary)',
              border: '2px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
            }}>
              {photoUrl ? (
                <img src={photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={32} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {user?.name || user?.username || 'Student User'}
                </h1>
                <span className="badge badge-emerald">Active Student</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>@{user?.username}</span>
                <span>&bull;</span>
                <span>Information Technology</span>
                <span>&bull;</span>
                <span>Semester 5 (2026-27)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onLogout} className="btn btn-danger btn-sm">
              <LogOut size={13} />
              Sign Out
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="card-panel" style={{ padding: '6px', background: 'var(--bg-tertiary)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`btn btn-sm ${activeSubTab === 'courses' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: '1 1 auto', border: 'none' }}
        >
          <BookOpen size={14} />
          Courses &amp; Branches
        </button>

        <button
          onClick={() => setActiveSubTab('electives')}
          className={`btn btn-sm ${activeSubTab === 'electives' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: '1 1 auto', border: 'none' }}
        >
          <CheckSquare size={14} />
          Elective Selection ({selectedElectives.length})
        </button>

        <button
          onClick={() => setActiveSubTab('upload')}
          className={`btn btn-sm ${activeSubTab === 'upload' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: '1 1 auto', border: 'none' }}
        >
          <Upload size={14} />
          Document &amp; Photo Upload
        </button>
      </div>

      {/* TAB 1: COURSES & SYLLABUS */}
      {activeSubTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="card-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(2, 132, 199, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Semester 5 Enrolled Curriculum
                </h3>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Core subjects evaluated in current academic term
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {coreSubjects.map((sub) => (
                <div key={sub.code} style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-blue">{sub.code}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{sub.credits} Credits</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sub.name}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                    <CheckCircle2 size={12} /> Compulsory Core
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Polytechnic Diploma Programs */}
          <div className="card-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
              MSU Polytechnic Diploma Programs
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {courseCatalog.map((prog) => (
                <div key={prog.code} className="card-panel-hover" style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {prog.branch}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {prog.duration} &bull; {prog.intake}
                      </div>
                    </div>
                    <span className="badge badge-slate">{prog.code}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {prog.subjects.map((s, idx) => (
                      <span key={idx} className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ELECTIVE SELECTION */}
      {activeSubTab === 'electives' && (
        <div className="card-panel" style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Department Elective Selection (Semester 5)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Select your specialized track electives. Choices are synchronized to database storage.
              </p>
            </div>

            <button
              onClick={handleSaveElectivesClick}
              className="btn btn-primary btn-sm"
              style={{ padding: '7px 16px' }}
            >
              <Check size={14} />
              Save Electives Selection
            </button>
          </div>

          {confirmed && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.12)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              padding: '12px 14px', 
              borderRadius: 'var(--radius-sm)', 
              color: 'var(--accent-emerald)', 
              fontSize: '0.8125rem', 
              marginBottom: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>Elective course preferences updated successfully!</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {availableElectives.map((elec) => {
              const isSelected = selectedElectives.includes(elec.name);
              return (
                <div
                  key={elec.code}
                  onClick={() => toggleElective(elec.name)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)' : 'var(--bg-primary)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-purple">{elec.code}</span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {elec.credits} Credits
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {elec.name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{isSelected ? 'Selected' : 'Click to select'}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 3: PHOTO & DOCUMENT UPLOAD */}
      {activeSubTab === 'upload' && (
        <div className="card-panel" style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(2, 132, 199, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Upload size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Student Photo &amp; Document Upload (UploadFile.aspx)
              </h3>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                ASP.NET FileUpload validation simulation with ServerValidate handler
              </div>
            </div>
          </div>

          {uploadStatus && (
            <div style={{
              background: uploadStatus.error ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${uploadStatus.error ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              color: uploadStatus.error ? 'var(--accent-rose)' : 'var(--accent-emerald)',
              fontSize: '0.8125rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {uploadStatus.error ? <AlertCircle size={16} style={{ flexShrink: 0 }} /> : <CheckCircle2 size={16} style={{ flexShrink: 0 }} />}
              <span>{uploadStatus.text}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
            
            {/* Dropzone */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '30px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <ImageIcon size={38} style={{ color: 'var(--accent-cyan)', opacity: 0.8 }} />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Click to browse or drag &amp; drop profile picture
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Supported formats: JPG, PNG (Max 2MB)
                </div>
              </div>
              <button type="button" className="btn btn-sm btn-secondary" style={{ pointerEvents: 'none', marginTop: '4px' }}>
                Select Image File
              </button>
            </div>

            {/* Current Photo Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-primary)',
                border: '2px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)'
              }}>
                {photoUrl ? (
                  <img src={photoUrl} alt="Student Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <User size={36} style={{ opacity: 0.4 }} />
                    <div style={{ fontSize: '0.675rem', marginTop: '4px' }}>No Photo Uploaded</div>
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Active Profile Avatar
              </span>
            </div>

          </div>

        </div>
      )}

      {/* Elective Save Confirmation Modal */}
      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Confirm Electives Selection"
        message={`Save ${selectedElectives.length} chosen elective course(s) to student profile?`}
        confirmText="Yes, Save"
        cancelText="Cancel"
        onConfirm={executeConfirmedSave}
        onCancel={() => setShowSaveConfirm(false)}
      />

    </div>
  );
}
