import React, { useState, useRef } from 'react';
import { studentApi } from '../../api/studentApi';
import { useDataset } from '../../context/DatasetContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Info,
  GraduationCap,
  ChevronDown
} from '../common/Icons';

export function CsvUploader() {
  const { recordNewDataset } = useDataset();

  const [selectedFile, setSelectedFile] = useState(null);
  const [educationLevel, setEducationLevel] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const [predicting, setPredicting] = useState(false);
  const [predictionSuccess, setPredictionSuccess] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Please select a valid .csv file.');
      return;
    }
    setSelectedFile(file);
    setErrorMessage('');
    setValidationResult(null);
    setPredictionSuccess(null);
  };

  // 1. Validate Dataset via POST /api/students/upload
  const handleValidate = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a CSV file to validate.');
      return;
    }

    setValidating(true);
    setErrorMessage('');
    try {
      const res = await studentApi.uploadDataset(selectedFile, educationLevel || undefined);
      setValidationResult(res);
    } catch (err) {
      console.error('Validation error:', err);
      setErrorMessage(err.message || 'Dataset validation failed. Check column format.');
    } finally {
      setValidating(false);
    }
  };

  // 2. Run Bulk Risk Prediction via POST /api/students/bulk-predict
  const handleBulkPredict = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a CSV file to upload.');
      return;
    }

    if (!educationLevel) {
      setErrorMessage('Please select an Education Level before running prediction.');
      return;
    }

    setPredicting(true);
    setErrorMessage('');
    try {
      const res = await studentApi.bulkPredict(selectedFile, educationLevel);
      if (res.success) {
        setPredictionSuccess(res);
        recordNewDataset({
          datasetId: res.dataset_id,
          fileName: selectedFile.name,
          educationLevel: educationLevel,
          analyticsResult: res.analytics,
          topRiskList: res.top_risk_students,
        });
      } else {
        setErrorMessage(res.message || 'Bulk prediction could not be completed.');
      }
    } catch (err) {
      console.error('Bulk prediction error:', err);
      setErrorMessage(err.message || 'Prediction failed. Check CSV features and server status.');
    } finally {
      setPredicting(false);
    }
  };

  return (
    <section id="dataset-upload-section" className="csv-uploader-card">
      <div className="section-title-row">
        <div>
          <h2 className="section-title">Upload Student Dataset</h2>
          <p className="section-subtitle">
            Upload student cohort records in CSV format for automated validation, imputation, and early-risk prediction.
          </p>
        </div>
        <div className="badge badge-primary">
          <Sparkles className="w-3 h-3 mr-1" />
          <span>Standardized 36-Feature Pipeline</span>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        className={`dropzone ${dragActive ? 'dropzone-active' : ''} ${selectedFile ? 'dropzone-has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden-file-input"
          onChange={handleFileChange}
        />

        <div className="dropzone-content">
          <div className="dropzone-icon-box">
            {selectedFile ? (
              <FileText className="w-8 h-8 text-primary" />
            ) : (
              <UploadCloud className="w-8 h-8 text-primary dropzone-cloud-anim" />
            )}
          </div>

          <div className="dropzone-text">
            {selectedFile ? (
              <>
                <p className="file-name font-mono">{selectedFile.name}</p>
                <p className="file-meta">
                  {(selectedFile.size / 1024).toFixed(1)} KB • CSV Document • Click or drag to replace
                </p>
              </>
            ) : (
              <>
                <p className="dropzone-prompt">
                  <strong>Click to browse</strong> or drag &amp; drop your student cohort CSV
                </p>
                <p className="dropzone-hint">
                  Supports institutional formats (School, Intermediate, or Undergraduate datasets)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Required Education Level Selector */}
      <div className="education-level-selection-group">
        <div className="education-level-header">
          <label htmlFor="education-level-select" className="education-level-label">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="label-text">Education Level</span>
            <span className="badge-required">Required</span>
          </label>
          {educationLevel && (
            <span className="education-level-active-pill">
              Selected: <strong>{educationLevel}</strong>
            </span>
          )}
        </div>
        <p className="education-level-hint">
          Select the institutional education level for this student cohort before running risk prediction.
        </p>
        <div className="education-select-wrapper">
          <select
            id="education-level-select"
            className={`education-level-select ${!educationLevel && errorMessage ? 'select-error' : ''}`}
            value={educationLevel}
            onChange={(e) => {
              setEducationLevel(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
          >
            <option value="">-- Select Education Level --</option>
            <option value="School">School</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Undergraduate">Undergraduate</option>
          </select>
          <div className="education-select-arrow">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Action Buttons & Quick Sample */}
      <div className="uploader-action-bar">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!selectedFile || validating || predicting}
          onClick={handleValidate}
        >
          {validating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Validating CSV...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
              Validate Dataset
            </>
          )}
        </button>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!selectedFile || predicting || validating}
          onClick={handleBulkPredict}
        >
          {predicting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Running XGBoost Model...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Run Risk Prediction
            </>
          )}
        </button>
      </div>

      {/* Error Callout */}
      {errorMessage && (
        <div className="alert-box alert-danger">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="alert-content">
            <strong>Validation / Processing Error:</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Validation Report Card */}
      {validationResult && (
        <div className="validation-report-card">
          <div className="report-header">
            <div className="report-title-row">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <h4>Dataset Validation Report</h4>
            </div>
            <span className="badge badge-success">Valid Schema</span>
          </div>

          <div className="report-stats-grid">
            <div className="report-stat-item">
              <span className="report-stat-label">Total Rows</span>
              <span className="report-stat-value">{validationResult.rows}</span>
            </div>
            <div className="report-stat-item">
              <span className="report-stat-label">Features / Columns</span>
              <span className="report-stat-value">{validationResult.columns}</span>
            </div>
            <div className="report-stat-item">
              <span className="report-stat-label">Initial Missing Values</span>
              <span className="report-stat-value">
                {validationResult.original_missing_values
                  ? Object.values(validationResult.original_missing_values).reduce(
                      (a, b) => Number(a) + Number(b),
                      0
                    )
                  : 0}
              </span>
            </div>
            <div className="report-stat-item">
              <span className="report-stat-label">Imputation Status</span>
              <span className="report-stat-value text-success">
                {validationResult.remaining_missing_values === 0
                  ? 'All Imputed (0 missing)'
                  : `${validationResult.remaining_missing_values} remaining`}
              </span>
            </div>
          </div>

          {validationResult.imputation_report && Object.keys(validationResult.imputation_report).length > 0 && (
            <div className="imputation-details-box">
              <div className="imputation-header">
                <Info className="w-4 h-4 text-primary" />
                <span>Feature Imputation Summary</span>
              </div>
              <p className="imputation-text">
                Numerical features imputed via median strategy; categorical features imputed via mode
                strategy according to pipeline specifications.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Prediction Success Card */}
      {predictionSuccess && (
        <div className="prediction-success-card">
          <div className="success-header">
            <div className="success-icon-box">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <h4 className="success-title">Bulk Risk Prediction Completed!</h4>
              <p className="success-subtitle">
                Dataset ID: <code>{predictionSuccess.dataset_id}</code> • Processed{' '}
                {predictionSuccess.analytics?.total_students} students
              </p>
            </div>
          </div>

          <div className="quick-summary-chips">
            <span className="chip chip-danger">
              At-Risk: {predictionSuccess.analytics?.at_risk_students} (
              {predictionSuccess.analytics?.at_risk_percentage}%)
            </span>
            <span className="chip chip-success">
              Not At-Risk: {predictionSuccess.analytics?.not_at_risk_students}
            </span>
            <span className="chip chip-info">
              Average Risk: {((predictionSuccess.analytics?.average_risk || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
