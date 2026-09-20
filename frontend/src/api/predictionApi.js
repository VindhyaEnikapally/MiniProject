import { apiRequest } from './client';

/**
 * Prediction & SHAP Analysis API
 */
export const predictionApi = {
  /**
   * Run in-depth analysis on a saved student:
   * Returns:
   * - prediction (probability, percentage, threshold, prediction label)
   * - shap_explanation (risk_increasing_factors, risk_reducing_factors)
   * - interventions (prioritized action recommendations)
   * @param {string} datasetId
   * @param {string} studentId
   */
  async getStudentAnalysis(datasetId, studentId) {
    return apiRequest(`/api/predictions/${datasetId}/${studentId}/analysis`, {
      method: 'GET',
    });
  },

  /**
   * Run single prediction for ad-hoc student data (if needed)
   * @param {object} studentData
   */
  async predictSingle(studentData) {
    return apiRequest('/api/predictions/predict', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },
};
