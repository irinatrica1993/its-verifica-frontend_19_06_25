import axios from 'axios';

// URL del backend in base all'ambiente
const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'https://its-verifica-backend190625-production.up.railway.app/api');

console.log('API_URL:', API_URL);

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

// Servizio per la gestione degli eventi
const eventoService = {
  // Ottieni tutti gli eventi
  getAllEventi: async () => {
    try {
      console.log('Chiamata API a:', `${API_URL}/eventi`);
      const response = await api.get('/eventi');
      console.log('getAllEventi response:', response);
      return response.data;
    } catch (error) {
      console.error('Errore in getAllEventi:', error);
      throw error;
    }
  },

  // Ottieni un evento specifico
  getEventoById: async (id) => {
    try {
      const response = await api.get(`/eventi/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Errore in getEventoById(${id}):`, error);
      throw error;
    }
  },

  // Crea un nuovo evento (solo admin)
  createEvento: async (eventoData) => {
    try {
      const response = await api.post('/eventi', eventoData);
      return response.data;
    } catch (error) {
      console.error('Errore in createEvento:', error);
      throw error;
    }
  },

  // Aggiorna un evento esistente (solo admin)
  updateEvento: async (id, eventoData) => {
    try {
      const response = await api.put(`/eventi/${id}`, eventoData);
      return response.data;
    } catch (error) {
      console.error(`Errore in updateEvento(${id}):`, error);
      throw error;
    }
  },

  // Elimina un evento (solo admin)
  deleteEvento: async (id) => {
    try {
      const response = await api.delete(`/eventi/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Errore in deleteEvento(${id}):`, error);
      throw error;
    }
  }
};

export default eventoService;
