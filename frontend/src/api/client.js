const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Standard HTTP request wrapper with comprehensive error handling.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type to application/json if body is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Extract detail from FastAPI response if present
      let errorMessage = 'An unexpected API error occurred.';
      if (data && typeof data === 'object') {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (typeof data.detail === 'object') {
          errorMessage = data.detail.message || JSON.stringify(data.detail);
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const connError = new Error(
        `Unable to connect to backend server at ${BASE_URL}. Please ensure the FastAPI server is running on port 8000.`
      );
      connError.status = 0;
      throw connError;
    }
    throw err;
  }
}
