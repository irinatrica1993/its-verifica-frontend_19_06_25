import { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  Fab 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import EventiList from '../components/eventi/EventiList';
import EventoDetail from '../components/eventi/EventoDetail';
import EventoForm from '../components/eventi/EventoForm';
import IscrizioniList from '../components/iscrizioni/IscrizioniList';
import { useAuth } from '../context/AuthContext';

const EventiPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedEventoId, setSelectedEventoId] = useState(null);
  const [showEventoForm, setShowEventoForm] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState(null);
  const { isAdmin } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedEventoId(null);
  };

  const handleEventoSelect = (evento) => {
    setSelectedEventoId(evento.id);
  };

  const handleEventoClick = (eventoId) => {
    setSelectedEventoId(eventoId);
    setTabValue(0); // Passa alla tab degli eventi
  };

  const handleBack = () => {
    setSelectedEventoId(null);
    setEventoToEdit(null);
  };

  const handleCreateEvento = () => {
    setEventoToEdit(null);
    setShowEventoForm(true);
  };

  const handleUpdateEvento = (evento) => {
    setEventoToEdit(evento);
    setShowEventoForm(true);
  };

  const handleSaveEvento = () => {
    setShowEventoForm(false);
    setEventoToEdit(null);
    setSelectedEventoId(null);
    // Qui si potrebbe aggiungere un refresh della lista eventi
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Eventi
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="eventi tabs"
          >
            <Tab label="Eventi disponibili" />
            <Tab label="Le mie iscrizioni" />
          </Tabs>
        </Box>

        {tabValue === 0 && !selectedEventoId && (
          <EventiList onEventoSelect={handleEventoSelect} />
        )}

        {tabValue === 0 && selectedEventoId && (
          <EventoDetail 
            eventoId={selectedEventoId} 
            onBack={handleBack}
            onUpdate={handleUpdateEvento}
          />
        )}

        {tabValue === 1 && (
          <IscrizioniList onEventoSelect={handleEventoClick} />
        )}

        {isAdmin() && tabValue === 0 && !selectedEventoId && (
          <Fab 
            color="primary" 
            aria-label="add" 
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleCreateEvento}
          >
            <AddIcon />
          </Fab>
        )}

        {showEventoForm && (
          <EventoForm 
            evento={eventoToEdit} 
            onClose={() => setShowEventoForm(false)} 
            onSave={handleSaveEvento}
          />
        )}
      </Box>
    </Container>
  );
};

export default EventiPage;
