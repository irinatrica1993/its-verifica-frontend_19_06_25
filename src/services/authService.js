import axios from 'axios';

// URL del backend deployato
const API_URL = 'https://its-verifica-auth-system-api.windsurf.build/api';

// Crea un'istanza di axios con la configurazione di base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor per aggiungere il token a tutte le richieste
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servizio di autenticazione
const authService = {
  // Registrazione utente
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login utente
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout utente
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Ottieni profilo utente
  getProfile: async () => {
    return api.get('/auth/profile');
  },

  // Verifica se l'utente è autenticato
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Ottieni l'utente corrente
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verifica se l'utente è admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

export default authService;
