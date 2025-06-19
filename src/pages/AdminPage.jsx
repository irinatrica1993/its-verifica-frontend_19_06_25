import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  AssignmentTurnedIn as CheckInIcon,
  BarChart as StatsIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AdminUsersList from '../components/admin/AdminUsersList';
import AdminEventiList from '../components/admin/AdminEventiList';
import AdminIscrizioniList from '../components/admin/AdminIscrizioniList';
import AdminStats from '../components/admin/AdminStats';

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pannello di Amministrazione
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Benvenuto nel pannello di amministrazione, {user?.nome} {user?.cognome}. 
          Qui puoi gestire utenti, eventi e visualizzare statistiche.
        </Alert>

        <Paper sx={{ mb: 4, p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PeopleIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h5" component="div">
                    Utenti
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gestione utenti
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <EventIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h5" component="div">
                    Eventi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gestione eventi
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckInIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h5" component="div">
                    Iscrizioni
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gestione iscrizioni
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <StatsIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h5" component="div">
                    Statistiche
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dati e metriche
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Utenti" icon={<PeopleIcon />} iconPosition="start" />
            <Tab label="Eventi" icon={<EventIcon />} iconPosition="start" />
            <Tab label="Iscrizioni" icon={<CheckInIcon />} iconPosition="start" />
            <Tab label="Statistiche" icon={<StatsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <AdminUsersList />
        )}

        {tabValue === 1 && (
          <AdminEventiList />
        )}

        {tabValue === 2 && (
          <AdminIscrizioniList />
        )}

        {tabValue === 3 && (
          <AdminStats />
        )}
      </Box>
    </Container>
  );
};

export default AdminPage;
