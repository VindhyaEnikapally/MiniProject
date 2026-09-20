import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Sliders } from '../common/Icons';

export function InterventionEngine({ interventions }) {
  const items = interventions || [];

  return (
    <div className="intervention-engine-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Intervention Policy Engine Recommendations</h3>
          <p className="card-subtitle">
            Rule-based policy recommendations triggered when student factor conditions coincide with positive
            SHAP risk sensitivity.
          </p>
        </div>
        <span className="badge badge-primary">Authoritative Backend Engine</span>
      </div>

      {items.length === 0 ? (
        <div className="empty-interventions-box">
          <CheckCircle2 className="w-8 h-8 text-success mb-2" />
          <p className="font-semibold text-dark">No Immediate Interventions Required</p>
          <p className="text-muted text-sm">
            Current student metrics do not trigger active intervention policy rules. Standard academic monitoring
            is recommended.
          </p>
        </div>
      ) : (
        <div className="intervention-cards-grid">
          {items.map((item, idx) => {
            const priority = (item.priority || 'Low').toLowerCase();
            const isHigh = priority === 'high';
            const isMedium = priority === 'medium';

            return (
              <div
                key={idx}
                className={`intervention-item-card ${
                  isHigh
                    ? 'intervention-border-high'
                    : isMedium
                    ? 'intervention-border-medium'
                    : 'intervention-border-low'
                }`}
              >
                <div className="intervention-item-header">
                  <div className="intervention-factor-meta">
                    <span
                      className={`priority-badge ${
                        isHigh
                          ? 'priority-high'
                          : isMedium
                          ? 'priority-medium'
                          : 'priority-low'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <h4 className="intervention-factor-title">{item.factor}</h4>
                  </div>

                  <div className="intervention-shap-chip" title="SHAP Contribution">
                    <span className="chip-label">SHAP Impact:</span>
                    <span className="chip-value">+{Number(item.shap_contribution).toFixed(3)}</span>
                  </div>
                </div>

                <div className="intervention-current-row">
                  <span className="current-label">Current Observed Value:</span>
                  <span className="current-value-tag">{String(item.current_value)}</span>
                </div>

                <div className="intervention-action-box">
                  <span className="action-tag">Recommended Faculty Action:</span>
                  <p className="action-text">{item.recommended_action}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
