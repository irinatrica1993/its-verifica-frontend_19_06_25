import { Box, Container, Typography, Paper, Grid, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { Person as PersonIcon, Security as SecurityIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Benvenuto nella tua area personale, {user?.name}
        </Typography>

        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'white', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2">{user?.email}</Typography>
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Ruolo: {user?.role === 'admin' ? 'Amministratore' : 'Utente'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Il tuo profilo" />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    Nome: {user?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    Email: {user?.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    Ruolo: {user?.role === 'admin' ? 'Amministratore' : 'Utente'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Informazioni account" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  Il tuo account è stato creato il {new Date(user?.createdAt).toLocaleDateString('it-IT')}
                </Typography>
                <Typography variant="body1" paragraph>
                  Ultimo aggiornamento: {new Date(user?.updatedAt).toLocaleDateString('it-IT')}
                </Typography>
                {user?.role === 'admin' && (
                  <Typography variant="body1" color="primary">
                    Hai accesso alle funzionalità di amministrazione
                  </Typography>
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
