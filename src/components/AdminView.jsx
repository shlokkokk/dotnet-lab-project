import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Trash2, Search, RefreshCw, FileCode, Check, 
  LayoutGrid, List, Mail, Phone, MapPin, Calendar, UserCheck, Shield,
  Copy, Filter, Users, GraduationCap, Briefcase
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
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleExportCsvClick = () => {
    setShowExportCsvConfirm(true);
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Registered Users Directory (dbo.regdb)
          </h2>
          <p style={{ fontSize: '0.845rem', color: 'var(--text-secondary)' }}>
            Interactive records directory with profile cards, structured data grid, and SQL persistence tools.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowSqlModal(true)} className="btn btn-sm btn-secondary" title="View SQL Script">
            <FileCode size={14} style={{ color: 'var(--accent-cyan)' }} />
            SQL Script
          </button>
          <button onClick={handleExportCsvClick} className="btn btn-sm btn-outline" title="Export as CSV">
            <Download size={14} />
            Export CSV
          </button>
          <button onClick={loadUsers} className="btn btn-sm btn-outline" title="Refresh Records" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '18px' }}>
        <div className="card-panel" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <Users size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Users</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalCount}</div>
          </div>
        </div>

        <div className="card-panel" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
            <GraduationCap size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Students</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{studentCount}</div>
          </div>
        </div>

        <div className="card-panel" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Briefcase size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Faculty</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{facultyCount}</div>
          </div>
        </div>

        <div className="card-panel" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)' }}>
            <Shield size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Administrators</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{adminCount}</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Roles, Search, View Mode Toggle */}
      <div className="card-panel" style={{ padding: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Role Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Users', count: totalCount },
            { id: 'Student', label: 'Students', count: studentCount },
            { id: 'Faculty', label: 'Faculty', count: facultyCount },
            { id: 'Admin', label: 'Admins', count: adminCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`btn btn-sm ${roleFilter === tab.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '5px 10px', gap: '5px' }}
            >
              <span>{tab.label}</span>
              <span style={{ 
                fontSize: '0.675rem', 
                padding: '1px 5px', 
                borderRadius: '10px', 
                background: roleFilter === tab.id ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-tertiary)' 
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', width: '220px', fontSize: '0.8rem', paddingRight: '10px' }}
              placeholder="Search user, name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('cards')}
              className={`btn btn-sm ${viewMode === 'cards' ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '4px 8px', border: 'none' }}
              title="Grid Cards View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '4px 8px', border: 'none' }}
              title="Spreadsheet Table View"
            >
              <List size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Records Display */}
      {filtered.length === 0 ? (
        <div className="card-panel" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>No Matching Records Found</h4>
          <p style={{ fontSize: '0.8125rem' }}>No database rows match your current search query or role filter.</p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Creative User Cards Grid */
        <div className="directory-grid">
          {filtered.map((u) => {
            const roleBadgeClass = u.usertype === 'Admin' ? 'badge-amber' : u.usertype === 'Faculty' ? 'badge-blue' : 'badge-emerald';
            const hobbiesList = (u.hobbies || '').split(',').map((h) => h.trim()).filter(Boolean);

            return (
              <div key={u.id} className="user-card">
                
                {/* Card Top: Avatar, Name, Role, Delete */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      background: u.usertype === 'Admin' ? 'rgba(245, 158, 11, 0.15)' : u.usertype === 'Faculty' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      border: `2px solid ${u.usertype === 'Admin' ? 'var(--accent-amber)' : u.usertype === 'Faculty' ? 'var(--accent-cyan)' : 'var(--accent-emerald)'}`,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}>
                      {getInitials(u.name)}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                        @{u.username}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`badge ${roleBadgeClass}`} style={{ fontSize: '0.675rem' }}>
                      {u.usertype}
                    </span>
                    <button
                      onClick={() => setDeleteTargetUser(u)}
                      className="btn btn-sm btn-danger"
                      style={{ padding: '4px 6px' }}
                      title="Delete record from database"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Card Details: Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.785rem' }}>
                  
                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                      <Mail size={12} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                    </div>
                    <button 
                      onClick={() => handleCopyText(u.email, `email-${u.id}`)}
                      className="btn btn-sm btn-outline"
                      style={{ padding: '2px 5px', fontSize: '0.65rem' }}
                      title="Copy email"
                    >
                      {copiedField === `email-${u.id}` ? <Check size={10} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={10} />}
                    </button>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      <Phone size={12} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                      <span>{u.mobile}</span>
                    </div>
                    <button 
                      onClick={() => handleCopyText(String(u.mobile), `phone-${u.id}`)}
                      className="btn btn-sm btn-outline"
                      style={{ padding: '2px 5px', fontSize: '0.65rem' }}
                      title="Copy mobile number"
                    >
                      {copiedField === `phone-${u.id}` ? <Check size={10} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={10} />}
                    </button>
                  </div>

                </div>

                {/* Demographics row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div>
                    Gender: <strong style={{ color: 'var(--text-primary)' }}>{u.gender}</strong>
                  </div>
                  <div>
                    Age: <strong style={{ color: 'var(--text-primary)' }}>{u.age} yrs</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                    <Calendar size={11} style={{ color: 'var(--text-muted)' }} />
                    {u.birthdate}
                  </div>
                </div>

                {/* Address */}
                {u.address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {u.address}
                    </span>
                  </div>
                )}

                {/* Hobbies Tags */}
                {hobbiesList.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 'auto', paddingTop: '6px' }}>
                    {hobbiesList.map((hobby, idx) => (
                      <span key={idx} style={{ fontSize: '0.675rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        {hobby}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        /* Structured Database Table with guaranteed NoWrap */
        <div className="card-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Action</th>
                  <th>Role</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Mobile</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Birthdate</th>
                  <th>Hobbies</th>
                  <th>Residential Address</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <button
                        onClick={() => setDeleteTargetUser(u)}
                        className="btn btn-sm btn-danger"
                        style={{ padding: '4px 6px' }}
                        title="Delete record"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                    <td>
                      <span className={`badge ${u.usertype === 'Admin' ? 'badge-amber' : u.usertype === 'Faculty' ? 'badge-blue' : 'badge-emerald'}`} style={{ fontSize: '0.7rem' }}>
                        {u.usertype}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      @{u.username}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {u.name}
                    </td>
                    <td style={{ color: '#38bdf8' }}>
                      {u.email}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {u.mobile}
                    </td>
                    <td>{u.gender}</td>
                    <td>{u.age}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{u.birthdate}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.hobbies}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {u.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Record Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deleteTargetUser}
        title="Delete Database Record"
        message={`Are you sure you want to permanently remove "${deleteTargetUser?.name || 'this user'}" (@${deleteTargetUser?.username}) from dbo.regdb? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={executeConfirmedDelete}
        onCancel={() => setDeleteTargetUser(null)}
      />

      {/* CSV Export Confirmation Dialog */}
      <ConfirmModal
        isOpen={showExportCsvConfirm}
        title="Export Database to CSV"
        message={`Are you sure you want to export ${users.length} record(s) from dbo.regdb into a CSV spreadsheet?`}
        confirmText="Yes, Export"
        cancelText="Cancel"
        onConfirm={executeConfirmedExportCsv}
        onCancel={() => setShowExportCsvConfirm(false)}
      />

      {/* SQL Script View Modal */}
      {showSqlModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card-panel" style={{ width: '100%', maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode size={18} style={{ color: 'var(--accent-blue)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  SQL Server DDL &amp; Seed Script (dbo.regdb &amp; dbo.fd_table)
                </h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="btn btn-sm btn-outline">Close</button>
            </div>

            <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', color: '#38bdf8', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {generateSqlScript()}
              </pre>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={handleCopySql} className="btn btn-sm btn-primary">
                {copiedSql ? <Check size={14} /> : <FileCode size={14} />}
                {copiedSql ? 'Copied to Clipboard' : 'Copy SQL Script'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
