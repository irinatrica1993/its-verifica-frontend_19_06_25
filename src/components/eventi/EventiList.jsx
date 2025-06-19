import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid, 
  Chip, 
  CircularProgress,
  Alert
} from '@mui/material';
import { CalendarMonth, AccessTime, Info } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import eventoService from '../../services/eventoService';
import iscrizioneService from '../../services/iscrizioneService';

const EventiList = ({ onEventoSelect }) => {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iscrizioniUtente, setIscrizioniUtente] = useState([]);
  const { isAdmin } = useAuth();

  // Carica gli eventi e le iscrizioni dell'utente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventiData = await eventoService.getAllEventi();
        setEventi(eventiData);
        
        // Carica le iscrizioni dell'utente
        const iscrizioniData = await iscrizioneService.getIscrizioniUtente();
        setIscrizioniUtente(iscrizioniData);
      } catch (err) {
        console.error('Errore nel caricamento degli eventi:', err);
        setError('Impossibile caricare gli eventi. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Verifica se l'utente è iscritto a un evento
  const isUtenteIscritto = (eventoId) => {
    return iscrizioniUtente.some(iscrizione => iscrizione.eventoId === eventoId);
  };

  // Gestisce l'iscrizione a un evento
  const handleIscrizione = async (eventoId) => {
    try {
      await iscrizioneService.createIscrizione(eventoId);
      const iscrizioniAggiornate = await iscrizioneService.getIscrizioniUtente();
      setIscrizioniUtente(iscrizioniAggiornate);
    } catch (err) {
      console.error('Errore durante l\'iscrizione:', err);
      setError(err.response?.data?.message || 'Errore durante l\'iscrizione all\'evento');
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
      {eventi.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 4 }}>
          Nessun evento disponibile al momento.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {eventi.map((evento) => (
            <Grid item xs={12} md={6} key={evento.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {evento.titolo}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonth sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(evento.data)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {evento.descrizione}
                  </Typography>
                  
                  {isUtenteIscritto(evento.id) && (
                    <Chip 
                      label="Sei iscritto" 
                      color="success" 
                      size="small" 
                      sx={{ mb: 2 }} 
                    />
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<Info />}
                    onClick={() => onEventoSelect(evento)}
                  >
                    Dettagli
                  </Button>
                  
                  {!isUtenteIscritto(evento.id) ? (
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => handleIscrizione(evento.id)}
                    >
                      Iscriviti
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="success" 
                      disabled
                    >
                      Iscritto
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default EventiList;
