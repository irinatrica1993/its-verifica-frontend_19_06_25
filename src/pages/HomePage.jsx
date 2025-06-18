import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'primary.dark',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 0
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3 }}>
                <Typography
                  component="h1"
                  variant="h2"
                  color="inherit"
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  ITS Verifica App
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  Piattaforma di autenticazione e gestione utenti con ruoli
                </Typography>
                <Box sx={{ mt: 4 }}>
                  {isAuthenticated ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => navigate('/dashboard')}
                      sx={{ mr: 2, px: 4, py: 1.5 }}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{ mr: 2, px: 4, py: 1.5 }}
                      >
                        Accedi
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{ px: 4, py: 1.5 }}
                      >
                        Registrati
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Caratteristiche principali
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary">
                Autenticazione sicura
              </Typography>
              <Typography variant="body1">
                Sistema di autenticazione basato su JWT con gestione sicura delle password e protezione delle rotte.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary">
                Gestione ruoli
              </Typography>
              <Typography variant="body1">
                Sistema di controllo degli accessi basato su ruoli (RBAC) con utenti normali e amministratori.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary">
                API RESTful
              </Typography>
              <Typography variant="body1">
                Backend Express.js con API RESTful per la gestione degli utenti e dell'autenticazione.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
