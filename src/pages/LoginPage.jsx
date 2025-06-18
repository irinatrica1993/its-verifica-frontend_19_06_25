import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
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
          Benvenuto
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Accedi per gestire la tua area personale
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;
