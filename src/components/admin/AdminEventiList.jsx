import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Event as EventIcon
} from '@mui/icons-material';
import eventoService from '../../services/eventoService';

const AdminEventiList = () => {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    luogo: '',
    dataInizio: new Date(),
    dataFine: new Date(),
    postiDisponibili: 50,
    immagineUrl: ''
  });

  useEffect(() => {
    fetchEventi();
  }, []);

  const fetchEventi = async () => {
    try {
      setLoading(true);
      const response = await eventoService.getAllEventi();
      setEventi(response);
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento degli eventi:', err);
      setError('Impossibile caricare la lista degli eventi. Verifica la connessione.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (evento = null) => {
    if (evento) {
      setSelectedEvento(evento);
      setFormData({
        titolo: evento.titolo,
        descrizione: evento.descrizione,
        luogo: evento.luogo,
        dataInizio: new Date(evento.dataInizio),
        dataFine: new Date(evento.dataFine),
        postiDisponibili: evento.postiDisponibili,
        immagineUrl: evento.immagineUrl || ''
      });
    } else {
      setSelectedEvento(null);
      setFormData({
        titolo: '',
        descrizione: '',
        luogo: '',
        dataInizio: new Date(),
        dataFine: new Date(),
        postiDisponibili: 50,
        immagineUrl: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEvento = async () => {
    try {
      setLoading(true);
      if (selectedEvento) {
        await eventoService.updateEvento(selectedEvento.id, formData);
      } else {
        await eventoService.createEvento(formData);
      }
      fetchEventi();
      handleCloseDialog();
    } catch (err) {
      console.error('Errore nel salvataggio dell\'evento:', err);
      setError('Impossibile salvare l\'evento. Verifica i dati inseriti.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvento = async (eventoId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
      try {
        setLoading(true);
        await eventoService.deleteEvento(eventoId);
        fetchEventi();
      } catch (err) {
        console.error('Errore nell\'eliminazione dell\'evento:', err);
        setError('Impossibile eliminare l\'evento.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusChip = (evento) => {
    const now = new Date();
    const dataEvento = new Date(evento.data || evento.dataInizio);
    
    if (isNaN(dataEvento.getTime())) {
      return <Chip label="Data non valida" color="error" size="small" />;
    }
    
    if (now < dataEvento) {
      return <Chip label="In programma" color="primary" size="small" />;
    } else {
      return <Chip label="Terminato" color="default" size="small" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Gestione Eventi
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Evento
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabella eventi">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titolo</TableCell>
              <TableCell>Luogo</TableCell>
              <TableCell>Data Inizio</TableCell>
              <TableCell>Data Fine</TableCell>
              <TableCell>Posti</TableCell>
              <TableCell>Stato</TableCell>
              <TableCell align="right">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : eventi.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Nessun evento trovato
                </TableCell>
              </TableRow>
            ) : (
              eventi
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((evento) => (
                  <TableRow key={evento.id}>
                    <TableCell>{evento.id?.substring(0, 8) || 'N/D'}</TableCell>
                    <TableCell>{evento.titolo || 'Senza titolo'}</TableCell>
                    <TableCell>{evento.luogo || 'Non specificato'}</TableCell>
                    <TableCell>
                      {(() => {
                        // Usa 'data' invece di 'dataInizio' per compatibilità con lo schema
                        const dataEvento = evento.data || evento.dataInizio;
                        if (!dataEvento) return 'Data non disponibile';
                        const date = new Date(dataEvento);
                        if (isNaN(date.getTime())) return 'Data non valida';
                        return date.toLocaleString('it-IT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        // Usa 'data' invece di 'dataFine' per compatibilità con lo schema
                        const dataEvento = evento.data || evento.dataFine;
                        if (!dataEvento) return '-';
                        const date = new Date(dataEvento);
                        if (isNaN(date.getTime())) return '-';
                        // Per ora mostriamo la stessa data, in futuro si può aggiungere dataFine allo schema
                        return '-';
                      })()}
                    </TableCell>
                    <TableCell>{evento.postiDisponibili || 0}</TableCell>
                    <TableCell>
                      {getStatusChip(evento)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenDialog(evento)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteEvento(evento.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={eventi.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Righe per pagina:"
      />

      {/* Dialog per creare/modificare un evento */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEvento ? 'Modifica Evento' : 'Crea Nuovo Evento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="titolo"
                label="Titolo"
                fullWidth
                variant="outlined"
                value={formData.titolo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descrizione"
                label="Descrizione"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.descrizione}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="luogo"
                label="Luogo"
                fullWidth
                variant="outlined"
                value={formData.luogo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Data e ora di inizio"
                value={formData.dataInizio}
                onChange={(newValue) => handleDateChange('dataInizio', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Data e ora di fine"
                value={formData.dataFine}
                onChange={(newValue) => handleDateChange('dataFine', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="postiDisponibili"
                label="Posti disponibili"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.postiDisponibili}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="immagineUrl"
                label="URL Immagine (opzionale)"
                fullWidth
                variant="outlined"
                value={formData.immagineUrl}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleSaveEvento} 
            variant="contained"
            disabled={!formData.titolo || !formData.luogo || !formData.dataInizio || !formData.dataFine}
          >
            {selectedEvento ? 'Aggiorna' : 'Crea'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEventiList;
