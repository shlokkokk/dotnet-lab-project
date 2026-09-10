import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Trash2, Search, RefreshCw, FileCode, Check, 
  LayoutGrid, List, Mail, Phone, MapPin, Calendar, UserCheck, Shield,
  Copy, Filter, Users, GraduationCap, Briefcase, X, User
} from 'lucide-react';
import { fetchUsers, deleteUserApi, saveUsers } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function AdminView({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [showExportCsvConfirm, setShowExportCsvConfirm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const list = await fetchUsers();
    if (list) {
      setUsers(list);
    }
    setLoading(false);
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const executeConfirmedDelete = async () => {
    if (!deleteTargetUser) return;
    await deleteUserApi(deleteTargetUser.id);
    const updated = users.filter((u) => u.id !== deleteTargetUser.id);
    setUsers(updated);
    saveUsers(updated);
    setDeleteTargetUser(null);
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.usertype === roleFilter;
    const matchesSearch =
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (String(u.mobile || '')).includes(searchTerm) ||
      (u.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.hobbies || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const totalCount = users.length;
  const studentCount = users.filter((u) => u.usertype === 'Student').length;
  const facultyCount = users.filter((u) => u.usertype === 'Faculty').length;
  const adminCount = users.filter((u) => u.usertype === 'Admin').length;

  const generateSqlScript = () => {
    let sql = `CREATE TABLE [dbo].[regdb] (\n`;
    sql += `    [id] INT IDENTITY(1,1) PRIMARY KEY,\n`;
    sql += `    [name] VARCHAR(50) NOT NULL,\n`;
    sql += `    [address] VARCHAR(255) NOT NULL,\n`;
    sql += `    [birthdate] VARCHAR(50) NOT NULL,\n`;
    sql += `    [gender] VARCHAR(50) NOT NULL,\n`;
    sql += `    [hobbies] VARCHAR(100) NOT NULL,\n`;
    sql += `    [age] VARCHAR(10) NOT NULL,\n`;
    sql += `    [username] VARCHAR(50) NOT NULL UNIQUE,\n`;
    sql += `    [password] VARCHAR(50) NOT NULL,\n`;
    sql += `    [confirmpassword] VARCHAR(50) NOT NULL,\n`;
    sql += `    [email] VARCHAR(100) NOT NULL,\n`;
    sql += `    [usertype] VARCHAR(50) NOT NULL,\n`;
    sql += `    [mobile] DECIMAL(18, 0) NOT NULL\n`;
    sql += `);\nGO\n\n`;

    sql += `CREATE TABLE [dbo].[fd_table] (\n`;
    sql += `    [id] INT IDENTITY(1,1) PRIMARY KEY,\n`;
    sql += `    [name] NVARCHAR(50) NOT NULL,\n`;
    sql += `    [feedback] NVARCHAR(MAX) NOT NULL\n`;
    sql += `);\nGO\n\n`;

    sql += `-- Seed Records Insert\n`;
    users.forEach((u) => {
      sql += `INSERT INTO [dbo].[regdb] ([name], [address], [birthdate], [gender], [hobbies], [age], [username], [password], [confirmpassword], [email], [usertype], [mobile])\n`;
      sql += `VALUES ('${(u.name || '').replace(/'/g, "''")}', '${(u.address || '').replace(/'/g, "''")}', '${u.birthdate || ''}', '${u.gender || ''}', '${(u.hobbies || '').replace(/'/g, "''")}', '${u.age || ''}', '${u.username || ''}', '${u.password || ''}', '${u.confirmpassword || ''}', '${u.email || ''}', '${u.usertype || ''}', ${u.mobile || 0});\n`;
    });

    return sql;
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(generateSqlScript());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const executeConfirmedExportCsv = () => {
    setShowExportCsvConfirm(false);
    const headers = ['id', 'name', 'address', 'birthdate', 'gender', 'hobbies', 'age', 'username', 'email', 'usertype', 'mobile'];
    const rows = users.map((u) => [
      u.id,
      `"${u.name || ''}"`,
      `"${u.address || ''}"`,
      u.birthdate || '',
      u.gender || '',
      `"${u.hobbies || ''}"`,
      u.age || '',
      u.username || '',
      u.email || '',
      u.usertype || '',
      u.mobile || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dbo_regdb_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: '6px' }}>
            Database Management Console
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Academic Records (dbo.regdb)
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Complete view of all registered student, faculty, and administrative profiles.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowSqlModal(true)}
            className="btn btn-sm btn-outline"
            title="Generate SQL Server Schema & Insert script"
          >
            <FileCode size={14} style={{ color: 'var(--accent-cyan)' }} />
            SQL Generator
          </button>

          <button
            onClick={() => setShowExportCsvConfirm(true)}
            className="btn btn-sm btn-outline"
            title="Export database table to CSV"
          >
            <Download size={14} style={{ color: 'var(--accent-emerald)' }} />
            Export CSV
          </button>

          <button
            onClick={loadUsers}
            className="btn btn-sm btn-outline"
            title="Reload from server"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid (Responsive 4-col on PC, 2x2 on Mobile) */}
      <div className="metrics-grid">
        
        <div className="metric-card">
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Records</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{totalCount}</div>
          </div>
        </div>

        <div className="metric-card">
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>Students</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1.1 }}>{studentCount}</div>
          </div>
        </div>

        <div className="metric-card">
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>Faculty</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-amber)', lineHeight: 1.1 }}>{facultyCount}</div>
          </div>
        </div>

        <div className="metric-card">
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(192, 132, 252, 0.2) 100%)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>Admins</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-purple)', lineHeight: 1.1 }}>{adminCount}</div>
          </div>
        </div>

      </div>

      {/* Search & Filter Toolbar */}
      <div className="card-panel" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.8125rem' }}
            placeholder="Search by name, email, role, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filters & View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {['ALL', 'Student', 'Faculty', 'Admin'].map((role) => {
              const isActive = roleFilter === role;
              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem', border: 'none' }}
                >
                  {role === 'ALL' ? 'All Roles' : role}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('cards')}
              className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '4px 8px', border: 'none' }}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '4px 8px', border: 'none' }}
              title="Data Table View"
            >
              <List size={14} />
            </button>
          </div>

        </div>

      </div>

      {/* MAIN VIEW: CARDS OR TABLE */}
      {filtered.length === 0 ? (
        <div className="card-panel" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users size={44} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            No records matched your query
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Try changing the filter or search term, or add a new record via the Registration form.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        
        /* CARDS GRID VIEW */
        <div className="directory-grid">
          {filtered.map((u) => {
            const roleBadgeClass = u.usertype === 'Student' ? 'badge-emerald' : u.usertype === 'Faculty' ? 'badge-amber' : 'badge-purple';
            return (
              <div key={u.id} className="user-card card-panel-hover">
                
                {/* User Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                    }}>
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        @{u.username}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${roleBadgeClass}`}>
                    {u.usertype}
                  </span>
                </div>

                {/* Details Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                  
                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Mail size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(u.email, `email-${u.id}`)}
                      className="btn btn-sm btn-outline"
                      style={{ padding: '2px 6px', fontSize: '0.7rem', flexShrink: 0 }}
                      title="Copy email"
                    >
                      {copiedField === `email-${u.id}` ? <Check size={11} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={11} />}
                    </button>
                  </div>

                  {/* Mobile */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Phone size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{u.mobile}</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(String(u.mobile), `phone-${u.id}`)}
                      className="btn btn-sm btn-outline"
                      style={{ padding: '2px 6px', fontSize: '0.7rem', flexShrink: 0 }}
                      title="Copy mobile number"
                    >
                      {copiedField === `phone-${u.id}` ? <Check size={11} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={11} />}
                    </button>
                  </div>

                  {/* Demographics */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} />
                      <span>{u.gender}, {u.age} yrs</span>
                    </div>
                    <span>&bull;</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      <span>{u.birthdate}</span>
                    </div>
                  </div>

                  {/* Address */}
                  {u.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ lineHeight: 1.35 }}>{u.address}</span>
                    </div>
                  )}

                  {/* Hobbies Chips */}
                  {u.hobbies && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {u.hobbies.split(',').map((h, idx) => (
                        <span key={idx} className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                          {h.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: 'auto' }}>
                  <button
                    onClick={() => setDeleteTargetUser(u)}
                    className="btn btn-sm btn-danger"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    <Trash2 size={12} />
                    Delete Record
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        
        /* DATA TABLE VIEW */
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email Address</th>
                <th>Mobile</th>
                <th>Gender / Age</th>
                <th>Birthdate</th>
                <th>Hobbies</th>
                <th>Address</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.785rem', color: 'var(--accent-cyan)' }}>{u.username}</td>
                  <td>
                    <span className={`badge ${u.usertype === 'Student' ? 'badge-emerald' : u.usertype === 'Faculty' ? 'badge-amber' : 'badge-purple'}`}>
                      {u.usertype}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{u.mobile}</td>
                  <td>{u.gender}, {u.age}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{u.birthdate}</td>
                  <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.hobbies}</td>
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.address}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => setDeleteTargetUser(u)}
                      className="btn btn-sm btn-danger"
                      style={{ padding: '4px 8px' }}
                      title="Delete record"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SQL Script Generator Modal */}
      {showSqlModal && (
        <div 
          onClick={() => setShowSqlModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="card-panel" 
            style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-lg)' }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  SQL Server Schema &amp; Seed Generator
                </h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="btn btn-sm btn-outline" style={{ padding: '4px' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Auto-generated T-SQL script containing the exact table definitions and INSERT records for <code style={{ color: 'var(--accent-cyan)' }}>dbo.regdb</code> and <code style={{ color: 'var(--accent-cyan)' }}>dbo.fd_table</code>.
              </p>
              
              <div style={{ position: 'relative' }}>
                <pre style={{
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.775rem',
                  color: '#38bdf8',
                  lineHeight: 1.55,
                  overflowX: 'auto',
                  maxHeight: '400px'
                }}>
                  {generateSqlScript()}
                </pre>
              </div>
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowSqlModal(false)} className="btn btn-outline btn-sm">
                Close
              </button>
              <button onClick={handleCopySql} className="btn btn-primary btn-sm">
                {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                {copiedSql ? 'Copied SQL Script!' : 'Copy SQL Script'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export CSV Confirmation Dialog */}
      <ConfirmModal
        isOpen={showExportCsvConfirm}
        title="Export Records to CSV"
        message={`Export all ${users.length} registered user records from dbo.regdb as a downloadable CSV file?`}
        confirmText="Export CSV"
        cancelText="Cancel"
        onConfirm={executeConfirmedExportCsv}
        onCancel={() => setShowExportCsvConfirm(false)}
      />

      {/* Delete User Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deleteTargetUser}
        title="Delete User Record"
        message={`Are you sure you want to permanently delete "${deleteTargetUser?.name}" (@${deleteTargetUser?.username}) from dbo.regdb?`}
        confirmText="Yes, Delete Record"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={executeConfirmedDelete}
        onCancel={() => setDeleteTargetUser(null)}
      />

    </div>
  );
}
