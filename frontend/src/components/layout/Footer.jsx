import React from 'react';
import { ShieldAlert, Info, Brain } from '../common/Icons';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-disclaimer-grid">
          <div className="footer-disclaimer-item">
            <div className="disclaimer-header">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <span>Authoritative ML Model</span>
            </div>
            <p>
              Risk probability is determined by the calibrated XGBoost classification pipeline
              with an institutional decision threshold of <strong>0.3522</strong>.
            </p>
          </div>

          <div className="footer-disclaimer-item">
            <div className="disclaimer-header">
              <Info className="w-4 h-4 text-amber" />
              <span>SHAP Attribution vs Causality</span>
            </div>
            <p>
              SHAP values quantify the contribution of each feature toward increasing or reducing
              the model's prediction score. They represent model attribution, not direct causal links.
            </p>
          </div>

          <div className="footer-disclaimer-item">
            <div className="disclaimer-header">
              <Brain className="w-4 h-4 text-purple" />
              <span>Supplementary AI Insights</span>
            </div>
            <p>
              Groq AI summaries and intervention suggestions provide contextual faculty support
              aligned to student education levels without overriding the ML model output.
            </p>
          </div>
        </div>

        <div className="footer-bottom-row">
          <span>Student Success AI • Faculty Decision Support Suite</span>
          <span>Confidential Academic Monitoring • For Authorized Faculty Use Only</span>
        </div>
      </div>
    </footer>
  );
}
