import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Creazione del contesto di autenticazione
const AuthContext = createContext();

// Hook personalizzato per utilizzare il contesto di autenticazione
export const useAuth = () => useContext(AuthContext);

// Provider del contesto di autenticazione
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica l'utente dal localStorage al caricamento dell'app
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Errore nel caricamento dell\'utente:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Funzione di login
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.login(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funzione di registrazione
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.register(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la registrazione');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funzione di logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Verifica se l'utente è admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Valore del contesto
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
