const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('tokenExpiry', Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('tokenExpiry', Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  },

  // File upload with auth
  uploadFile: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    return response.json();
  },

  // Get upload history
  getUploadHistory: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/upload/history`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.json();
  },

  // Delete upload
  deleteUpload: async (uploadId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/upload/${uploadId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.json();
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) return false;
    
    // Check if token is expired
    if (Date.now() > parseInt(expiry)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
      return false;
    }
    
    return true;
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};