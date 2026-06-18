const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: (name, email, password) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () =>
    apiCall('/auth/profile', { method: 'GET' }),

  updateProfile: (name, email) =>
    apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, email }),
    }),
};

// Pizza APIs
export const pizzaAPI = {
  getAllPizzas: (category = null) => {
    const query = category ? `?category=${category}` : '';
    return apiCall(`/pizzas${query}`, { method: 'GET' });
  },

  getPizzaById: (id) =>
    apiCall(`/pizzas/${id}`, { method: 'GET' }),

  createPizza: (pizzaData) =>
    apiCall('/pizzas', {
      method: 'POST',
      body: JSON.stringify(pizzaData),
    }),

  updatePizza: (id, pizzaData) =>
    apiCall(`/pizzas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pizzaData),
    }),

  deletePizza: (id) =>
    apiCall(`/pizzas/${id}`, { method: 'DELETE' }),

  toggleAvailability: (id) =>
    apiCall(`/pizzas/${id}/availability`, {
      method: 'PATCH',
    }),
};

// Order APIs
export const orderAPI = {
  placeOrder: (orderData) =>
    apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getMyOrders: () =>
    apiCall('/orders/my', { method: 'GET' }),

  getAllOrders: () =>
    apiCall('/orders/admin/orders', { method: 'GET' }),

  updateOrderStatus: (id, status) =>
    apiCall(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  cancelOrder: (id) =>
    apiCall(`/orders/${id}`, { method: 'DELETE' }),

  getOrderStats: () =>
    apiCall('/orders/admin/stats', { method: 'GET' }),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () =>
    apiCall('/admin/dashboard/stats', { method: 'GET' }),

  getAllUsers: () =>
    apiCall('/admin/users', { method: 'GET' }),

  updateUserRole: (id, role) =>
    apiCall(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  deleteUser: (id) =>
    apiCall(`/admin/users/${id}`, { method: 'DELETE' }),

  getRecentOrders: (limit = 10) =>
    apiCall(`/admin/orders/recent?limit=${limit}`, { method: 'GET' }),

  searchOrders: (query, status, startDate, endDate) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status) params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiCall(`/admin/orders/search?${params}`, { method: 'GET' });
  },

  getOrderDetails: (id) =>
    apiCall(`/admin/orders/${id}`, { method: 'GET' }),

  getPizzaAnalytics: () =>
    apiCall('/admin/pizzas/analytics', { method: 'GET' }),

  getRevenueReport: (period = 'daily') =>
    apiCall(`/admin/revenue/report?period=${period}`, { method: 'GET' }),
};
