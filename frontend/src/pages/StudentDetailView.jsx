import React, { useState, useEffect } from 'react';
import { predictionApi } from '../api/predictionApi';
import { useDataset } from '../context/DatasetContext';
import { StudentQuickSwitcher } from '../components/analysis/StudentQuickSwitcher';
import { StudentHeader } from '../components/analysis/StudentHeader';
import { ShapChart } from '../components/analysis/ShapChart';
import { InterventionEngine } from '../components/analysis/InterventionEngine';
import { WhatIfSimulator } from '../components/analysis/WhatIfSimulator';
import { AiInsightsCard } from '../components/analysis/AiInsightsCard';
import { FacultyActionPlan } from '../components/analysis/FacultyActionPlan';
import { RefreshCw, AlertTriangle, ArrowLeft } from '../components/common/Icons';

export function StudentDetailView({ studentId, onBack, onSelectStudent }) {
  const { activeDatasetId, activeEducationLevel } = useDataset();

  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalysis = async () => {
    if (!activeDatasetId || !studentId) return;

    setLoading(true);
    setError('');

    try {
      const res = await predictionApi.getStudentAnalysis(activeDatasetId, studentId);
      if (res.success) {
        setAnalysisData(res);
      } else {
        setError('Analysis data could not be retrieved.');
      }
    } catch (err) {
      console.error('Error fetching student analysis:', err);
      setError(err.message || 'Failed to generate student analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [activeDatasetId, studentId]);

  return (
    <div className="student-detail-page">
      {/* 0. Top Student Quick Switcher & Cohort Navigator */}
      <StudentQuickSwitcher
        currentStudentId={studentId}
        onSelectStudent={onSelectStudent}
        onBackToDirectory={onBack}
      />

      {loading ? (
        <div className="analysis-loading-container">
          <div className="loading-spinner-box">
            <RefreshCw className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h3 className="loading-title">Generating AI Risk Analysis for {studentId}...</h3>
          <p className="loading-subtitle">
            Executing XGBoost inference, extracting TreeSHAP local attributions, and applying Intervention Policy Engine rules.
          </p>
        </div>
      ) : error || !analysisData ? (
        <div className="analysis-error-container">
          <div className="alert-box alert-danger">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div className="alert-content">
              <h4 className="font-semibold text-lg">Unable to Load Student Analysis</h4>
              <p className="mt-1">{error || 'Student record not found in active dataset.'}</p>
            </div>
          </div>

          <button type="button" className="btn btn-secondary mt-4" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Student Directory</span>
          </button>
        </div>
      ) : (
        <>
          {/* 1. Student Profile Header (Model Prediction & Threshold) */}
          <StudentHeader
            studentId={studentId}
            studentData={{
              ...analysisData.student,
              education_level: analysisData.student?.education_level || activeEducationLevel || 'Undergraduate',
            }}
            prediction={analysisData.prediction}
            onBack={onBack}
          />

          {/* 2. SHAP Attribution Visualizer */}
          <div className="mt-6">
            <ShapChart shapExplanation={analysisData.shap_explanation} />
          </div>

          {/* 3. Intervention Policy Engine */}
          <div className="mt-6">
            <InterventionEngine interventions={analysisData.interventions} />
          </div>

          {/* 4. What-If Simulation Engine */}
          <div className="mt-6">
            <WhatIfSimulator
              datasetId={activeDatasetId}
              studentId={studentId}
              studentData={analysisData.student}
              currentRiskPercentage={analysisData.prediction?.risk_percentage}
              currentPrediction={analysisData.prediction?.prediction}
            />
          </div>

          {/* 5. Groq AI Qualitative Insights */}
          <div className="mt-6">
            <AiInsightsCard
              datasetId={activeDatasetId}
              studentId={studentId}
              educationLevel={analysisData.student?.education_level || activeEducationLevel || 'Undergraduate'}
            />
          </div>

          {/* 6. Faculty Action Plan & Mentoring Follow-Up */}
          <div className="mt-6 mb-8">
            <FacultyActionPlan studentId={studentId} interventions={analysisData.interventions} />
          </div>
        </>
      )}
    </div>
  );
}
