import { Box, Container, Typography, Paper, Grid, Card, CardContent, CardHeader, Avatar, Chip } from '@mui/material';
import { 
  Person as PersonIcon, 
  Security as SecurityIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Benvenuto nella tua area personale, <strong>{user?.name}</strong>
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', 
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, position: 'relative', zIndex: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                width: 80,
                height: 80,
                fontSize: '2rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {user?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EmailIcon sx={{ fontSize: 18 }} />
                <Typography variant="body1">{user?.email}</Typography>
              </Box>
              <Chip
                icon={user?.role === 'admin' ? <AdminIcon /> : <SecurityIcon />}
                label={user?.role === 'admin' ? 'Amministratore' : 'Utente'}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardHeader 
                title="Il tuo profilo" 
                sx={{ 
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiCardHeader-title': {
                    fontWeight: 600
                  }
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      mr: 2
                    }}
                  >
                    <PersonIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Nome completo
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user?.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'secondary.light',
                      color: 'secondary.main',
                      mr: 2
                    }}
                  >
                    <EmailIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: user?.role === 'admin' ? 'error.light' : 'success.light',
                      color: user?.role === 'admin' ? 'error.main' : 'success.main',
                      mr: 2
                    }}
                  >
                    {user?.role === 'admin' ? <AdminIcon /> : <SecurityIcon />}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Ruolo
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user?.role === 'admin' ? 'Amministratore' : 'Utente'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardHeader 
                title="Informazioni account" 
                sx={{ 
                  bgcolor: 'secondary.light',
                  color: 'secondary.contrastText',
                  '& .MuiCardHeader-title': {
                    fontWeight: 600
                  }
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'success.light',
                      color: 'success.main',
                      mr: 2
                    }}
                  >
                    <CalendarIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Data di creazione
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(user?.createdAt).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: user?.role === 'admin' ? 3 : 0, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'info.light',
                      color: 'info.main',
                      mr: 2
                    }}
                  >
                    <UpdateIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Ultimo aggiornamento
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(user?.updatedAt).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
                {user?.role === 'admin' && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      bgcolor: 'error.light',
                      color: 'error.contrastText',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <AdminIcon />
                    <Typography variant="body2" fontWeight={600}>
                      Hai accesso alle funzionalità di amministrazione
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
