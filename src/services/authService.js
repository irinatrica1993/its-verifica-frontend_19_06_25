import axios from 'axios';

// URL del backend in base all'ambiente
const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'https://its-verifica-auth-system-api.windsurf.build/api');

console.log('API URL:', API_URL);

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
    try {
      console.log('Dati di registrazione ricevuti:', { ...userData, password: '***' });
      
      // Mappatura dei campi: dividiamo 'name' in 'nome' e 'cognome'
      const mappedData = {};
      
      if (userData.name) {
        // Dividi il nome completo in nome e cognome
        const nameParts = userData.name.trim().split(' ');
        if (nameParts.length >= 2) {
          mappedData.nome = nameParts[0];
          mappedData.cognome = nameParts.slice(1).join(' ');
        } else {
          // Se c'è solo una parola, la usiamo come nome e mettiamo un placeholder per il cognome
          mappedData.nome = userData.name;
          mappedData.cognome = 'N/A';
        }
      }
      
      // Aggiungi gli altri campi
      mappedData.email = userData.email;
      mappedData.password = userData.password;
      
      console.log('Dati mappati per il backend:', { ...mappedData, password: '***' });
      
      const response = await api.post('/auth/register', mappedData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Errore durante la registrazione:', error.response?.data || error.message);
      throw error;
    }
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
