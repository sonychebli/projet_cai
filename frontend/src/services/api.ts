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
        email: data.email,
        role: data.role
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
  // Dashboard
  async getDashboardStats() {
    const res = await fetch(`${API_URL}/admin/dashboard`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Users Management
  async getAllUsers(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const res = await fetch(`${API_URL}/admin/users?${queryParams}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async getUserById(id: string) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async updateUserRole(id: string, role: string) {
    const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
  },

  async deleteUser(id: string) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  // Reports Management
  async getAllReports(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const res = await fetch(`${API_URL}/admin/reports?${queryParams}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async updateReportStatus(id: string, status: string) {
    const res = await fetch(`${API_URL}/admin/reports/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update report status');
    return res.json();
  },

  async deleteReport(id: string) {
    const res = await fetch(`${API_URL}/admin/reports/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete report');
    return res.json();
  },

  // Messages/Communication
  async getMessages(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const res = await fetch(`${API_URL}/admin/messages?${queryParams}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendResponse(reportId: string, content: string) {
    const res = await fetch(`${API_URL}/admin/messages/respond`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reportId, content }),
    });
    if (!res.ok) throw new Error('Failed to send response');
    return res.json();
  }
};