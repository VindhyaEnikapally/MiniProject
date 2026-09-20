import React from 'react';
import { RiskBadge } from '../common/RiskBadge';
import { EduBadge } from '../common/EduBadge';
import { ArrowLeft, Brain, ShieldAlert, CheckCircle2, Info, Sparkles, Sliders } from '../common/Icons';

export function StudentHeader({
  studentId,
  studentData,
  prediction,
  onBack,
}) {
  const prob = prediction?.risk_probability ?? 0;
  const pct = prediction?.risk_percentage ?? prob * 100;
  const threshold = prediction?.threshold ?? 0.3522;
  const isAtRisk = prediction?.prediction === 'At Risk';
  const thresholdDiff = pct - (threshold * 100);

  const educationLevel = studentData?.education_level || 'Undergraduate';
  const riskSeverity = prob >= 0.7 ? 'High' : prob >= 0.4 ? 'Medium' : 'Low';

  return (
    <div className="student-profile-header-card">
      <div className="profile-header-glow-ambient" />

      <div className="profile-top-row">
        <div className="profile-breadcrumbs">
          <button type="button" className="btn btn-sm btn-ghost back-btn" onClick={onBack}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Cohort Directory</span>
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current font-mono">{studentId}</span>
        </div>

        <div className="profile-status-badges">
          <EduBadge level={educationLevel} size="md" />
          <RiskBadge level={riskSeverity} size="md" />
        </div>
      </div>

      <div className="profile-main-grid">
        {/* Student Identification & Avatar */}
        <div className="profile-identity">
          <div className={`profile-avatar-large avatar-glow-${riskSeverity.toLowerCase()}`}>
            <span className="avatar-initials font-mono">{studentId.slice(-3)}</span>
            <span className={`avatar-status-pip pip-${riskSeverity.toLowerCase()}`} />
          </div>

          <div className="profile-identity-info">
            <div className="profile-id-row">
              <h1 className="profile-title font-mono">{studentId}</h1>
              <span className={`prediction-pill ${isAtRisk ? 'prediction-at-risk' : 'prediction-safe'}`}>
                {isAtRisk ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                    At-Risk Classification
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Not At-Risk Classification
                  </>
                )}
              </span>
            </div>

            <p className="profile-subtitle">
              Cohort Academic Risk Profile • Stage: <strong>{educationLevel}</strong> • Model Confidence:{' '}
              <strong>{(Math.max(prob, 1 - prob) * 100).toFixed(1)}%</strong>
            </p>

            <div className="profile-quick-stats-row">
              <div className="quick-stat-chip">
                <span className="chip-label">Previous GPA:</span>
                <strong className="chip-value">{studentData?.previous_gpa ?? 'N/A'}</strong>
              </div>
              <div className="quick-stat-chip">
                <span className="chip-label">Attendance:</span>
                <strong className="chip-value">{studentData?.attendance_percentage ? `${studentData.attendance_percentage}%` : 'N/A'}</strong>
              </div>
              <div className="quick-stat-chip">
                <span className="chip-label">Study Hours:</span>
                <strong className="chip-value">{studentData?.study_hours_per_day ? `${studentData.study_hours_per_day}h/day` : 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Probability Meter & Threshold Comparison */}
        <div className="profile-metric-box">
          <div className="metric-header">
            <div className="metric-label-group">
              <span className="metric-label">Model Predicted Risk Probability</span>
              <span className="metric-sublabel">XGBoost Calibrated Estimate</span>
            </div>
            <div className="metric-val-wrap">
              <span className={`metric-percentage ${isAtRisk ? 'text-danger' : 'text-success'}`}>
                {Number(pct).toFixed(1)}%
              </span>
              <span className={`metric-delta ${thresholdDiff > 0 ? 'delta-above' : 'delta-below'}`}>
                {thresholdDiff > 0 ? `+${thresholdDiff.toFixed(1)}% above cutoff` : `${thresholdDiff.toFixed(1)}% below cutoff`}
              </span>
            </div>
          </div>

          <div className="risk-progress-track">
            {/* Visual threshold indicator */}
            <div
              className="threshold-marker"
              style={{ left: `${(threshold * 100).toFixed(1)}%` }}
              title={`Decision Threshold Cutoff: ${(threshold * 100).toFixed(1)}%`}
            >
              <div className="threshold-line" />
              <div className="threshold-pin" />
              <span className="threshold-tag">Cutoff: {(threshold * 100).toFixed(1)}%</span>
            </div>

            <div
              className={`risk-progress-fill ${
                prob >= 0.70
                  ? 'risk-fill-high'
                  : prob >= 0.40
                  ? 'risk-fill-medium'
                  : 'risk-fill-low'
              }`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            >
              <div className="risk-progress-glow-tip" />
            </div>
          </div>

          <div className="metric-footer-note">
            <Info className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>
              Decision boundary: Risk &ge; <strong>{(threshold * 100).toFixed(1)}%</strong> triggers priority faculty mentoring protocol.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
