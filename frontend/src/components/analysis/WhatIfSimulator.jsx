import React, { useState, useEffect } from 'react';
import { whatIfApi } from '../../api/whatIfApi';
import {
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2
} from '../common/Icons';

export function WhatIfSimulator({
  datasetId,
  studentId,
  studentData,
  currentRiskPercentage,
  currentPrediction,
}) {
  // Configurable factors with their defaults from studentData
  const [formData, setFormData] = useState({
    attendance_percentage: 85,
    study_hours_per_day: 4,
    practice_tests_completed: 5,
    exam_preparation_days: 14,
    stress_level: 5,
    assignment_completion_rate: 80,
    self_study_hours: 2,
  });

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize values from studentData when available
  useEffect(() => {
    if (studentData) {
      setFormData({
        attendance_percentage: Number(studentData.attendance_percentage ?? 80),
        study_hours_per_day: Number(studentData.study_hours_per_day ?? 3.5),
        practice_tests_completed: Number(studentData.practice_tests_completed ?? 4),
        exam_preparation_days: Number(studentData.exam_preparation_days ?? 10),
        stress_level: Number(studentData.stress_level ?? 6),
        assignment_completion_rate: Number(studentData.assignment_completion_rate ?? 75),
        self_study_hours: Number(studentData.self_study_hours ?? 2),
      });
      setSimResult(null);
      setError('');
    }
  }, [studentData]);

  const handleChange = (factor, value) => {
    setFormData((prev) => ({
      ...prev,
      [factor]: Number(value),
    }));
  };

  const handleReset = () => {
    if (studentData) {
      setFormData({
        attendance_percentage: Number(studentData.attendance_percentage ?? 80),
        study_hours_per_day: Number(studentData.study_hours_per_day ?? 3.5),
        practice_tests_completed: Number(studentData.practice_tests_completed ?? 4),
        exam_preparation_days: Number(studentData.exam_preparation_days ?? 10),
        stress_level: Number(studentData.stress_level ?? 6),
        assignment_completion_rate: Number(studentData.assignment_completion_rate ?? 75),
        self_study_hours: Number(studentData.self_study_hours ?? 2),
      });
      setSimResult(null);
      setError('');
    }
  };

  const handleRunSimulation = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await whatIfApi.runWhatIf(datasetId, studentId, formData);
      if (res.success) {
        setSimResult(res);
      } else {
        setError('Simulation failed to return results.');
      }
    } catch (err) {
      console.error('What-if simulation error:', err);
      setError(err.message || 'Simulation execution failed.');
    } finally {
      setLoading(false);
    }
  };

  const currentProb = currentRiskPercentage ?? 50;
  const simulatedProb = simResult ? simResult.what_if_risk_percentage : null;
  const delta = simResult ? simResult.risk_change_percentage : null;

  return (
    <div className="what-if-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">What-If Counterfactual Risk Simulation</h3>
          <p className="card-subtitle">
            Simulate how targeted academic and behavioral adjustments would alter the model's risk output for
            this student.
          </p>
        </div>
        <span className="badge badge-purple">
          <Sliders className="w-3.5 h-3.5 mr-1" />
          Interactive Simulator
        </span>
      </div>

      {/* Model Simulation Disclaimer */}
      <div className="what-if-disclaimer-box">
        <Info className="w-4 h-4 text-purple flex-shrink-0" />
        <p>
          <strong>Simulation Disclaimer:</strong> This tool reflects model response under hypothetical feature
          configurations. It demonstrates mathematical sensitivity within the trained XGBoost feature space and{' '}
          <strong>must not be interpreted as a guaranteed causal outcome</strong>.
        </p>
      </div>

      <div className="what-if-grid">
        {/* Sliders / Adjustment Panel */}
        <div className="what-if-controls-panel">
          <h4 className="controls-panel-title">Adjust Modifiable Academic Factors</h4>

          <div className="sliders-list">
            {/* Attendance */}
            <div className="slider-group">
              <div className="slider-meta">
                <label htmlFor="sim-attendance">Attendance Percentage</label>
                <span className="slider-val-tag">{formData.attendance_percentage}%</span>
              </div>
              <input
                id="sim-attendance"
                type="range"
                min="30"
                max="100"
                step="1"
                value={formData.attendance_percentage}
                onChange={(e) => handleChange('attendance_percentage', e.target.value)}
                className="range-input"
              />
              <div className="slider-ticks">
                <span>30%</span>
                <span>Current: {studentData?.attendance_percentage ?? 0}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Daily Study Hours */}
            <div className="slider-group">
              <div className="slider-meta">
                <label htmlFor="sim-study-hours">Daily Study Hours</label>
                <span className="slider-val-tag">{formData.study_hours_per_day} hrs</span>
              </div>
              <input
                id="sim-study-hours"
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={formData.study_hours_per_day}
                onChange={(e) => handleChange('study_hours_per_day', e.target.value)}
                className="range-input"
              />
              <div className="slider-ticks">
                <span>0.5h</span>
                <span>Current: {studentData?.study_hours_per_day ?? 0}h</span>
                <span>10h</span>
              </div>
            </div>

            {/* Practice Tests Completed */}
            <div className="slider-group">
              <div className="slider-meta">
                <label htmlFor="sim-practice-tests">Practice Tests Completed</label>
                <span className="slider-val-tag">{formData.practice_tests_completed}</span>
              </div>
              <input
                id="sim-practice-tests"
                type="range"
                min="0"
                max="20"
                step="1"
                value={formData.practice_tests_completed}
                onChange={(e) => handleChange('practice_tests_completed', e.target.value)}
                className="range-input"
              />
              <div className="slider-ticks">
                <span>0</span>
                <span>Current: {studentData?.practice_tests_completed ?? 0}</span>
                <span>20</span>
              </div>
            </div>

            {/* Exam Prep Days */}
            <div className="slider-group">
              <div className="slider-meta">
                <label htmlFor="sim-prep-days">Exam Preparation Days</label>
                <span className="slider-val-tag">{formData.exam_preparation_days} days</span>
              </div>
              <input
                id="sim-prep-days"
                type="range"
                min="1"
                max="60"
                step="1"
                value={formData.exam_preparation_days}
                onChange={(e) => handleChange('exam_preparation_days', e.target.value)}
                className="range-input"
              />
              <div className="slider-ticks">
                <span>1d</span>
                <span>Current: {studentData?.exam_preparation_days ?? 0}d</span>
                <span>60d</span>
              </div>
            </div>

            {/* Stress Level */}
            <div className="slider-group">
              <div className="slider-meta">
                <label htmlFor="sim-stress">Perceived Stress Level (1-10)</label>
                <span className="slider-val-tag">{formData.stress_level} / 10</span>
              </div>
              <input
                id="sim-stress"
                type="range"
                min="1"
                max="10"
                step="1"
                value={formData.stress_level}
                onChange={(e) => handleChange('stress_level', e.target.value)}
                className="range-input"
              />
              <div className="slider-ticks">
                <span>1 (Low)</span>
                <span>Current: {studentData?.stress_level ?? 0}</span>
                <span>10 (Severe)</span>
              </div>
            </div>

            {/* Assignment Completion Rate */}
            <div className="slider-group">
              <div className="slider-meta">
                <label htmlFor="sim-assignment">Assignment Completion Rate</label>
                <span className="slider-val-tag">{formData.assignment_completion_rate}%</span>
              </div>
              <input
                id="sim-assignment"
                type="range"
                min="20"
                max="100"
                step="1"
                value={formData.assignment_completion_rate}
                onChange={(e) => handleChange('assignment_completion_rate', e.target.value)}
                className="range-input"
              />
              <div className="slider-ticks">
                <span>20%</span>
                <span>Current: {studentData?.assignment_completion_rate ?? 0}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="simulator-actions-bar">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleReset}
              disabled={loading}
            >
              Reset to Actual
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleRunSimulation}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                  Simulating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Recalculate What-If Risk
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="what-if-results-panel">
          <h4 className="results-panel-title">Simulation Outcome Comparison</h4>

          {error && (
            <div className="alert-box alert-danger mb-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="simulation-comparison-boxes">
            {/* Current State */}
            <div className="sim-metric-card sim-current">
              <span className="sim-metric-label">Current Observed Risk</span>
              <span className="sim-metric-value">{Number(currentProb).toFixed(1)}%</span>
              <span
                className={`prediction-tag mt-2 ${
                  currentPrediction === 'At Risk' ? 'tag-at-risk' : 'tag-safe'
                }`}
              >
                {currentPrediction || 'At Risk'}
              </span>
            </div>

            {/* Simulated State */}
            <div className="sim-metric-card sim-projected">
              <span className="sim-metric-label">What-If Simulated Risk</span>
              <span
                className={`sim-metric-value ${
                  simResult
                    ? simResult.what_if_prediction === 'At Risk'
                      ? 'text-danger'
                      : 'text-success'
                    : 'text-muted'
                }`}
              >
                {simulatedProb !== null ? `${Number(simulatedProb).toFixed(1)}%` : '--'}
              </span>
              <span
                className={`prediction-tag mt-2 ${
                  simResult
                    ? simResult.what_if_prediction === 'At Risk'
                      ? 'tag-at-risk'
                      : 'tag-safe'
                    : 'tag-neutral'
                }`}
              >
                {simResult ? simResult.what_if_prediction : 'Pending Run'}
              </span>
            </div>
          </div>

          {/* Delta Banner */}
          {simResult && (
            <div
              className={`sim-delta-banner ${
                delta < 0 ? 'delta-improved' : delta > 0 ? 'delta-worsened' : 'delta-neutral'
              }`}
            >
              <div className="delta-icon-box">
                {delta < 0 ? (
                  <TrendingDown className="w-6 h-6 text-success" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-danger" />
                )}
              </div>
              <div className="delta-content">
                <span className="delta-headline">
                  {delta < 0
                    ? `Risk Reduced by ${Math.abs(Number(delta)).toFixed(1)}%`
                    : delta > 0
                    ? `Risk Increased by ${Math.abs(Number(delta)).toFixed(1)}%`
                    : 'No Change in Risk Score'}
                </span>
                <p className="delta-subtext">
                  {delta < 0
                    ? 'Targeted improvements in attendance and study consistency shift student below risk thresholds.'
                    : 'Simulated parameters reflect increased academic vulnerability.'}
                </p>
              </div>
            </div>
          )}

          {/* Changed Factors List */}
          {simResult && simResult.changed_factors && Object.keys(simResult.changed_factors).length > 0 && (
            <div className="sim-changed-factors-box">
              <span className="changed-factors-title">Altered Factor Values:</span>
              <div className="changed-factors-tags">
                {Object.entries(simResult.changed_factors).map(([k, v]) => (
                  <span key={k} className="factor-change-tag">
                    <strong>{k.replace(/_/g, ' ')}:</strong> {v.from} → {v.to}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
