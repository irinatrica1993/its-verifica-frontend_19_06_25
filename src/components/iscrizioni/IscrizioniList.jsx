import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  CardActions,
  Grid
} from '@mui/material';
import { 
  Event, 
  CheckCircle, 
  Cancel, 
  CalendarMonth 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import iscrizioneService from '../../services/iscrizioneService';

const IscrizioniList = ({ onEventoSelect }) => {
  const [iscrizioni, setIscrizioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchIscrizioni = async () => {
      try {
        setLoading(true);
        setError(null);
        const iscrizioniData = await iscrizioneService.getIscrizioniUtente();
        setIscrizioni(iscrizioniData);
      } catch (err) {
        console.error('Errore nel caricamento delle iscrizioni:', err);
        setError('Impossibile caricare le iscrizioni. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchIscrizioni();
  }, []);

  // Gestisce la cancellazione dell'iscrizione
  const handleCancellaIscrizione = async (iscrizioneId) => {
    try {
      setError(null);
      await iscrizioneService.deleteIscrizione(iscrizioneId);
      // Aggiorna la lista delle iscrizioni
      const iscrizioniAggiornate = await iscrizioneService.getIscrizioniUtente();
      setIscrizioni(iscrizioniAggiornate);
    } catch (err) {
      console.error('Errore durante la cancellazione dell\'iscrizione:', err);
      setError(err.response?.data?.message || 'Errore durante la cancellazione dell\'iscrizione');
    }
  };

  // Formatta la data dell'evento
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Le mie iscrizioni
      </Typography>

      {iscrizioni.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Non sei iscritto a nessun evento.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {iscrizioni.map((iscrizione) => (
            <Grid item xs={12} md={6} key={iscrizione.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {iscrizione.evento.titolo}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonth sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(iscrizione.evento.data)}
                    </Typography>
                  </Box>
                  
                  {iscrizione.checkinEffettuato ? (
                    <Chip 
                      icon={<CheckCircle />} 
                      label="Check-in effettuato" 
                      color="success" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Chip 
                      label="Check-in non effettuato" 
                      color="default" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => onEventoSelect(iscrizione.evento.id)}
                  >
                    Dettagli evento
                  </Button>
                  
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => handleCancellaIscrizione(iscrizione.id)}
                  >
                    Cancella
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default IscrizioniList;
