import React, { useState, useEffect } from 'react';
import { User, BookOpen, CheckSquare, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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
    <div>
      {/* Student Area Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--bg-tertiary)',
              border: '2px solid var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {photoUrl ? (
                <img src={photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={30} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>

            <div>
              <div className="badge badge-emerald" style={{ marginBottom: '4px' }}>
                SESSION: {user?.username}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Welcome, {user?.name || 'Student'}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Role: {user?.usertype} | Email: {user?.email} | Mobile: {user?.mobile}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setActiveSubTab('courses')}
              className={`btn btn-sm ${activeSubTab === 'courses' ? 'btn-primary' : 'btn-outline'}`}
            >
              <BookOpen size={14} />
              Course Catalog
            </button>
            <button 
              onClick={() => setActiveSubTab('subjects')}
              className={`btn btn-sm ${activeSubTab === 'subjects' ? 'btn-primary' : 'btn-outline'}`}
            >
              <CheckSquare size={14} />
              Elective Allocation
            </button>
            <button 
              onClick={() => setActiveSubTab('upload')}
              className={`btn btn-sm ${activeSubTab === 'upload' ? 'btn-primary' : 'btn-outline'}`}
            >
              <Upload size={14} />
              Photo Studio
            </button>
          </div>

        </div>
      </div>

      {/* Sub-view: Course Catalog (ListOfCourses.aspx) */}
      {activeSubTab === 'courses' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Polytechnic Department Programs (ListOfCourses.aspx)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Accredited academic diplomas and curricula structure for Maharaja Sayajirao University.
              </p>
            </div>
            <span className="badge badge-blue">Academic Year {new Date().getFullYear()}-{new Date().getFullYear() + 1}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {courseCatalog.map((course) => (
              <div key={course.code} style={{ background: 'var(--bg-secondary)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-slate" style={{ fontFamily: 'var(--font-mono)' }}>{course.code}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.intake}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {course.branch}
                  </h4>
                  <div style={{ fontSize: '0.785rem', color: 'var(--accent-blue)', marginBottom: '12px' }}>
                    {course.duration}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                    KEY SUBJECTS:
                  </div>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {course.subjects.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view: Elective Subject Picker (Subjects.aspx) */}
      {activeSubTab === 'subjects' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Subject &amp; Elective Selection (Subjects.aspx)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Allocate your professional electives for Semester V (CSE 3515 Core).
              </p>
            </div>
            {confirmed && (
              <span className="badge badge-emerald">
                <CheckCircle2 size={12} /> Selections Confirmed &amp; Saved
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            
            {/* Mandatory Core Subjects */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                MANDATORY CORE SUBJECTS (16 CREDITS)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {coreSubjects.map((sub) => (
                  <div key={sub.code} style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {sub.name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {sub.code}
                      </div>
                    </div>
                    <span className="badge badge-blue">{sub.credits} Credits</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Elective Selection */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                ELECTIVE OPTIONS (CHOOSE MINIMUM 1)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {availableElectives.map((ele) => {
                  const isChecked = selectedElectives.includes(ele.name);
                  return (
                    <label
                      key={ele.code}
                      style={{
                        background: isChecked ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-secondary)',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: isChecked ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleElective(ele.name)}
                        />
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isChecked ? '#38bdf8' : 'var(--text-primary)' }}>
                            {ele.name}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {ele.code}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-slate">{ele.credits} Credits</span>
                    </label>
                  );
                })}
              </div>

              <button onClick={handleSaveElectivesClick} className="btn btn-primary" style={{ width: '100%' }}>
                <CheckCircle2 size={15} />
                Save Elective Allocation
              </button>
            </div>

          </div>

          {/* Current Confirmed Selection Preview */}
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', borderTop: '2px solid var(--accent-blue)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              CURRENT ALLOCATED SUBJECTS:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {coreSubjects.map((s) => (
                <span key={s.code} className="badge badge-slate">{s.name} (Core)</span>
              ))}
              {selectedElectives.map((e, idx) => (
                <span key={idx} className="badge badge-emerald">{e} (Elective)</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-view: Photo Studio (UploadFile.aspx / photos.aspx) */}
      {activeSubTab === 'upload' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Profile Photo &amp; Attachment Studio (UploadFile.aspx / photos.aspx)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Simulates server-side file handling using <code style={{ fontFamily: 'var(--font-mono)' }}>FileUpload1.SaveAs(spath)</code>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            
            {/* Upload Zone */}
            <div>
              <label 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '36px 20px', 
                  border: '2px dashed var(--border-strong)', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'var(--bg-secondary)', 
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Upload size={32} style={{ color: 'var(--accent-blue)', marginBottom: '10px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Click to select profile photograph
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Accepted formats: PNG, JPG, JPEG (Max 2MB)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {uploadStatus && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '10px 12px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: uploadStatus.error ? 'rgba(225, 29, 72, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                  border: `1px solid ${uploadStatus.error ? 'rgba(225, 29, 72, 0.25)' : 'rgba(5, 150, 105, 0.25)'}`,
                  color: uploadStatus.error ? '#fb7185' : '#34d399',
                  fontSize: '0.8rem'
                }}>
                  {uploadStatus.text}
                </div>
              )}
            </div>

            {/* Photo Preview Panel */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                PHOTO SPECIFICATION PREVIEW
              </div>
              <div style={{ 
                width: '140px', 
                height: '140px', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-secondary)', 
                border: '2px solid var(--border-strong)', 
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={36} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {photoUrl ? 'Active Profile Picture Configured' : 'No photo uploaded yet'}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Save Electives Confirmation Modal */}
      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Confirm Elective Course Allocation"
        message={`Are you sure you want to save ${selectedElectives.length} chosen elective subject(s) for your academic record?`}
        confirmText="Yes, Save"
        cancelText="Cancel"
        onConfirm={executeConfirmedSave}
        onCancel={() => setShowSaveConfirm(false)}
      />

    </div>
  );
}
