import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Send, Star, Search, ChevronLeft, ChevronRight,
  CheckCircle2, Inbox, X
} from 'lucide-react';
import { fetchFeedback, submitFeedbackApi, saveFeedback } from '../services/db';
import { simulateFeedbackInsert } from '../services/adoSimulator';
import ConfirmModal from './ConfirmModal';

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Average', 4: 'Good', 5: 'Excellent' };

export default function FeedbackView({ currentUser }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [name, setName] = useState(currentUser?.email || '');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [successStatus, setSuccessStatus] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const PER_PAGE = 4;

  useEffect(() => {
    fetchFeedback().then(list => { if (list) setFeedbackList(list); });
  }, []);

  useEffect(() => {
    if (currentUser?.email && !name) setName(currentUser.email);
  }, [currentUser]);

  const handleFormSubmitClick = (e) => {
    e.preventDefault();
    if (!name.trim() || !feedbackText.trim()) return;
    setShowSubmitConfirm(true);
  };

  const executeConfirmedSubmit = async () => {
    setShowSubmitConfirm(false);
    if (!name.trim() || !feedbackText.trim()) return;
    const newItem = {
      id: Date.now(),
      name: name.trim(),
      feedback: feedbackText.trim(),
      rating,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    const updated = [newItem, ...feedbackList];
    setFeedbackList(updated);
    saveFeedback(updated);
    await submitFeedbackApi(newItem.name, newItem.feedback, newItem.rating);
    simulateFeedbackInsert(newItem.name, newItem.feedback);
    setFeedbackText('');
    setSuccessStatus(true);
    setTimeout(() => setSuccessStatus(false), 4000);
  };

  const filtered = feedbackList.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const displayRating = hoverRating || rating;

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto' }} className="fade-up">

      {/* Header */}
      <div className="page-header">
        <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>dbo.fd_table</div>
        <h1>Feedback &amp; Reviews</h1>
        <p>
          Submit academic ratings via ADO.NET INSERT into{' '}
          <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.85em' }}>dbo.fd_table</code>
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px', alignItems: 'start' }}>

        {/* ── Form ── */}
        <div className="card-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--r-sm)', background: 'rgba(56,189,248,0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={17} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.925rem' }}>Write a Review</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Rate your lab and course experience</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {successStatus && (
              <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>Feedback written to dbo.fd_table.</span>
              </div>
            )}

            <form onSubmit={handleFormSubmitClick} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fb-name">
                  Email / Name <span className="required">*</span>
                </label>
                <input
                  id="fb-name" type="email" className="form-input"
                  placeholder="name@example.com"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Rating <span className="required">*</span>
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                    {RATING_LABELS[displayRating]} ({displayRating}/5)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-soft)' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star} type="button"
                      className="star-btn"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={{ color: displayRating >= star ? '#fbbf24' : 'var(--text-muted)' }}
                      title={RATING_LABELS[star]}
                    >
                      <Star size={26} fill={displayRating >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fb-text">
                  Feedback <span className="required">*</span>
                </label>
                <textarea
                  id="fb-text" rows={4} className="form-textarea"
                  placeholder="Share your experience with labs, faculty, and course material..."
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={15} />
                Submit Feedback
              </button>
            </form>
          </div>
        </div>

        {/* ── Reviews stream ── */}
        <div className="card-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '440px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: 'rgba(0,0,0,0.1)' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.925rem' }}>Community Reviews</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {filtered.length} {filtered.length === 1 ? 'record' : 'records'} in dbo.fd_table
              </div>
            </div>
            <div style={{ position: 'relative', flex: '0 1 200px' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '30px', fontSize: '0.78rem' }}
                placeholder="Filter reviews..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '10px', overflowY: 'auto' }}>
            {paginated.length === 0 ? (
              <div className="empty-state" style={{ flex: 1 }}>
                <Inbox size={36} style={{ color: 'var(--accent-cyan)', opacity: 0.3 }} />
                <h3>No reviews yet</h3>
                <p>Be the first to submit a review using the form.</p>
              </div>
            ) : paginated.map(item => (
              <div key={item.id} style={{
                background: 'var(--bg-secondary)', padding: '14px 16px',
                borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)',
                display: 'flex', flexDirection: 'column', gap: '8px',
                transition: 'border-color 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {item.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={13} fill={s <= item.rating ? 'currentColor' : 'none'} style={{ opacity: s <= item.rating ? 1 : 0.2 }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {item.date || 'Recent'}
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {item.feedback}
                </p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Page {currentPage} / {totalPages}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="btn btn-sm btn-outline" style={{ padding: '4px 10px' }}>
                  <ChevronLeft size={13} /> Prev
                </button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="btn btn-sm btn-outline" style={{ padding: '4px 10px' }}>
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showSubmitConfirm}
        title="Submit Feedback"
        message={`Submit review from "${name}" with rating ${rating}/5 to dbo.fd_table?`}
        confirmText="Submit"
        cancelText="Cancel"
        onConfirm={executeConfirmedSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </div>
  );
}
