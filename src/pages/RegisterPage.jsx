import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Reindirizza alla dashboard se l'utente è già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Crea Account
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Registrati per accedere a tutti i servizi
        </Typography>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default RegisterPage;
