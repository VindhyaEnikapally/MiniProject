import { apiRequest } from './client';

/**
 * What-If Simulation API
 */
export const whatIfApi = {
  /**
   * Run what-if scenario simulation on an existing student
   * @param {string} datasetId
   * @param {string} studentId
   * @param {object} changes Key-value pairs of modified feature values
   * @param {object} student Optional student dictionary if provided
   */
  async runWhatIf(datasetId, studentId, changes, student = {}) {
    return apiRequest(`/api/what-if/${datasetId}/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({
        student,
        changes,
      }),
    });
  },
};
