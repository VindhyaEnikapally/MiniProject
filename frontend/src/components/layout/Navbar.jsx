import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDataset } from '../../context/DatasetContext';
import {
  GraduationCap,
  Layers,
  User,
  ChevronDown,
  RefreshCw,
  LogOut,
  Brain,
  Sliders,
  FileText,
  ArrowLeft
} from '../common/Icons';

export function Navbar({ activeTab, onSelectTab, onGoToLanding, onLogout }) {
  const { faculty, setIsAuthModalOpen, logout } = useAuth();
  const {
    activeDatasetId,
    activeDatasetName,
    activeEducationLevel,
    recentDatasets,
    switchDataset,
    refreshAnalytics,
    loadingAnalytics,
    selectedStudentId,
    setSelectedStudentId,
    topRiskStudents,
  } = useDataset();

  const [isDatasetDropdownOpen, setIsDatasetDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        {/* Brand with link to Landing Page */}
        <div
          className="navbar-brand cursor-pointer"
          onClick={onGoToLanding}
          title="Return to Public Website / Home"
        >
          <div className="brand-icon-box">
            <GraduationCap className="brand-icon" width={22} height={22} />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <span className="brand-name">Student Success AI</span>
              <span className="brand-pill">FACULTY PORTAL</span>
            </div>
            <span className="brand-tagline">Early Risk Detection & Intervention Decision Support</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'dashboard' ? 'nav-tab-active' : ''}`}
            onClick={() => onSelectTab('dashboard')}
          >
            <Layers className="w-4 h-4" width={16} height={16} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'students' ? 'nav-tab-active' : ''}`}
            onClick={() => onSelectTab('students')}
          >
            <User className="w-4 h-4" width={16} height={16} />
            <span>Student Risk Directory</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'analysis' ? 'nav-tab-active' : ''}`}
            onClick={() => {
              if (!selectedStudentId && topRiskStudents && topRiskStudents.length > 0) {
                setSelectedStudentId(topRiskStudents[0].student_id);
              }
              onSelectTab('analysis');
            }}
            title={selectedStudentId ? `Active Analysis: ${selectedStudentId}` : 'Open Student Risk Analysis'}
          >
            <Brain className="w-4 h-4" width={16} height={16} />
            <span>Student Analysis</span>
            {selectedStudentId ? (
              <span className="nav-tab-student-badge font-mono" title={`Analyzing ${selectedStudentId}`}>
                {selectedStudentId}
              </span>
            ) : (
              <span className="nav-tab-hint-dot" />
            )}
          </button>
        </nav>

        {/* Right Section: Active Dataset & Faculty Profile */}
        <div className="navbar-actions">
          {/* Exit to Home Link */}
          {/* Logout Button */}
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={logout}
            title="Logout"
            onClick={() => {
              if (onLogout) {
                onLogout();
              } else {
                logout();
                if (onGoToLanding) onGoToLanding();
              }
            }}
            title="Logout from Faculty Portal"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" width={14} height={14} />
            <span>Logout</span>
          </button>

          {/* Active Dataset Dropdown */}
          <div className="dataset-switcher-wrapper">
            <button
              type="button"
              className="dataset-switcher-btn"
              onClick={() => setIsDatasetDropdownOpen((prev) => !prev)}
            >
              <FileText className="w-4 h-4 text-primary" width={16} height={16} />
              <div className="dataset-switcher-text">
                <span className="dataset-label">
                  Active Dataset {activeEducationLevel ? `(${activeEducationLevel})` : ''}
                </span>
                <span className="dataset-name" title={activeDatasetName || activeDatasetId}>
                  {activeDatasetName || (activeDatasetId ? `dataset_${activeDatasetId.slice(0, 6)}...` : 'None')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted" width={14} height={14} />
            </button>

            {isDatasetDropdownOpen && (
              <div className="dataset-dropdown-menu">
                <div className="dropdown-header">
                  <span>Available / Recent Datasets</span>
                  <button
                    type="button"
                    className="icon-btn-sm"
                    title="Refresh Dataset Analytics"
                    onClick={(e) => {
                      e.stopPropagation();
                      refreshAnalytics();
                    }}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} width={14} height={14} />
                  </button>
                </div>

                <div className="dropdown-list">
                  {recentDatasets.map((ds) => (
                    <button
                      key={ds.id}
                      type="button"
                      className={`dropdown-item ${ds.id === activeDatasetId ? 'dropdown-item-active' : ''}`}
                      onClick={() => {
                        switchDataset(ds.id, ds.name, ds.educationLevel);
                        setIsDatasetDropdownOpen(false);
                      }}
                    >
                      <div className="dropdown-item-info">
                        <span className="dropdown-item-title">{ds.name}</span>
                        <span className="dropdown-item-sub">
                          {ds.educationLevel ? `${ds.educationLevel} • ` : ''}ID: {ds.id.slice(0, 8)} • {ds.totalStudents || 100} students
                        </span>
                      </div>
                      {ds.id === activeDatasetId && <span className="active-check">✓</span>}
                    </button>
                  ))}
                </div>

                <div className="dropdown-footer">
                  <button
                    type="button"
                    className="dropdown-action-btn"
                    onClick={() => {
                      setIsDatasetDropdownOpen(false);
                      onSelectTab('dashboard');
                      const uploadEl = document.getElementById('dataset-upload-section');
                      if (uploadEl) uploadEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    + Upload New Dataset CSV
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Faculty Profile */}
          <div className="faculty-profile-wrapper">
            <button
              type="button"
              className="faculty-profile-btn"
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            >
              <div className="faculty-avatar">
                {faculty.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="faculty-meta">
                <span className="faculty-name">{faculty.name}</span>
                <span className="faculty-role">{faculty.role || 'Faculty'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted" width={14} height={14} />
            </button>

            {isProfileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="profile-info-header">
                  <p className="profile-dept">{faculty.department}</p>
                  <p className="profile-email">{faculty.email}</p>
                </div>
                <div className="profile-menu-items">
                  <button
                    type="button"
                    className="profile-menu-btn"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                  >
                    <User className="w-4 h-4" width={16} height={16} />
                    <span>Switch / Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    className="profile-menu-btn text-danger"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      if (onLogout) {
                        onLogout();
                      } else {
                        logout();
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4" width={16} height={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
