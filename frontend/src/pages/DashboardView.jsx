import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDataset } from '../context/DatasetContext';
import { OverviewStats } from '../components/dashboard/OverviewStats';
import { RiskDistributionBar } from '../components/dashboard/RiskDistributionBar';
import { TopRiskCard } from '../components/dashboard/TopRiskCard';
import { CsvUploader } from '../components/upload/CsvUploader';
import { AlertTriangle, RefreshCw, FileText, ArrowRight, Sparkles, User, ShieldAlert } from '../components/common/Icons';
import { EduBadge } from '../components/common/EduBadge';

export function DashboardView({ onSelectStudent, onNavigateToStudents }) {
  const { faculty } = useAuth();
  const {
    activeDatasetId,
    activeDatasetName,
    activeEducationLevel,
    analytics,
    topRiskStudents,
    loadingAnalytics,
    analyticsError,
    refreshAnalytics,
  } = useDataset();

  return (
    <div className="dashboard-page">
      {/* Executive Command Banner */}
      <div className="welcome-banner">
        <div className="welcome-banner-ambient" />
        <div className="welcome-content-row">
          <div className="welcome-text">
            <div className="welcome-tag-row">
              <span className="welcome-badge">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                ACADEMIC INTELLIGENCE SUITE
              </span>
              <span className="welcome-live-dot" />
              <span className="welcome-live-text">Live Decision Support</span>
            </div>
            <h1 className="welcome-title">Welcome, {faculty.name}</h1>
            <p className="welcome-subtitle">
              {faculty.role || 'Faculty Mentor'} • {faculty.department} • Early Risk Detection &amp; Targeted Intervention
            </p>
          </div>

          <div className="welcome-meta-box">
            <div className="dataset-status-pill">
              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="dataset-pill-info">
                <span className="dataset-pill-label">Active Cohort:</span>
                <strong className="dataset-pill-name font-mono">{activeDatasetName || activeDatasetId}</strong>
              </div>
              {activeEducationLevel && (
                <div className="dataset-pill-edu ml-2">
                  <EduBadge level={activeEducationLevel} size="sm" />
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn-sm btn-glass"
              onClick={refreshAnalytics}
              disabled={loadingAnalytics}
              title="Refresh analytics data"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingAnalytics ? 'animate-spin' : ''}`} />
              <span>{loadingAnalytics ? 'Updating...' : 'Refresh Metrics'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Error Notice */}
      {analyticsError && (
        <div className="alert-box alert-warning mb-6">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="alert-content">
            <strong>Dataset Analytics Notice:</strong>
            <p>{analyticsError}</p>
            <p className="text-xs text-muted mt-1">
              Upload a student CSV below or select a previously processed dataset from the top bar.
            </p>
          </div>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="dashboard-section mb-6">
        <OverviewStats analytics={analytics} loading={loadingAnalytics} />
      </div>

      {/* Risk Distribution Bar */}
      <div className="dashboard-section mb-6">
        <RiskDistributionBar distribution={analytics?.risk_distribution} />
      </div>

      {/* Two Column Layout: CSV Uploader & Priority Attention List */}
      <div className="dashboard-two-col-grid">
        <div className="col-upload">
          <CsvUploader />
        </div>

        <div className="col-top-risk">
          <TopRiskCard
            students={topRiskStudents}
            onSelectStudent={onSelectStudent}
          />

          <div className="view-all-students-card mt-4">
            <div className="view-all-text">
              <h4>Explore Complete Student Cohort ({analytics?.overview?.total_students || 100} Students)</h4>
              <p>Filter by risk band, search individual records, or inspect full ML features.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onNavigateToStudents}
            >
              <span>Open Student Directory</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
