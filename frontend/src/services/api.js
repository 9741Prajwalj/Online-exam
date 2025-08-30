import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'http://backend:8080/api' : 'http://localhost:8080/api');

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: (username, password) => {
    return apiClient.post('/auth/login', { username, password });
  },
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },
};

// Exam services
export const examService = {
  getAllExams: () => {
    return apiClient.get('/exams');
  },
  getExamById: (id) => {
    return apiClient.get(`/exams/${id}`);
  },
  createExam: (examData) => {
    return apiClient.post('/exams', examData);
  },
  deleteExam: (id) => {
    return apiClient.delete(`/exams/${id}`);
  },
};

// Question services
export const questionService = {
  getQuestionsByExam: (examId) => {
    return apiClient.get(`/questions/by-exam/${examId}`);
  },
  createQuestion: (questionData) => {
    return apiClient.post('/questions', questionData);
  },
};

// Result services
export const resultService = {
  submitAnswers: (answers) => {
    return apiClient.post('/student/submit', answers);
  },
};
