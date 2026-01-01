const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper pour les headers
const getHeaders = (includeAuth = true) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ==================== AUTH ====================
export const authService = {
  async register(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        name: data.name,
        email: data.email
      }));
    }
    
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

// ==================== REPORTS ====================
export const reportService = {
  async createReport(reportData: any) {
    const res = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reportData),
    });
    return res.json();
  },

  async getReports() {
    const res = await fetch(`${API_URL}/reports`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  async getUserReports(userId: number) {
    const res = await fetch(`${API_URL}/reports/user/${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user reports');
    return res.json();
  },

  async getReportById(id: string) {
    const res = await fetch(`${API_URL}/reports/${id}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  async updateReportStatus(id: string, status: string) {
    const res = await fetch(`${API_URL}/reports/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async deleteReport(id: string) {
    const res = await fetch(`${API_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  async getStatistics() {
    const res = await fetch(`${API_URL}/reports/statistics`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  async addComment(reportId: string, content: string) {
    const res = await fetch(`${API_URL}/reports/${reportId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    return res.json();
  },

  async getComments(reportId: string) {
    const res = await fetch(`${API_URL}/reports/${reportId}/comments`, {
      headers: getHeaders(false),
    });
    return res.json();
  }
};

// ==================== NOTIFICATIONS ====================
export const notificationService = {
  async getUserNotifications(userId: number) {
    const res = await fetch(`${API_URL}/notifications/user/${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markAsRead(notificationId: number) {
    const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return res.json();
  },

  async markAllAsRead(userId: number) {
    const res = await fetch(`${API_URL}/notifications/user/${userId}/read-all`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return res.json();
  }
};

// ==================== ADMIN ====================
export const adminService = {
  async getDashboardStats() {
    const res = await fetch(`${API_URL}/admin/dashboard`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async getAllUsers() {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async getUserById(id: string) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async updateUserRole(id: string, role: string) {
    const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return res.json();
  },

  async deleteUser(id: string) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  }
};