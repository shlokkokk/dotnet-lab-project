import React, { useState, useEffect } from 'react';
import {
  Database, Download, Trash2, Search, RefreshCw, FileCode, Check,
  LayoutGrid, List, Mail, Phone, MapPin, Calendar, Shield,
  Copy, Users, GraduationCap, Briefcase, X, User
} from 'lucide-react';
import { fetchUsers, deleteUserApi, saveUsers } from '../services/db';
import ConfirmModal from './ConfirmModal';

export default function AdminView({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [showExportCsvConfirm, setShowExportCsvConfirm] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    const list = await fetchUsers();
    if (list) setUsers(list);
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
    const updated = users.filter(u => u.id !== deleteTargetUser.id);
    setUsers(updated);
    saveUsers(updated);
    setDeleteTargetUser(null);
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.usertype === roleFilter;
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      String(u.mobile || '').includes(q) ||
      (u.address || '').toLowerCase().includes(q) ||
      (u.hobbies || '').toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const totalCount   = users.length;
  const studentCount = users.filter(u => u.usertype === 'Student').length;
  const facultyCount = users.filter(u => u.usertype === 'Faculty').length;
  const adminCount   = users.filter(u => u.usertype === 'Admin').length;

  const generateSqlScript = () => {
    let sql = `CREATE TABLE [dbo].[regdb] (\n    [id] INT IDENTITY(1,1) PRIMARY KEY,\n    [name] VARCHAR(50) NOT NULL,\n    [address] VARCHAR(255) NOT NULL,\n    [birthdate] VARCHAR(50) NOT NULL,\n    [gender] VARCHAR(50) NOT NULL,\n    [hobbies] VARCHAR(100) NOT NULL,\n    [age] VARCHAR(10) NOT NULL,\n    [username] VARCHAR(50) NOT NULL UNIQUE,\n    [password] VARCHAR(50) NOT NULL,\n    [confirmpassword] VARCHAR(50) NOT NULL,\n    [email] VARCHAR(100) NOT NULL,\n    [usertype] VARCHAR(50) NOT NULL,\n    [mobile] DECIMAL(18, 0) NOT NULL\n);\nGO\n\n`;
    sql += `CREATE TABLE [dbo].[fd_table] (\n    [id] INT IDENTITY(1,1) PRIMARY KEY,\n    [name] NVARCHAR(50) NOT NULL,\n    [feedback] NVARCHAR(MAX) NOT NULL\n);\nGO\n\n-- Seed Records\n`;
    users.forEach(u => {
      sql += `INSERT INTO [dbo].[regdb] ([name],[address],[birthdate],[gender],[hobbies],[age],[username],[password],[confirmpassword],[email],[usertype],[mobile])\nVALUES ('${(u.name||'').replace(/'/g,"''")}','${(u.address||'').replace(/'/g,"''")}','${u.birthdate||''}','${u.gender||''}','${(u.hobbies||'').replace(/'/g,"''")}','${u.age||''}','${u.username||''}','${u.password||''}','${u.confirmpassword||''}','${u.email||''}','${u.usertype||''}',${u.mobile||0});\n`;
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
    const headers = ['id','name','address','birthdate','gender','hobbies','age','username','email','usertype','mobile'];
    const rows = users.map(u => [u.id,`"${u.name||''}"`,`"${u.address||''}"`,u.birthdate||'',u.gender||'',`"${u.hobbies||''}"`,u.age||'',u.username||'',u.email||'',u.usertype||'',u.mobile||'']);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const a = document.createElement('a');
    a.setAttribute('href', encodeURI(csv));
    a.setAttribute('download', 'dbo_regdb_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const p = name.trim().split(' ');
    return p.length >= 2 ? `${p[0][0]}${p[1][0]}`.toUpperCase() : p[0].slice(0, 2).toUpperCase();
  };

  const roleColors = { Student: 'badge-emerald', Faculty: 'badge-amber', Admin: 'badge-violet' };

  return (
    <div className="fade-up">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="badge badge-emerald" style={{ marginBottom: '8px' }}>Database Management</div>
          <h1>Academic Records (dbo.regdb)</h1>
          <p>All registered student, faculty, and admin profiles.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => setShowSqlModal(true)} className="btn btn-sm btn-outline">
            <FileCode size={13} style={{ color: 'var(--accent-cyan)' }} />
            SQL Script
          </button>
          <button onClick={() => setShowExportCsvConfirm(true)} className="btn btn-sm btn-outline">
            <Download size={13} style={{ color: 'var(--accent-emerald)' }} />
            Export CSV
          </button>
          <button onClick={loadUsers} className="btn btn-sm btn-outline" disabled={loading}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="metrics-grid" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Records', val: totalCount, icon: <Users size={20} />, color: 'rgba(56,189,248,0.18)', fg: 'var(--accent-cyan)' },
          { label: 'Students',      val: studentCount, icon: <GraduationCap size={20} />, color: 'rgba(16,185,129,0.18)', fg: 'var(--accent-emerald)' },
          { label: 'Faculty',       val: facultyCount, icon: <Briefcase size={20} />, color: 'rgba(245,158,11,0.18)', fg: 'var(--accent-amber)' },
          { label: 'Admins',        val: adminCount,   icon: <Shield size={20} />, color: 'rgba(139,92,246,0.18)', fg: 'var(--accent-violet)' },
        ].map(({ label, val, icon, color, fg }) => (
          <div key={label} className="metric-card">
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--r-sm)', background: color, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: fg, lineHeight: 1.1 }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter toolbar */}
      <div className="card-panel" style={{ padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: '180px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '34px', fontSize: '0.82rem' }}
            placeholder="Search name, email, role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-soft)', gap: '3px' }}>
            {['ALL', 'Student', 'Faculty', 'Admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', border: 'none', fontSize: '0.75rem' }}
              >
                {r === 'ALL' ? 'All' : r}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-soft)', gap: '2px' }}>
            <button onClick={() => setViewMode('cards')} className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '4px 8px', border: 'none' }} title="Cards">
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setViewMode('table')} className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '4px 8px', border: 'none' }} title="Table">
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      {searchTerm || roleFilter !== 'ALL' ? (
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} of {totalCount} records
        </div>
      ) : null}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="card-panel empty-state">
          <Users size={44} style={{ color: 'var(--accent-cyan)', opacity: 0.25 }} />
          <h3>No records found</h3>
          <p>Adjust your search or filter, or register a new user via the Registration form.</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="directory-grid">
          {filtered.map(u => (
            <div key={u.id} className="user-card card-panel-lift">
              {/* Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: 'var(--r-sm)',
                    background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-indigo) 100%)',
                    color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 2px 10px rgba(2,132,199,0.3)'
                  }}>
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>{u.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>@{u.username}</div>
                  </div>
                </div>
                <span className={`badge ${roleColors[u.usertype] || 'badge-slate'}`}>{u.usertype}</span>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.8rem', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', overflow: 'hidden', minWidth: 0 }}>
                    <Mail size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                  </div>
                  <button onClick={() => handleCopyText(u.email, `e-${u.id}`)} className="btn btn-outline btn-xs" title="Copy email" style={{ flexShrink: 0 }}>
                    {copiedField === `e-${u.id}` ? <Check size={10} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={10} />}
                  </button>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Phone size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.775rem' }}>{u.mobile}</span>
                  </div>
                  <button onClick={() => handleCopyText(String(u.mobile), `p-${u.id}`)} className="btn btn-outline btn-xs" title="Copy phone" style={{ flexShrink: 0 }}>
                    {copiedField === `p-${u.id}` ? <Check size={10} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={10} />}
                  </button>
                </div>

                {/* Demographics */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={12} />{u.gender}, {u.age} yrs</div>
                  <span>·</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={12} />{u.birthdate}</div>
                </div>

                {/* Address */}
                {u.address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: 1.4 }}>{u.address}</span>
                  </div>
                )}

                {/* Hobbies */}
                {u.hobbies && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {u.hobbies.split(',').map((h, i) => (
                      <span key={i} className="badge badge-slate" style={{ fontSize: '0.64rem' }}>{h.trim()}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: 'auto' }}>
                <button onClick={() => setDeleteTargetUser(u)} className="btn btn-sm btn-danger">
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Username</th><th>Role</th>
                <th>Email</th><th>Mobile</th><th>Gender / Age</th>
                <th>Birthdate</th><th>Hobbies</th><th>Address</th><th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.78rem' }}>{u.username}</td>
                  <td><span className={`badge ${roleColors[u.usertype] || 'badge-slate'}`}>{u.usertype}</span></td>
                  <td>{u.email}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{u.mobile}</td>
                  <td>{u.gender}, {u.age}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{u.birthdate}</td>
                  <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.hobbies}</td>
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.address}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => setDeleteTargetUser(u)} className="btn btn-xs btn-danger" title="Delete">
                      <Trash2 size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SQL Modal */}
      {showSqlModal && (
        <div onClick={() => setShowSqlModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} className="card-panel" style={{ width: '100%', maxWidth: '720px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileCode size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>SQL Schema &amp; Seed Script</h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="btn btn-outline btn-icon-sm"><X size={14} /></button>
            </div>
            <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                T-SQL CREATE TABLE + INSERT seed for <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>dbo.regdb</code> and <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>dbo.fd_table</code>.
              </p>
              <pre style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.775rem', color: '#38bdf8', lineHeight: 1.6, overflowX: 'auto', maxHeight: '400px' }}>
                {generateSqlScript()}
              </pre>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowSqlModal(false)} className="btn btn-outline btn-sm">Close</button>
              <button onClick={handleCopySql} className="btn btn-primary btn-sm">
                {copiedSql ? <Check size={13} /> : <Copy size={13} />}
                {copiedSql ? 'Copied!' : 'Copy Script'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showExportCsvConfirm}
        title="Export to CSV"
        message={`Export all ${users.length} records from dbo.regdb?`}
        confirmText="Export"
        cancelText="Cancel"
        onConfirm={executeConfirmedExportCsv}
        onCancel={() => setShowExportCsvConfirm(false)}
      />
      <ConfirmModal
        isOpen={!!deleteTargetUser}
        title="Delete Record"
        message={`Permanently delete "${deleteTargetUser?.name}" (@${deleteTargetUser?.username}) from dbo.regdb?`}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger
        onConfirm={executeConfirmedDelete}
        onCancel={() => setDeleteTargetUser(null)}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
