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

// Servizio per la gestione delle iscrizioni
const iscrizioneService = {
  // Ottieni le iscrizioni dell'utente corrente
  getIscrizioniUtente: async () => {
    try {
      console.log('Chiamata API a:', `${API_URL}/iscrizioni/utente`);
      const response = await api.get('/iscrizioni/utente');
      console.log('getIscrizioniUtente response:', response);
      return response.data;
    } catch (error) {
      console.error('Errore in getIscrizioniUtente:', error);
      throw error;
    }
  },

  // Ottieni le iscrizioni per un evento specifico (solo admin)
  getIscrizioniEvento: async (eventoId) => {
    try {
      const response = await api.get(`/iscrizioni/evento/${eventoId}`);
      return response.data;
    } catch (error) {
      console.error(`Errore in getIscrizioniEvento(${eventoId}):`, error);
      throw error;
    }
  },

  // Crea una nuova iscrizione
  createIscrizione: async (eventoId) => {
    try {
      const response = await api.post('/iscrizioni', { eventoId });
      return response.data;
    } catch (error) {
      console.error(`Errore in createIscrizione(${eventoId}):`, error);
      throw error;
    }
  },

  // Elimina un'iscrizione
  deleteIscrizione: async (iscrizioneId) => {
    try {
      const response = await api.delete(`/iscrizioni/${iscrizioneId}`);
      return response.data;
    } catch (error) {
      console.error(`Errore in deleteIscrizione(${iscrizioneId}):`, error);
      throw error;
    }
  },

  // Registra il check-in per un'iscrizione (solo admin)
  checkInIscrizione: async (iscrizioneId) => {
    try {
      const response = await api.put(`/iscrizioni/${iscrizioneId}/checkin`);
      return response.data;
    } catch (error) {
      console.error(`Errore in checkInIscrizione(${iscrizioneId}):`, error);
      throw error;
    }
  }
};

export default iscrizioneService;
