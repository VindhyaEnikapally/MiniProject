import React from 'react';
import {
  GraduationCap,
  Brain,
  ShieldAlert,
  TrendingUp,
  Sliders,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FileText,
  User,
  Layers,
  Info
} from '../components/common/Icons';

export function LandingPage({ onGoToAuth, onGoToDashboard }) {
  return (
    <div className="landing-page">
      {/* Public Top Navbar */}
      <header className="landing-nav">
        <div className="landing-nav-container">
          <div className="landing-brand">
            <div className="landing-brand-icon">
              <GraduationCap className="w-5 h-5 text-white" width={22} height={22} />
            </div>
            <div className="landing-brand-meta">
              <span className="landing-brand-name">Student Success AI</span>
              <span className="landing-brand-pill">RESEARCH SUITE</span>
            </div>
          </div>

          <nav className="landing-nav-links">
            <a href="#pillars" className="landing-link">Core Pillars</a>
            <a href="#architecture" className="landing-link">Architecture</a>
            <a href="#education-levels" className="landing-link">Education Stages</a>
            <a href="#impact" className="landing-link">Institutional Impact</a>
          </nav>

          <div className="landing-nav-actions">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={onGoToAuth}
            >
              Faculty Sign In
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onGoToDashboard}
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" width={14} height={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-glow-blob" />
        <div className="hero-container">
          <div className="hero-badge-pill">
            <Sparkles className="w-3.5 h-3.5 text-primary" width={14} height={14} />
            <span>AI-Driven Framework for Early Academic Risk Detection & Personalized Learning Support</span>
          </div>

          <h1 className="hero-headline">
            Empower Faculty with <span className="gradient-text">Explainable AI</span> & Actionable Student Interventions
          </h1>

          <p className="hero-subtext">
            A state-of-the-art decision-support platform designed exclusively for educators. 
            Analyze 36 academic, behavioral, and demographic dimensions using calibrated <strong>XGBoost</strong> risk modeling, 
            <strong> TreeSHAP</strong> feature attributions, and <strong>Groq LLM</strong> qualitative mentoring guidance.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary btn-hero-lg"
              onClick={onGoToDashboard}
            >
              <span>Enter Faculty Portal</span>
              <ArrowRight className="w-4 h-4 ml-2" width={16} height={16} />
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-hero-lg"
              onClick={() => {
                const el = document.getElementById('architecture');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore Methodology</span>
            </button>
          </div>

          {/* Institutional Stats Ticker */}
          <div className="hero-stats-ticker">
            <div className="ticker-item">
              <span className="ticker-value">36</span>
              <span className="ticker-label">Holistic Student Dimensions</span>
            </div>
            <div className="ticker-divider" />
            <div className="ticker-item">
              <span className="ticker-value">35.2%</span>
              <span className="ticker-label">Calibrated Decision Threshold</span>
            </div>
            <div className="ticker-divider" />
            <div className="ticker-item">
              <span className="ticker-value">100%</span>
              <span className="ticker-label">Transparent SHAP Attribution</span>
            </div>
            <div className="ticker-divider" />
            <div className="ticker-item">
              <span className="ticker-value">3 Stages</span>
              <span className="ticker-label">School • Inter • Undergrad</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section id="pillars" className="landing-section bg-canvas-soft">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-kicker">CORE PLATFORM PILLARS</span>
            <h2 className="section-headline">From Risk Prediction to Proactive Intervention</h2>
            <p className="section-desc">
              Unlike generic grading calculators or opaque black-box tools, Student Success AI provides 
              mathematically verified attributions and pedagogical action plans.
            </p>
          </div>

          <div className="pillars-grid">
            {/* Pillar 1 */}
            <div className="pillar-card card-glow-primary">
              <div className="pillar-icon-box bg-blue-soft text-primary">
                <ShieldAlert className="w-6 h-6" width={26} height={26} />
              </div>
              <h3 className="pillar-title">Calibrated Risk Prediction</h3>
              <p className="pillar-desc">
                Authoritative machine learning classification powered by an optimized XGBoost pipeline. 
                Evaluates academic consistency, attendance velocity, and study habits against an empirical 0.3522 threshold.
              </p>
              <div className="pillar-footer-tag">Authoritative ML Pipeline</div>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-card card-glow-indigo">
              <div className="pillar-icon-box bg-indigo-soft text-indigo">
                <TrendingUp className="w-6 h-6" width={26} height={26} />
              </div>
              <h3 className="pillar-title">TreeSHAP Explainability</h3>
              <p className="pillar-desc">
                Local feature attribution decomposing the prediction into risk-increasing vs protective factors. 
                Teachers see exactly which features drove the score without assuming direct causal determinism.
              </p>
              <div className="pillar-footer-tag">Local Attribution Vectors</div>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-card card-glow-amber">
              <div className="pillar-icon-box bg-amber-soft text-amber">
                <CheckCircle2 className="w-6 h-6" width={26} height={26} />
              </div>
              <h3 className="pillar-title">Intervention Policy Engine</h3>
              <p className="pillar-desc">
                Rule-based institutional policy that pairs observed academic deficiencies with positive SHAP 
                sensitivity to deliver prioritized (High, Medium, Low) faculty recommendations.
              </p>
              <div className="pillar-footer-tag">Prioritized Faculty Actions</div>
            </div>

            {/* Pillar 4 */}
            <div className="pillar-card card-glow-purple">
              <div className="pillar-icon-box bg-purple-soft text-purple">
                <Sliders className="w-6 h-6" width={26} height={26} />
              </div>
              <h3 className="pillar-title">What-If Counterfactuals</h3>
              <p className="pillar-desc">
                Interactive simulator allowing educators to model hypothetical adjustments in attendance, 
                study hours, practice tests, and stress levels to observe projected risk reduction in real time.
              </p>
              <div className="pillar-footer-tag">Dynamic Risk Simulation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Pipeline Timeline */}
      <section id="architecture" className="landing-section">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-kicker">SYSTEM ARCHITECTURE</span>
            <h2 className="section-headline">The 5-Stage Institutional Decision Pipeline</h2>
            <p className="section-desc">
              How institutional cohort data moves from raw CSV ingestion to personalized student mentoring.
            </p>
          </div>

          <div className="pipeline-timeline">
            {/* Step 1 */}
            <div className="pipeline-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h4 className="step-title">Cohort Ingestion & Validation</h4>
                <p className="step-text">
                  Teachers upload student CSV cohorts. The validator verifies 36 required feature dimensions and executes automated median/mode imputation for missing values.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="pipeline-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h4 className="step-title">XGBoost Risk Inference</h4>
                <p className="step-text">
                  Engineered ratios (Total Study Hours, Preparation Intensity, Study-Screen Ratio) are computed and passed to the trained pipeline with calibrated thresholding.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="pipeline-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h4 className="step-title">TreeSHAP Attribution</h4>
                <p className="step-text">
                  Shapley values calculate exact mathematical feature impacts, segregating factors pushing toward risk from protective habits.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="pipeline-step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h4 className="step-title">Intervention Policy Engine</h4>
                <p className="step-text">
                  Automated matching maps student vulnerabilities to evidence-based faculty recommendations with High, Medium, or Low urgency.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="pipeline-step">
              <div className="step-number">05</div>
              <div className="step-content">
                <h4 className="step-title">Groq AI Advisory & Action Plan</h4>
                <p className="step-text">
                  Generates qualitative pedagogical summaries tailored to the student's education stage and provides a persistent mentoring follow-up checklist.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Tier Education Stages */}
      <section id="education-levels" className="landing-section bg-canvas-soft">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-kicker">MULTI-STAGE ADAPTABILITY</span>
            <h2 className="section-headline">Tailored for Every Academic Level</h2>
            <p className="section-desc">
              Interventions and AI pedagogical guidance automatically calibrate to the student's academic environment.
            </p>
          </div>

          <div className="edu-levels-grid">
            <div className="edu-level-card">
              <div className="edu-card-tag tag-school">School Stage</div>
              <h3 className="edu-card-title">Secondary & High School</h3>
              <ul className="edu-card-list">
                <li>• Classroom attendance & homework habit reinforcement</li>
                <li>• Foundational study consistency and routine scheduling</li>
                <li>• Teacher-guided classroom participation support</li>
                <li>• Coordinated parental communication protocols</li>
              </ul>
            </div>

            <div className="edu-level-card">
              <div className="edu-card-tag tag-inter">Intermediate Stage</div>
              <h3 className="edu-card-title">Junior College / +2 / Intermediate</h3>
              <ul className="edu-card-list">
                <li>• Exam preparation timelines & revision frequency monitoring</li>
                <li>• Mock test completion pacing and performance diagnostics</li>
                <li>• Examination anxiety reduction & stress management</li>
                <li>• Structured time management frameworks</li>
              </ul>
            </div>

            <div className="edu-level-card">
              <div className="edu-card-tag tag-undergrad">Undergraduate Stage</div>
              <h3 className="edu-card-title">College & University Degree</h3>
              <ul className="edu-card-list">
                <li>• Semester credit velocity & GPA recovery mentoring</li>
                <li>• Self-study vs online learning ratio optimization</li>
                <li>• Academic advisor 1-on-1 check-ins and milestone tracking</li>
                <li>• Coursework assignment pacing and peer study groups</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section id="impact" className="landing-cta-banner">
        <div className="cta-container">
          <h2 className="cta-headline">Ready to Enable Early Student Risk Detection?</h2>
          <p className="cta-subtext">
            Join faculty members and academic advisors using Student Success AI to identify vulnerable students weeks before examinations.
          </p>
          <div className="cta-buttons">
            <button
              type="button"
              className="btn btn-primary btn-hero-lg"
              onClick={onGoToDashboard}
            >
              <span>Launch Faculty Portal</span>
              <ArrowRight className="w-4 h-4 ml-2" width={16} height={16} />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-hero-lg"
              onClick={onGoToAuth}
            >
              <span>Faculty Sign In / Sign Up</span>
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="landing-footer-row">
            <div className="footer-brand-meta">
              <div className="brand-logo-row">
                <GraduationCap className="w-5 h-5 text-primary" width={20} height={20} />
                <span className="brand-name-bold">Student Success AI</span>
              </div>
              <p className="footer-tagline-text">
                An AI-driven decision-support framework for early risk detection and personalized learning support.
              </p>
            </div>

            <div className="footer-links-group">
              <span className="links-group-title">Platform</span>
              <button type="button" className="footer-nav-link" onClick={onGoToDashboard}>Faculty Dashboard</button>
              <button type="button" className="footer-nav-link" onClick={onGoToAuth}>Faculty Sign In</button>
              <a href="#pillars" className="footer-nav-link">Core Features</a>
              <a href="#architecture" className="footer-nav-link">System Architecture</a>
            </div>

            <div className="footer-links-group">
              <span className="links-group-title">Technical Specs</span>
              <span className="footer-spec-item">XGBoost Classification Pipeline</span>
              <span className="footer-spec-item">TreeSHAP Explainability Engine</span>
              <span className="footer-spec-item">Groq LLM Pedagogical Guidance</span>
              <span className="footer-spec-item">FastAPI REST Backend (Port 8000)</span>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <span>© 2026 Student Success AI Framework • Confidential Institutional Decision Support</span>
            <span>Authoritative XGBoost Model (Threshold = 0.3522)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
