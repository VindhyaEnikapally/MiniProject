import { apiRequest } from './client';

/**
 * Analytics API
 */
export const analyticsApi = {
  /**
   * Get class-level dashboard analytics for a given dataset ID
   * @param {string} datasetId
   */
  async getDashboardAnalytics(datasetId) {
    return apiRequest(`/api/analytics/dashboard/${datasetId}`, {
      method: 'GET',
    });
  },

  /**
   * Get the highest-risk students list
   * @param {string} datasetId
   * @param {number} limit
   */
  async getTopRiskStudents(datasetId, limit = 10) {
    return apiRequest(`/api/analytics/top-risk/${datasetId}?limit=${limit}`, {
      method: 'GET',
    });
  },
};
