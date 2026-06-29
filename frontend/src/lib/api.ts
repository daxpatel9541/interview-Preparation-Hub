import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  register: (data: { username: string; email: string; password: string; display_name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const questionsAPI = {
  list: (params?: { category?: string; difficulty?: string; limit?: number; offset?: number }) =>
    api.get('/questions', { params }),
  get: (id: number) => api.get(`/questions/${id}`),
  submit: (id: number, data: { selected_answer: number; time_taken_seconds: number }) =>
    api.post(`/questions/${id}/submit`, data),
  count: (category?: string) => api.get('/questions/count', { params: { category } }),
};

export const experiencesAPI = {
  list: (params?: { company?: string; year?: number; limit?: number; offset?: number }) =>
    api.get('/experiences', { params }),
  get: (id: number) => api.get(`/experiences/${id}`),
  companyStats: () => api.get('/experiences/companies/stats'),
};
