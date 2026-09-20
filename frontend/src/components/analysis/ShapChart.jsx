import React from 'react';
import { TrendingUp, TrendingDown, Info, Brain } from '../common/Icons';

function formatFeatureName(name) {
  if (!name) return '';
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function ShapChart({ shapExplanation }) {
  const increasing = shapExplanation?.risk_increasing_factors || [];
  const reducing = shapExplanation?.risk_reducing_factors || [];

  // Find max absolute contribution for proportional bar scaling
  const allValues = [
    ...increasing.map((f) => Math.abs(f.shap_contribution || 0)),
    ...reducing.map((f) => Math.abs(f.shap_contribution || 0)),
  ];
  const maxVal = Math.max(...allValues, 0.1);

  return (
    <div className="shap-analysis-card">
      <div className="card-header-row">
        <div className="shap-title-wrap">
          <div className="icon-circle bg-primary-soft text-primary">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="card-title">TreeSHAP Feature Attribution Decomposition</h3>
            <p className="card-subtitle">
              Local explainability quantifying each feature's mathematical contribution toward or against academic risk.
            </p>
          </div>
        </div>
        <div className="shap-badge-group">
          <span className="badge badge-primary">TreeSHAP Method</span>
          <span className="badge badge-neutral">Local Explainability</span>
        </div>
      </div>

      {/* Scientific Attribution Disclaimer Banner */}
      <div className="shap-disclaimer-banner">
        <Info className="w-4 h-4 text-primary flex-shrink-0" />
        <p>
          <strong>Scientific Attribution Notice:</strong> SHAP values indicate the mathematical
          sensitivity of the XGBoost model to each variable for this individual student. They reflect model attribution,
          <strong> not guaranteed direct causality</strong>.
        </p>
      </div>

      <div className="shap-two-column-grid">
        {/* Risk-Increasing Factors (Positive SHAP) */}
        <div className="shap-column shap-col-increasing">
          <div className="shap-column-header">
            <div className="icon-circle bg-danger-soft text-danger">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="shap-column-title text-danger">
                Risk-Increasing Factors ({increasing.length})
              </h4>
              <span className="shap-column-subtitle">Pushes model probability toward 'At Risk'</span>
            </div>
          </div>

          <div className="shap-bars-list">
            {increasing.length === 0 ? (
              <div className="shap-empty-state">
                <p className="text-muted text-sm italic py-4">No significant risk-increasing factors identified.</p>
              </div>
            ) : (
              increasing.map((item, idx) => {
                const widthPct = Math.min((Math.abs(item.shap_contribution) / maxVal) * 100, 100);
                return (
                  <div key={idx} className="shap-bar-row">
                    <div className="shap-bar-meta">
                      <span className="shap-factor-name">{formatFeatureName(item.factor)}</span>
                      <span className="shap-score text-danger font-mono">
                        +{Number(item.shap_contribution).toFixed(3)}
                      </span>
                    </div>
                    <div className="shap-track">
                      <div
                        className="shap-fill shap-fill-danger"
                        style={{ width: `${Math.max(widthPct, 6)}%` }}
                      >
                        <div className="shap-glow-tip" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Risk-Reducing Factors (Negative SHAP) */}
        <div className="shap-column shap-col-reducing">
          <div className="shap-column-header">
            <div className="icon-circle bg-success-soft text-success">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="shap-column-title text-success">
                Protective Factors ({reducing.length})
              </h4>
              <span className="shap-column-subtitle">Pushes model probability toward 'Not At Risk'</span>
            </div>
          </div>

          <div className="shap-bars-list">
            {reducing.length === 0 ? (
              <div className="shap-empty-state">
                <p className="text-muted text-sm italic py-4">No significant protective factors detected.</p>
              </div>
            ) : (
              reducing.map((item, idx) => {
                const widthPct = Math.min((Math.abs(item.shap_contribution) / maxVal) * 100, 100);
                return (
                  <div key={idx} className="shap-bar-row">
                    <div className="shap-bar-meta">
                      <span className="shap-factor-name">{formatFeatureName(item.factor)}</span>
                      <span className="shap-score text-success font-mono">
                        {Number(item.shap_contribution).toFixed(3)}
                      </span>
                    </div>
                    <div className="shap-track">
                      <div
                        className="shap-fill shap-fill-success"
                        style={{ width: `${Math.max(widthPct, 6)}%` }}
                      >
                        <div className="shap-glow-tip" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
