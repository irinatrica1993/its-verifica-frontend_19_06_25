import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  AssignmentTurnedIn as CheckInIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from 'axios';
import eventoService from '../../services/eventoService';
import iscrizioneService from '../../services/iscrizioneService';

const API_URL = import.meta.env.VITE_API_URL;

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    checkInRate: 0,
    upcomingEvents: 0,
    activeEvents: 0,
    pastEvents: 0,
    mostPopularEvent: null,
    recentRegistrations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Ottieni il token di autenticazione
      const token = localStorage.getItem('token');
      
      // Ottieni il numero totale di utenti
      const usersResponse = await axios.get(`${API_URL}/users/count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ottieni gli eventi
      const eventiResponse = await eventoService.getAllEventi();
      
      // Ottieni tutte le iscrizioni (combinando le iscrizioni di tutti gli eventi)
      let iscrizioniResponse = [];
      
      // Se ci sono eventi, recuperiamo le iscrizioni per ciascuno
      if (eventiResponse && eventiResponse.length > 0) {
        // Creiamo un array di promesse per recuperare le iscrizioni di ogni evento
        const promises = eventiResponse.map(evento => 
          iscrizioneService.getIscrizioniEvento(evento.id)
            .then(response => response)
            .catch(error => {
              console.error(`Errore nel recupero iscrizioni per evento ${evento.id}:`, error);
              return []; // Ritorniamo un array vuoto in caso di errore
            })
        );
        
        // Attendiamo tutte le promesse e combiniamo i risultati
        const results = await Promise.all(promises);
        iscrizioniResponse = results.flat(); // Appiattisce l'array di array in un unico array
      }
      
      // Calcola le statistiche
      const now = new Date();
      const upcomingEvents = eventiResponse.filter(e => new Date(e.dataInizio) > now).length;
      const activeEvents = eventiResponse.filter(e => new Date(e.dataInizio) <= now && new Date(e.dataFine) >= now).length;
      const pastEvents = eventiResponse.filter(e => new Date(e.dataFine) < now).length;
      
      // Calcola il tasso di check-in (usando checkinEffettuato invece di checkIn)
      const totalCheckIns = iscrizioniResponse.filter(i => i && i.checkinEffettuato).length;
      const checkInRate = iscrizioniResponse.length > 0 
        ? Math.round((totalCheckIns / iscrizioniResponse.length) * 100) 
        : 0;
      
      // Trova l'evento più popolare
      const eventCounts = {};
      iscrizioniResponse.forEach(iscrizione => {
        // Verifica che iscrizione ed evento esistano
        if (iscrizione && iscrizione.evento && iscrizione.evento.id) {
          const eventoId = iscrizione.evento.id;
          eventCounts[eventoId] = (eventCounts[eventoId] || 0) + 1;
        }
      });
      
      let mostPopularEventId = null;
      let maxCount = 0;
      
      Object.entries(eventCounts).forEach(([eventoId, count]) => {
        if (count > maxCount) {
          mostPopularEventId = eventoId;
          maxCount = count;
        }
      });
      
      const mostPopularEvent = mostPopularEventId 
        ? eventiResponse.find(e => e.id === mostPopularEventId) 
        : null;
      
      // Ottieni le iscrizioni più recenti (ultime 5)
      const recentRegistrations = iscrizioniResponse
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setStats({
        totalUsers: usersResponse.data.count,
        totalEvents: eventiResponse.length,
        totalRegistrations: iscrizioniResponse.length,
        checkInRate,
        upcomingEvents,
        activeEvents,
        pastEvents,
        mostPopularEvent,
        recentRegistrations
      });
      
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento delle statistiche:', err);
      setError('Impossibile caricare le statistiche. Verifica la connessione e i permessi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Statistiche e Metriche
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h4" component="div">
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utenti Totali
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h4" component="div">
                {stats.totalEvents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Eventi Totali
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h4" component="div">
                {stats.totalRegistrations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Iscrizioni Totali
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckInIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h4" component="div">
                {stats.checkInRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasso di Check-in
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Stato Eventi
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {stats.upcomingEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In programma
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {stats.activeEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In corso
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="text.secondary">
                    {stats.pastEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Terminati
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Evento Più Popolare
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.mostPopularEvent ? (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {stats.mostPopularEvent.titolo}
                </Typography>
                <Typography variant="body2" paragraph>
                  {stats.mostPopularEvent.descrizione?.substring(0, 100)}
                  {stats.mostPopularEvent.descrizione?.length > 100 ? '...' : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Luogo: {stats.mostPopularEvent.luogo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data: {new Date(stats.mostPopularEvent.dataInizio).toLocaleDateString()}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Nessun evento con iscrizioni
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Iscrizioni Recenti
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentRegistrations.length > 0 ? (
              <Box>
                {stats.recentRegistrations.map((iscrizione, index) => (
                  <Box key={iscrizione.id || index} sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle1">
                          {/* Gestisci in modo sicuro l'accesso ai dati dell'utente */}
                          {(iscrizione.user || iscrizione.utente || {}).nome || 'N/D'} {(iscrizione.user || iscrizione.utente || {}).cognome || ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(iscrizione.user || iscrizione.utente || {}).email || 'N/D'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Typography variant="subtitle1">
                          {(iscrizione.evento || {}).titolo || 'N/D'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(iscrizione.evento || {}).luogo || 'N/D'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        {iscrizione.checkinEffettuato ? (
                          <Typography variant="body2" color="success.main">
                            Check-in effettuato
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Check-in non effettuato
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(iscrizione.createdAt).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    {index < stats.recentRegistrations.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Nessuna iscrizione recente
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStats;
