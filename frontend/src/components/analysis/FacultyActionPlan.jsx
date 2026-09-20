import React, { useState } from 'react';
import { CheckCircle2, User, FileText, Check } from '../common/Icons';

export function FacultyActionPlan({ studentId, interventions }) {
  const [completedItems, setCompletedItems] = useState({});
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState(false);

  const toggleCheck = (idx) => {
    setCompletedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    setSavedNotes(true);
    setTimeout(() => setSavedNotes(false), 2000);
  };

  return (
    <div className="faculty-action-plan-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Faculty Follow-Up & Academic Action Plan</h3>
          <p className="card-subtitle">
            Structured faculty follow-up tracker for student <strong>{studentId}</strong>
          </p>
        </div>
        <span className="badge badge-success">Faculty Action Plan</span>
      </div>

      <div className="action-plan-grid">
        {/* Checklist */}
        <div className="action-checklist-col">
          <h4 className="sub-title">Actionable Milestones</h4>
          <div className="checklist-items">
            {interventions && interventions.length > 0 ? (
              interventions.map((item, idx) => (
                <div
                  key={idx}
                  className={`check-item ${completedItems[idx] ? 'check-item-done' : ''}`}
                  onClick={() => toggleCheck(idx)}
                >
                  <div className={`checkbox-custom ${completedItems[idx] ? 'checked' : ''}`}>
                    {completedItems[idx] && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="check-text">
                    <span className="check-factor">{item.factor}:</span>
                    <span className="check-desc">{item.recommended_action}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-sm py-2">No priority action items currently registered.</p>
            )}

            <div
              className={`check-item ${completedItems['schedule_meeting'] ? 'check-item-done' : ''}`}
              onClick={() => toggleCheck('schedule_meeting')}
            >
              <div
                className={`checkbox-custom ${
                  completedItems['schedule_meeting'] ? 'checked' : ''
                }`}
              >
                {completedItems['schedule_meeting'] && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className="check-text">
                <span className="check-factor">Academic Advising Meeting:</span>
                <span className="check-desc">Schedule 1-on-1 progress check-in with student</span>
              </div>
            </div>

            <div
              className={`check-item ${completedItems['midterm_check'] ? 'check-item-done' : ''}`}
              onClick={() => toggleCheck('midterm_check')}
            >
              <div
                className={`checkbox-custom ${
                  completedItems['midterm_check'] ? 'checked' : ''
                }`}
              >
                {completedItems['midterm_check'] && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className="check-text">
                <span className="check-factor">Bi-Weekly Attendance Check:</span>
                <span className="check-desc">Verify attendance consistency across subsequent lectures</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advisor Notes */}
        <div className="action-notes-col">
          <h4 className="sub-title">Instructor Advisory Notes</h4>
          <form onSubmit={handleSaveNotes} className="notes-form">
            <textarea
              className="notes-textarea"
              rows={5}
              placeholder="Record private mentoring notes, discussed adjustments, or specific student agreements here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="notes-action-row">
              <button type="submit" className="btn btn-sm btn-primary">
                {savedNotes ? 'Notes Saved ✓' : 'Save Mentoring Log'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
