import React from 'react';
import { Layers, ShieldAlert, AlertTriangle, CheckCircle2 } from '../common/Icons';

export function RiskDistributionBar({ distribution }) {
  const high = distribution?.high || { count: 0, percentage: 0 };
  const medium = distribution?.medium || { count: 0, percentage: 0 };
  const low = distribution?.low || { count: 0, percentage: 0 };

  const total = high.count + medium.count + low.count;

  return (
    <div className="risk-distribution-card">
      <div className="distribution-header">
        <div className="distribution-title-group">
          <div className="icon-circle bg-primary-soft text-primary">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="card-title">Risk Severity Distribution Spectrum</h3>
            <p className="card-subtitle">
              Cohort risk bands: High (&ge; 70%), Medium (40% - 69%), Low (&lt; 40%)
            </p>
          </div>
        </div>
        <span className="total-students-pill font-mono">{total} Students Classified</span>
      </div>

      {/* Multi-segment Progress Bar with glowing rounded caps */}
      <div className="segmented-bar-container">
        <div
          className="segment segment-high"
          style={{ width: `${Math.max(high.percentage, high.count > 0 ? 3 : 0)}%` }}
          title={`High Risk: ${high.count} students (${high.percentage}%)`}
        >
          <div className="segment-glow" />
        </div>
        <div
          className="segment segment-medium"
          style={{ width: `${Math.max(medium.percentage, medium.count > 0 ? 3 : 0)}%` }}
          title={`Medium Risk: ${medium.count} students (${medium.percentage}%)`}
        >
          <div className="segment-glow" />
        </div>
        <div
          className="segment segment-low"
          style={{ width: `${Math.max(low.percentage, low.count > 0 ? 3 : 0)}%` }}
          title={`Low Risk: ${low.count} students (${low.percentage}%)`}
        >
          <div className="segment-glow" />
        </div>
      </div>

      {/* Legend & Count Breakdown Cards */}
      <div className="distribution-legend-grid">
        <div className="legend-item legend-high">
          <div className="legend-marker marker-high" />
          <div className="legend-meta">
            <div className="legend-title-row">
              <span className="legend-title">High Risk (&ge; 70%)</span>
              <span className="legend-badge badge-danger">Immediate Action</span>
            </div>
            <div className="legend-counts">
              <strong className="count-num font-mono">{high.count}</strong>
              <span className="count-label">students</span>
              <span className="count-pct font-mono">({high.percentage}%)</span>
            </div>
          </div>
        </div>

        <div className="legend-item legend-medium">
          <div className="legend-marker marker-medium" />
          <div className="legend-meta">
            <div className="legend-title-row">
              <span className="legend-title">Medium Risk (40% - 69%)</span>
              <span className="legend-badge badge-warning">Proactive Review</span>
            </div>
            <div className="legend-counts">
              <strong className="count-num font-mono">{medium.count}</strong>
              <span className="count-label">students</span>
              <span className="count-pct font-mono">({medium.percentage}%)</span>
            </div>
          </div>
        </div>

        <div className="legend-item legend-low">
          <div className="legend-marker marker-low" />
          <div className="legend-meta">
            <div className="legend-title-row">
              <span className="legend-title">Low Risk (&lt; 40%)</span>
              <span className="legend-badge badge-success">On Schedule</span>
            </div>
            <div className="legend-counts">
              <strong className="count-num font-mono">{low.count}</strong>
              <span className="count-label">students</span>
              <span className="count-pct font-mono">({low.percentage}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
