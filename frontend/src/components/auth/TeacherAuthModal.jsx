import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, X, Check } from '../common/Icons';

export function TeacherAuthModal() {
  const { faculty, updateFaculty, isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  const [formData, setFormData] = useState({
    name: faculty.name || '',
    email: faculty.email || '',
    department: faculty.department || '',
    role: faculty.role || '',
    facultyId: faculty.facultyId || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFaculty(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAuthModalOpen(false);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="icon-circle bg-primary-soft text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="modal-title">Faculty Portal Profile</h3>
              <p className="modal-subtitle">Configure your instructor / advisor session</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsAuthModalOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="faculty-name">Faculty / Instructor Name</label>
            <input
              id="faculty-name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Evelyn Reed"
            />
          </div>

          <div className="form-group">
            <label htmlFor="faculty-email">Institutional Email</label>
            <input
              id="faculty-email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. e.reed@institution.edu"
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="faculty-dept">Department / School</label>
              <input
                id="faculty-dept"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science & AI"
              />
            </div>

            <div className="form-group">
              <label htmlFor="faculty-role">Academic Role</label>
              <select
                id="faculty-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Lead Instructor">Lead Instructor</option>
                <option value="Academic Mentor / Lead Advisor">Academic Mentor / Lead Advisor</option>
                <option value="Department Chair">Department Chair</option>
                <option value="Student Success Coordinator">Student Success Coordinator</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="faculty-id">Faculty / Employee ID</label>
            <input
              id="faculty-id"
              type="text"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              placeholder="e.g. FAC_7042"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAuthModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Profile Updated
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
