import { apiRequest } from './client';

/**
 * Student & Dataset Management API
 */
export const studentApi = {
  /**
   * Validate dataset CSV and retrieve missing-value / column check report
   * @param {File} file
   * @param {string} [educationLevel]
   */
  async uploadDataset(file, educationLevel) {
    const formData = new FormData();
    formData.append('file', file);
    if (educationLevel) {
      formData.append('education_level', educationLevel);
    }

    return apiRequest('/api/students/upload', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Run bulk risk prediction on the uploaded CSV
   * @param {File} file
   * @param {string} [educationLevel]
   */
  async bulkPredict(file, educationLevel) {
    const formData = new FormData();
    formData.append('file', file);
    if (educationLevel) {
      formData.append('education_level', educationLevel);
    }

    return apiRequest('/api/students/bulk-predict', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Search student records in the active dataset
   * @param {string} datasetId
   * @param {string} search
   * @param {number} limit
   */
  async searchStudents(datasetId, search = '', limit = 100) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/students/search/${datasetId}${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * Get complete details for an individual student in a dataset
   * @param {string} datasetId
   * @param {string} studentId
   */
  async getStudentDetails(datasetId, studentId) {
    return apiRequest(`/api/students/${datasetId}/${studentId}`, {
      method: 'GET',
    });
  },

  /**
   * Get required dataset format and feature specifications
   */
  async getRequirements() {
    return apiRequest('/api/students/requirements', {
      method: 'GET',
    });
  },
};
