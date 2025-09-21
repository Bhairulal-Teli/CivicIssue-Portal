// API Base Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// API Client class
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('🌐 API Request:', {
      method: config.method || 'GET',
      url,
      headers: config.headers,
      body: config.body
    });

    try {
      const response = await fetch(url, config);
      
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('✅ API Success:', data);
      return data;
    } catch (error) {
      console.error('🔥 API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload file
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it for multipart/form-data
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Issues API
export const issuesAPI = {
  // Get all issues with optional filters
  getAll: (filters = {}) => {
    return apiClient.get('/issues', filters);
  },

  // Get single issue by ID
  getById: (id) => {
    return apiClient.get(`/issues/${id}`);
  },

  // Update issue status
  updateStatus: (id, status, note) => {
    console.log('API call - updateStatus:', { id, status, note });
    return apiClient.patch(`/issues/${id}/status`, { status, note });
  },

  // Get issues statistics
  getStats: () => {
    return apiClient.get('/issues/stats');
  },

  // Search issues
  search: (query) => {
    return apiClient.get('/issues', { search: query });
  }
};

// Departments API
export const departmentsAPI = {
  // Get all departments
  getAll: () => {
    return apiClient.get('/departments');
  },

  // Get single department by ID
  getById: (id) => {
    return apiClient.get(`/departments/${id}`);
  },

  // Create new department
  create: (departmentData) => {
    return apiClient.post('/departments', departmentData);
  },

  // Update department
  update: (id, departmentData) => {
    return apiClient.put(`/departments/${id}`, departmentData);
  },

  // Delete department
  delete: (id) => {
    return apiClient.delete(`/departments/${id}`);
  },

  // Get department statistics
  getStats: (id) => {
    return apiClient.get(`/departments/${id}/stats`);
  },

  // Get department performance metrics
  getPerformance: (id, period = '30d') => {
    return apiClient.get(`/departments/${id}/performance`, { period });
  }
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard analytics
  getDashboard: () => {
    return apiClient.get('/analytics/dashboard');
  },

  // Get issues analytics
  getIssues: (period = '30d') => {
    return apiClient.get('/analytics/issues', { period });
  },

  // Get department analytics
  getDepartments: (period = '30d') => {
    return apiClient.get('/analytics/departments', { period });
  },

  // Get trends data
  getTrends: (period = '6m') => {
    return apiClient.get('/analytics/trends', { period });
  },

  // Get response time metrics
  getResponseTimes: (period = '30d') => {
    return apiClient.get('/analytics/response-times', { period });
  },

  // Get resolution rate metrics
  getResolutionRates: (period = '30d') => {
    return apiClient.get('/analytics/resolution-rates', { period });
  },

  // Export analytics data
  export: (type, period = '30d', format = 'csv') => {
    return apiClient.get('/analytics/export', { type, period, format });
  }
};

// Users API
export const usersAPI = {
  // Get current user profile
  getProfile: () => {
    return apiClient.get('/users/profile');
  },

  // Update user profile
  updateProfile: (userData) => {
    return apiClient.put('/users/profile', userData);
  },

  // Change password
  changePassword: (currentPassword, newPassword) => {
    return apiClient.post('/users/change-password', {
      currentPassword,
      newPassword
    });
  },

  // Get user preferences
  getPreferences: () => {
    return apiClient.get('/users/preferences');
  },

  // Update user preferences
  updatePreferences: (preferences) => {
    return apiClient.put('/users/preferences', preferences);
  }
};

// Authentication API
export const authAPI = {
  // Login
  login: (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  // Logout
  logout: () => {
    return apiClient.post('/auth/logout');
  },

  // Refresh token
  refresh: () => {
    return apiClient.post('/auth/refresh');
  },

  // Forgot password
  forgotPassword: (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (token, password) => {
    return apiClient.post('/auth/reset-password', { token, password });
  }
};

// Notifications API
export const notificationsAPI = {
  // Get all notifications
  getAll: () => {
    return apiClient.get('/notifications');
  },

  // Mark notification as read
  markAsRead: (id) => {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return apiClient.patch('/notifications/read-all');
  },

  // Delete notification
  delete: (id) => {
    return apiClient.delete(`/notifications/${id}`);
  },

  // Get notification settings
  getSettings: () => {
    return apiClient.get('/notifications/settings');
  },

  // Update notification settings
  updateSettings: (settings) => {
    return apiClient.put('/notifications/settings', settings);
  }
};

// Export the API client for direct use if needed
export { apiClient };

// Default export
export default {
  issues: issuesAPI,
  departments: departmentsAPI,
  analytics: analyticsAPI,
  users: usersAPI,
  auth: authAPI,
  notifications: notificationsAPI,
  client: apiClient
};