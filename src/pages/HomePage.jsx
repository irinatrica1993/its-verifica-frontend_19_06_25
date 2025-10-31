import { Box, Button, Container, Grid, Typography, Paper, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Security, 
  Dashboard, 
  SupervisorAccount, 
  Speed,
  VerifiedUser,
  CloudDone 
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Security sx={{ fontSize: 50 }} />,
      title: 'Sicurezza Avanzata',
      description: 'Autenticazione JWT e protezione dei dati con crittografia'
    },
    {
      icon: <Dashboard sx={{ fontSize: 50 }} />,
      title: 'Dashboard Intuitiva',
      description: 'Interfaccia moderna e facile da usare per gestire il tuo account'
    },
    {
      icon: <SupervisorAccount sx={{ fontSize: 50 }} />,
      title: 'Gestione Ruoli',
      description: 'Sistema di ruoli avanzato per utenti e amministratori'
    },
    {
      icon: <Speed sx={{ fontSize: 50 }} />,
      title: 'Prestazioni Elevate',
      description: 'Applicazione veloce e reattiva con tecnologie moderne'
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 50 }} />,
      title: 'Affidabilità',
      description: 'Sistema testato e sicuro per la gestione degli utenti'
    },
    {
      icon: <CloudDone sx={{ fontSize: 50 }} />,
      title: 'Cloud Ready',
      description: 'Deployato su infrastruttura cloud scalabile'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section con gradiente moderno */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          mb: 6,
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 0,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Typography
                  component="h1"
                  variant="h2"
                  color="inherit"
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 3,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  ITS Verifica App
                </Typography>
                <Typography 
                  variant="h5" 
                  color="inherit" 
                  paragraph
                  sx={{ 
                    mb: 4,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: 300,
                    opacity: 0.95
                  }}
                >
                  Piattaforma moderna di autenticazione e gestione utenti con sistema di ruoli avanzato
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {isAuthenticated ? (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/dashboard')}
                      sx={{ 
                        px: 5, 
                        py: 1.8,
                        fontSize: '1.1rem',
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Vai alla Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{ 
                          px: 5, 
                          py: 1.8,
                          fontSize: '1.1rem',
                          bgcolor: 'white',
                          color: 'primary.main',
                          fontWeight: 600,
                          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Accedi
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{ 
                          px: 5, 
                          py: 1.8,
                          fontSize: '1.1rem',
                          borderColor: 'white',
                          color: 'white',
                          borderWidth: 2,
                          fontWeight: 600,
                          '&:hover': {
                            borderWidth: 2,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderColor: 'white',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Registrati
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Security sx={{ fontSize: 300, opacity: 0.2 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            Caratteristiche Principali
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Tutto ciò di cui hai bisogno per gestire in modo sicuro e professionale i tuoi utenti
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
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
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Box
          sx={{
            bgcolor: 'grey.100',
            py: 8,
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Pronto per iniziare?
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Crea il tuo account gratuito in pochi secondi
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Registrati Ora
            </Button>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
