import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Star, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  User, 
  Clock, 
  MessageCircle,
  Inbox
} from 'lucide-react';
import { fetchFeedback, submitFeedbackApi, saveFeedback } from '../services/db';
import { simulateFeedbackInsert } from '../services/adoSimulator';
import ConfirmModal from './ConfirmModal';

const ratingLabels = {
  1: 'Poor (1/5)',
  2: 'Fair (2/5)',
  3: 'Average (3/5)',
  4: 'Good (4/5)',
  5: 'Excellent (5/5)'
};

export default function FeedbackView({ currentUser }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [name, setName] = useState(currentUser?.email || '');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [successStatus, setSuccessStatus] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    if (currentUser?.email && !name) {
      setName(currentUser.email);
    }
  }, [currentUser]);

  const loadFeedback = async () => {
    const list = await fetchFeedback();
    if (list) {
      setFeedbackList(list);
    }
  };

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
      rating: rating,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updated = [newItem, ...feedbackList];
    setFeedbackList(updated);
    saveFeedback(updated);

    // Send to live C# backend
    await submitFeedbackApi(newItem.name, newItem.feedback, newItem.rating);

    // Trigger ADO.NET simulation log
    simulateFeedbackInsert(newItem.name, newItem.feedback);

    setFeedbackText('');
    setSuccessStatus(true);
    setTimeout(() => setSuccessStatus(false), 4000);
  };

  const filtered = feedbackList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentDisplayRating = hoverRating || rating;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Page Title */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Student &amp; Faculty Feedback
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Submit and explore academic reviews stored in database table <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>dbo.fd_table</code>.
        </p>
      </div>

      {/* Side-by-side Balanced Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Column: Form */}
        <div className="card-panel" style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: 'var(--radius-sm)', 
              background: 'rgba(2, 132, 199, 0.15)', 
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MessageSquare size={17} />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Write Feedback
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Share your academic experience
              </div>
            </div>
          </div>

          {successStatus && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.25)', 
              padding: '10px 12px', 
              borderRadius: 'var(--radius-sm)', 
              color: '#34d399', 
              fontSize: '0.8rem', 
              marginBottom: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
              <span>Feedback submitted and saved to dbo.fd_table.</span>
            </div>
          )}

          <form onSubmit={handleFormSubmitClick}>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="form-label" style={{ marginBottom: 0 }}>
                  Rating <span className="required">*</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {ratingLabels[currentDisplayRating]}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = currentDisplayRating >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: isFilled ? 'var(--accent-amber)' : 'var(--text-muted)',
                        transition: 'transform 0.1s ease, color 0.15s ease',
                        transform: hoverRating === star ? 'scale(1.2)' : 'none'
                      }}
                      title={ratingLabels[star]}
                    >
                      <Star size={22} fill={isFilled ? 'currentColor' : 'none'} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">
                Feedback Comments <span className="required">*</span>
              </label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Write your detailed review or comments..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              <Send size={14} />
              Submit Feedback
            </button>
          </form>

        </div>

        {/* Right Column: Feedback Stream */}
        <div className="card-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '420px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Recent Feedback
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {filtered.length} {filtered.length === 1 ? 'Record' : 'Records'} in dbo.fd_table
              </div>
            </div>

            <div style={{ position: 'relative', minWidth: '180px' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '30px', fontSize: '0.785rem', width: '100%' }}
                placeholder="Filter reviews..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Review List */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {paginated.length === 0 ? (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '40px 20px', 
                textAlign: 'center',
                color: 'var(--text-muted)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-subtle)'
              }}>
                <Inbox size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  No feedback records found
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  Submit the form on the left to add a new review.
                </div>
              </div>
            ) : (
              paginated.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    padding: '14px', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {item.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Visual Stars */}
                      <div style={{ display: 'flex', gap: '2px', color: 'var(--accent-amber)' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            size={12} 
                            fill={s <= item.rating ? 'currentColor' : 'none'} 
                            style={{ opacity: s <= item.rating ? 1 : 0.3 }}
                          />
                        ))}
                      </div>

                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {item.date || item.submitted_at || 'Recent'}
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {item.feedback}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.785rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Page {currentPage} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="btn btn-sm btn-outline"
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="btn btn-sm btn-outline"
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showSubmitConfirm}
        title="Confirm Feedback Submission"
        message={`Submit feedback review from "${name}" with rating ${rating}/5 to dbo.fd_table?`}
        confirmText="Yes, Submit"
        cancelText="Cancel"
        onConfirm={executeConfirmedSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />

    </div>
  );
}
