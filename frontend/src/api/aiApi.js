import { apiRequest } from './client';

/**
 * Groq AI Insight API
 */
export const aiApi = {
  /**
   * Fetch Groq AI insight for an existing student in a dataset
   * Returns:
   * - ai_insight: { summary, key_factors, faculty_actions, student_support, what_to_monitor, disclaimer }
   * - education_level
   * - prediction
   * @param {string} datasetId
   * @param {string} studentId
   */
  async getAiInsight(datasetId, studentId) {
    return apiRequest(`/api/ai/${datasetId}/${studentId}/insight`, {
      method: 'GET',
    });
  },
};
