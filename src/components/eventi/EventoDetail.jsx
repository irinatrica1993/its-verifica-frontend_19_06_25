import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  Person,
  Check,
  ArrowBack,
  Delete,
  Edit,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import eventoService from '../../services/eventoService';
import iscrizioneService from '../../services/iscrizioneService';

const EventoDetail = ({ eventoId, onBack, onUpdate }) => {
  const [evento, setEvento] = useState(null);
  const [iscrizioni, setIscrizioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iscrizioneUtente, setIscrizioneUtente] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIscrizione, setSelectedIscrizione] = useState(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carica i dettagli dell'evento
        const eventoData = await eventoService.getEventoById(eventoId);
        setEvento(eventoData);
        
        // Carica le iscrizioni dell'utente
        const iscrizioniUtente = await iscrizioneService.getIscrizioniUtente();
        const iscrizione = iscrizioniUtente.find(i => i.eventoId === eventoId);
        setIscrizioneUtente(iscrizione || null);
        
        // Se l'utente è admin, carica tutte le iscrizioni per questo evento
        if (isAdmin()) {
          const iscrizioniEvento = await iscrizioneService.getIscrizioniEvento(eventoId);
          setIscrizioni(iscrizioniEvento);
        }
      } catch (err) {
        console.error('Errore nel caricamento dell\'evento:', err);
        setError('Impossibile caricare i dettagli dell\'evento. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    if (eventoId) {
      fetchEvento();
    }
  }, [eventoId, isAdmin]);

  // Gestisce l'iscrizione a un evento
  const handleIscrizione = async () => {
    try {
      setError(null);
      await iscrizioneService.createIscrizione(eventoId);
      
      // Aggiorna l'iscrizione dell'utente
      const iscrizioniUtente = await iscrizioneService.getIscrizioniUtente();
      const iscrizione = iscrizioniUtente.find(i => i.eventoId === eventoId);
      setIscrizioneUtente(iscrizione || null);
      
      // Se l'utente è admin, aggiorna anche la lista delle iscrizioni
      if (isAdmin()) {
        const iscrizioniEvento = await iscrizioneService.getIscrizioniEvento(eventoId);
        setIscrizioni(iscrizioniEvento);
      }
    } catch (err) {
      console.error('Errore durante l\'iscrizione:', err);
      setError(err.response?.data?.message || 'Errore durante l\'iscrizione all\'evento');
    }
  };

  // Gestisce la cancellazione dell'iscrizione
  const handleCancellaIscrizione = async () => {
    try {
      setError(null);
      await iscrizioneService.deleteIscrizione(iscrizioneUtente.id);
      setIscrizioneUtente(null);
      
      // Se l'utente è admin, aggiorna anche la lista delle iscrizioni
      if (isAdmin()) {
        const iscrizioniEvento = await iscrizioneService.getIscrizioniEvento(eventoId);
        setIscrizioni(iscrizioniEvento);
      }
    } catch (err) {
      console.error('Errore durante la cancellazione dell\'iscrizione:', err);
      setError(err.response?.data?.message || 'Errore durante la cancellazione dell\'iscrizione');
    }
  };

  // Gestisce il check-in di un'iscrizione (solo admin)
  const handleCheckIn = async (iscrizioneId) => {
    try {
      setError(null);
      await iscrizioneService.checkInIscrizione(iscrizioneId);
      
      // Aggiorna la lista delle iscrizioni
      const iscrizioniEvento = await iscrizioneService.getIscrizioniEvento(eventoId);
      setIscrizioni(iscrizioniEvento);
      
      setOpenDialog(false);
    } catch (err) {
      console.error('Errore durante il check-in:', err);
      setError(err.response?.data?.message || 'Errore durante il check-in');
    }
  };

  // Apre il dialog di conferma per il check-in
  const openCheckInDialog = (iscrizione) => {
    setSelectedIscrizione(iscrizione);
    setOpenDialog(true);
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

  if (!evento) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Evento non trovato.
      </Alert>
    );
  }

  return (
    <Box>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Torna agli eventi
      </Button>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {evento.titolo}
          </Typography>
          
          {isAdmin() && (
            <Box>
              <IconButton 
                color="primary" 
                aria-label="modifica evento"
                onClick={() => onUpdate(evento)}
              >
                <Edit />
              </IconButton>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body1">
            {formatDate(evento.data)}
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          {evento.descrizione}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 3 }}>
          {iscrizioneUtente ? (
            <Box>
              <Chip 
                label="Sei iscritto a questo evento" 
                color="success" 
                icon={<Check />} 
                sx={{ mb: 2 }} 
              />
              
              {iscrizioneUtente.checkinEffettuato && (
                <Chip 
                  label="Check-in effettuato" 
                  color="info" 
                  icon={<CheckCircle />} 
                  sx={{ ml: 1, mb: 2 }} 
                />
              )}
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleCancellaIscrizione}
                >
                  Cancella iscrizione
                </Button>
              </Box>
            </Box>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleIscrizione}
            >
              Iscriviti all'evento
            </Button>
          )}
        </Box>
      </Paper>
      
      {isAdmin() && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Iscrizioni ({iscrizioni.length})
          </Typography>
          
          {iscrizioni.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nessuna iscrizione per questo evento.
            </Typography>
          ) : (
            <List>
              {iscrizioni.map((iscrizione) => (
                <ListItem
                  key={iscrizione.id}
                  secondaryAction={
                    !iscrizione.checkinEffettuato ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => openCheckInDialog(iscrizione)}
                      >
                        Check-in
                      </Button>
                    ) : (
                      <Chip 
                        label="Check-in effettuato" 
                        color="success" 
                        size="small" 
                        icon={<CheckCircle />} 
                      />
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${iscrizione.user.nome} ${iscrizione.user.cognome}`}
                    secondary={iscrizione.user.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
      
      {/* Dialog di conferma per il check-in */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Conferma check-in</DialogTitle>
        <DialogContent>
          <Typography>
            Confermi il check-in per {selectedIscrizione?.user?.nome} {selectedIscrizione?.user?.cognome}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annulla</Button>
          <Button 
            onClick={() => handleCheckIn(selectedIscrizione?.id)} 
            variant="contained" 
            color="primary"
          >
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventoDetail;
