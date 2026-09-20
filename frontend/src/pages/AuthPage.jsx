import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  User,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check
} from '../components/common/Icons';

export function AuthPage({ onSuccess, onBackToLanding }) {
  const { faculty, updateFaculty } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Faculty of Computer Science & AI',
    role: 'Lead Advisor',
    facultyId: '',
    password: '',
  });

  const [regSuccessNotice, setRegSuccessNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    if (newMode === 'signup') {
      setRegSuccessNotice('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup') {
      const trimmedName = formData.name.trim();
      const trimmedEmail = formData.email.trim();
      const trimmedPassword = formData.password.trim();

      if (!trimmedName) {
        setErrorMessage('Please enter your faculty name.');
        return;
      }
      if (!trimmedEmail) {
        setErrorMessage('Please enter your institutional email.');
        return;
      }
      if (!trimmedPassword) {
        setErrorMessage('Please create a password / authorization key.');
        return;
      }

      const newAccount = {
        name: trimmedName,
        email: trimmedEmail,
        department: formData.department?.trim() || 'Faculty of Computer Science & AI',
        role: formData.role || 'Lead Advisor',
        facultyId: formData.facultyId?.trim() || `FAC_${Math.floor(1000 + Math.random() * 9000)}`,
        password: trimmedPassword,
      };

      try {
        const existingUsers = JSON.parse(localStorage.getItem('ssp_registered_users') || '[]');
        const updatedUsers = existingUsers.filter(
          (u) => u.email.toLowerCase() !== newAccount.email.toLowerCase()
        );
        updatedUsers.push(newAccount);
        localStorage.setItem('ssp_registered_users', JSON.stringify(updatedUsers));
      } catch (err) {
        console.warn('Could not save user to localStorage', err);
      }

      setRegSuccessNotice(
        `Registration successful for ${newAccount.name}! Please sign in with your credentials to access the portal.`
      );
      setMode('signin');
      setFormData((prev) => ({
        ...prev,
        email: newAccount.email,
        password: '',
      }));
      return;
    }

    // Sign In mode
    const inputIdentifier = formData.email.trim().toLowerCase();
    const inputPassword = formData.password.trim();

    if (!inputIdentifier) {
      setErrorMessage('Please enter your institutional email.');
      return;
    }

    let registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('ssp_registered_users') || '[]');
    } catch (err) {
      registeredUsers = [];
    }

    const matchedUser = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === inputIdentifier ||
        (u.name && u.name.toLowerCase() === inputIdentifier)
    );

    if (matchedUser) {
      if (matchedUser.password && inputPassword !== matchedUser.password) {
        setErrorMessage('Incorrect password. Please verify your credentials and try again.');
        return;
      }

      updateFaculty({
        name: matchedUser.name,
        email: matchedUser.email,
        department: matchedUser.department,
        role: matchedUser.role,
        facultyId: matchedUser.facultyId,
      });

      setSuccessNotice(true);
      setTimeout(() => {
        onSuccess();
      }, 400);
      return;
    }

    // Demo account fallback
    if (
      inputIdentifier === 'e.reed@institution.edu' ||
      inputIdentifier.includes('evelyn') ||
      inputIdentifier.includes('reed')
    ) {
      updateFaculty({
        name: 'Dr. Evelyn Reed',
        email: 'e.reed@institution.edu',
        department: 'Faculty of Computer Science & AI',
        role: 'Academic Mentor / Lead Advisor',
        facultyId: 'FAC_7042',
      });
      setSuccessNotice(true);
      setTimeout(() => {
        onSuccess();
      }, 400);
      return;
    }

    // If accounts exist but identifier doesn't match
    if (registeredUsers.length > 0) {
      setErrorMessage(
        'No registered account found with this email. Please register first or use 1-Click Demo Login.'
      );
      return;
    }

    // Direct login fallback if no registered accounts yet
    updateFaculty({
      name: formData.name || 'Dr. Evelyn Reed',
      email: formData.email || 'e.reed@institution.edu',
      department: formData.department,
      role: formData.role,
      facultyId: formData.facultyId,
    });

    setSuccessNotice(true);
    setTimeout(() => {
      onSuccess();
    }, 400);
  };

  // 1-Click Demo Login Handler
  const handleQuickDemoLogin = () => {
    updateFaculty({
      name: 'Dr. Evelyn Reed',
      email: 'e.reed@institution.edu',
      department: 'Faculty of Computer Science & AI',
      role: 'Academic Mentor / Lead Advisor',
      facultyId: 'FAC_7042',
    });
    setSuccessNotice(true);
    setTimeout(() => {
      onSuccess();
    }, 400);
  };

  return (
    <div className="auth-page-container">
      {/* Back to Home Button */}
      <button
        type="button"
        className="auth-back-home-btn"
        onClick={onBackToLanding}
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" width={16} height={16} />
        <span>Return to Website</span>
      </button>

      <div className="auth-split-card">
        {/* Left Showcase Banner */}
        <div className="auth-showcase-panel">
          <div className="auth-showcase-blob" />
          
          <div className="showcase-content">
            <div className="showcase-brand">
              <div className="showcase-brand-icon">
                <GraduationCap className="w-6 h-6 text-white" width={24} height={24} />
              </div>
              <div>
                <h2 className="showcase-brand-title">Student Success AI</h2>
                <span className="showcase-brand-pill">FACULTY PORTAL ACCESS</span>
              </div>
            </div>

            <div className="showcase-quote-box">
              <p className="showcase-quote">
                “Early detection is the single most decisive factor in preventing academic dropouts. 
                This framework equips instructors with mathematically sound evidence and actionable intervention roadmaps.”
              </p>
              <div className="showcase-author">
                <span className="author-name">Dr. Evelyn Reed</span>
                <span className="author-role">Chair, Academic Success & Retention Committee</span>
              </div>
            </div>

            <div className="showcase-features-list">
              <div className="showcase-feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald" width={18} height={18} />
                <span>36-Feature Calibrated XGBoost Risk Model</span>
              </div>
              <div className="showcase-feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald" width={18} height={18} />
                <span>TreeSHAP Local Explainability Decomposition</span>
              </div>
              <div className="showcase-feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald" width={18} height={18} />
                <span>Automated Intervention Policy Rule Matching</span>
              </div>
              <div className="showcase-feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald" width={18} height={18} />
                <span>Groq LLM Contextual Mentoring Insights</span>
              </div>
            </div>

            <div className="showcase-footer-badge">
              <ShieldAlert className="w-4 h-4 text-primary" width={16} height={16} />
              <span>Institutional Single Sign-On Ready • FERPA Aligned</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <div className="auth-mode-toggle">
              <button
                type="button"
                className={`mode-toggle-btn ${mode === 'signin' ? 'mode-toggle-active' : ''}`}
                onClick={() => handleModeChange('signin')}
              >
                Faculty Sign In
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${mode === 'signup' ? 'mode-toggle-active' : ''}`}
                onClick={() => handleModeChange('signup')}
              >
                Register Account
              </button>
            </div>

            <h3 className="auth-title">
              {mode === 'signin' ? 'Sign in to Faculty Portal' : 'Create Faculty Account'}
            </h3>
            <p className="auth-subtitle">
              {mode === 'signin'
                ? 'Enter your institutional credentials or use the 1-click demo access below.'
                : 'Register your faculty profile to access institutional cohort predictions.'}
            </p>
          </div>

          {/* Quick 1-Click Demo Login Banner */}
          <div className="demo-login-box">
            <div className="demo-login-header">
              <Sparkles className="w-4 h-4 text-primary" width={16} height={16} />
              <span>Instant Evaluation Access</span>
            </div>
            <p className="demo-login-text">
              Jump straight into the active dataset without entering credentials:
            </p>
            <button
              type="button"
              className="btn btn-primary btn-demo-quick"
              onClick={handleQuickDemoLogin}
            >
              <span>1-Click Sign In as Dr. Evelyn Reed (Lead Advisor)</span>
              <ArrowRight className="w-4 h-4 ml-2" width={16} height={16} />
            </button>
          </div>

          <div className="auth-divider">
            <span>{mode === 'signin' ? 'or sign in manually' : 'or register manually'}</span>
          </div>

          {/* Registration Success Banner */}
          {regSuccessNotice && mode === 'signin' && (
            <div className="alert-box alert-success" style={{ marginBottom: '16px' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald" width={18} height={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{regSuccessNotice}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="alert-box alert-danger" style={{ marginBottom: '16px' }}>
              <ShieldAlert className="w-4 h-4 text-danger" width={18} height={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="auth-name">Faculty Name</label>
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Abcd"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Institutional Email</label>
              <input
                id="auth-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={mode === 'signin' ? 'e.g. a.bcd@institution.edu or e.reed@institution.edu' : 'e.g. a.bcd@institution.edu'}
              />
            </div>

            {mode === 'signup' && (
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="auth-dept">Department</label>
                  <input
                    id="auth-dept"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Faculty of Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="auth-role">Academic Role</label>
                  <select
                    id="auth-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Lead Advisor">Lead Advisor</option>
                    <option value="Academic Mentor / Lead Instructor">Academic Mentor / Lead Instructor</option>
                    <option value="Course Instructor">Course Instructor</option>
                    <option value="Department Chair">Department Chair</option>
                    <option value="Dean of Student Success">Dean of Student Success</option>
                  </select>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-password">Password / Authorization Key</label>
              <input
                id="auth-password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-3">
              {successNotice ? (
                <>
                  <Check className="w-4 h-4 mr-2" width={16} height={16} />
                  <span>Access Granted — Launching Portal...</span>
                </>
              ) : (
                <span>{mode === 'signin' ? 'Sign In to Portal' : 'Complete Registration'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
