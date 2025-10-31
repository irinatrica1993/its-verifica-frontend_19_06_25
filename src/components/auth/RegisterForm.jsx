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
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, HowToReg } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Nome obbligatorio')
      .min(2, 'Il nome deve contenere almeno 2 caratteri'),
    email: Yup.string()
      .email('Email non valida')
      .required('Email obbligatoria'),
    password: Yup.string()
      .required('Password obbligatoria')
      .min(8, 'La password deve contenere almeno 8 caratteri'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Le password non coincidono')
      .required('Conferma password obbligatoria')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);
        
        // Rimuovi confirmPassword prima di inviare i dati
        const { confirmPassword, ...userData } = values;
        
        await register(userData);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Errore durante la registrazione');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              bgcolor: 'secondary.light',
              color: 'secondary.main',
              mb: 2
            }}
          >
            <HowToReg sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Crea Account
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Registrati per accedere alla piattaforma
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
            id="name"
            name="name"
            label="Nome completo"
            variant="outlined"
            margin="normal"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

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

          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Conferma password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            {loading ? <CircularProgress size={24} /> : 'Registrati'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Hai già un account?{' '}
            <Link component={RouterLink} to="/login" variant="body2">
              Accedi
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
