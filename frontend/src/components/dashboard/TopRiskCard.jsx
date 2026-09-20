import React from 'react';
import { RiskBadge } from '../common/RiskBadge';
import { ShieldAlert, ArrowRight, Brain, AlertTriangle } from '../common/Icons';

export function TopRiskCard({ students, onSelectStudent }) {
  if (!students || students.length === 0) {
    return (
      <div className="top-risk-card empty-card">
        <ShieldAlert className="w-8 h-8 text-muted" />
        <p>No high-risk students identified in the active dataset.</p>
      </div>
    );
  }

  return (
    <div className="top-risk-card">
      <div className="card-header-row">
        <div className="card-header-left">
          <div className="icon-circle bg-danger-soft text-danger">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="card-title">Priority Student Attention List</h3>
            <p className="card-subtitle">
              Cohort records exhibiting highest model-calibrated risk requiring prompt mentor outreach.
            </p>
          </div>
        </div>
        <span className="badge badge-danger">
          <span className="badge-live-pip pip-danger" />
          Top {students.length} High Risk
        </span>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student ID</th>
              <th>Risk Probability</th>
              <th>Risk Severity</th>
              <th>Model Classification</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const riskPct = student.risk_percentage ?? ((student.risk_probability || 0) * 100);
              const isTop3 = idx < 3;

              return (
                <tr
                  key={student.student_id}
                  className="hover-row cursor-pointer"
                  onClick={() => onSelectStudent(student.student_id)}
                >
                  <td className="rank-cell">
                    <span className={`rank-tag ${isTop3 ? 'rank-top3' : ''} font-mono`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td>
                    <span className="student-id-link font-mono font-semibold text-primary">
                      {student.student_id}
                    </span>
                  </td>
                  <td>
                    <div className="risk-meter-cell">
                      <div className="risk-meter-track">
                        <div
                          className="risk-meter-fill risk-fill-high"
                          style={{ width: `${Math.min(riskPct, 100)}%` }}
                        >
                          <div className="risk-meter-glow-tip" />
                        </div>
                      </div>
                      <span className="risk-meter-label font-mono font-semibold">
                        {Number(riskPct).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <RiskBadge level={student.risk_level || 'High'} size="sm" />
                  </td>
                  <td>
                    <span className="prediction-tag tag-at-risk">
                      <span className="tag-pip pip-danger" />
                      {student.prediction || 'At Risk'}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="btn-link-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(student.student_id);
                      }}
                    >
                      <span>Analyze Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 action-arrow" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
