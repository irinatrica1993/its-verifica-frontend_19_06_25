import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Credenziali predefinite per l'accesso come admin
  const adminCredentials = {
    email: 'admin@example.com',
    password: 'password123'
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email non valida')
      .required('Email obbligatoria'),
    password: Yup.string()
      .required('Password obbligatoria')
      .min(8, 'La password deve contenere almeno 8 caratteri')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);
        await login(values);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Errore durante il login');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Funzione per compilare il form con le credenziali admin
  const loginAsAdmin = () => {
    formik.setValues(adminCredentials);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 480,
          borderRadius: 4,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              color: 'primary.main',
              mb: 2
            }}
          >
            <Visibility sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Bentornato!
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Accedi al tuo account per continuare
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.8,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Accedi'}
          </Button>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              oppure
            </Typography>
          </Divider>
          
          <Tooltip title="Compila il form con credenziali admin predefinite">
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              size="large"
              onClick={loginAsAdmin}
              startIcon={<AdminPanelSettings />}
              sx={{ mb: 2, py: 1.2 }}
            >
              Accedi come Admin
            </Button>
          </Tooltip>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Non hai un account?{' '}
            <Link component={RouterLink} to="/register" variant="body2">
              Registrati
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;
