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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Event as EventIcon
} from '@mui/icons-material';
import iscrizioneService from '../../services/iscrizioneService';
import eventoService from '../../services/eventoService';

const AdminIscrizioniList = () => {
  const [iscrizioni, setIscrizioni] = useState([]);
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEventoId, setSelectedEventoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEventi();
  }, []);

  useEffect(() => {
    if (selectedEventoId) {
      fetchIscrizioniByEvento(selectedEventoId);
    } else {
      fetchAllIscrizioni();
    }
  }, [selectedEventoId]);

  const fetchEventi = async () => {
    try {
      const response = await eventoService.getAllEventi();
      setEventi(response);
    } catch (err) {
      console.error('Errore nel caricamento degli eventi:', err);
      setError('Impossibile caricare la lista degli eventi.');
    }
  };

  const fetchAllIscrizioni = async () => {
    try {
      setLoading(true);
      // Poiché non esiste un metodo getAllIscrizioni, recuperiamo prima tutti gli eventi
      // e poi per ciascuno recuperiamo le iscrizioni associate
      const eventiList = await eventoService.getAllEventi();
      let allIscrizioni = [];
      
      // Se ci sono eventi, recuperiamo le iscrizioni per ciascuno
      if (eventiList && eventiList.length > 0) {
        // Creiamo un array di promesse per recuperare le iscrizioni di ogni evento
        const promises = eventiList.map(evento => 
          iscrizioneService.getIscrizioniEvento(evento.id)
            .then(response => response)
            .catch(error => {
              console.error(`Errore nel recupero iscrizioni per evento ${evento.id}:`, error);
              return []; // Ritorniamo un array vuoto in caso di errore
            })
        );
        
        // Attendiamo tutte le promesse e combiniamo i risultati
        const results = await Promise.all(promises);
        allIscrizioni = results.flat(); // Appiattisce l'array di array in un unico array
      }
      
      setIscrizioni(allIscrizioni);
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento delle iscrizioni:', err);
      setError('Impossibile caricare la lista delle iscrizioni.');
    } finally {
      setLoading(false);
    }
  };

  const fetchIscrizioniByEvento = async (eventoId) => {
    try {
      setLoading(true);
      const response = await iscrizioneService.getIscrizioniEvento(eventoId);
      setIscrizioni(response);
      setError(null);
    } catch (err) {
      console.error(`Errore nel caricamento delle iscrizioni per l'evento ${eventoId}:`, err);
      setError(`Impossibile caricare le iscrizioni per l'evento selezionato.`);
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

  const handleEventoChange = (event) => {
    setSelectedEventoId(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleToggleCheckin = async (iscrizioneId, currentStatus) => {
    try {
      setLoading(true);
      // Utilizziamo il metodo checkInIscrizione per gestire entrambi i casi
      // Il backend dovrebbe gestire il toggle dello stato
      await iscrizioneService.checkInIscrizione(iscrizioneId);
      
      // Aggiorna la lista delle iscrizioni
      if (selectedEventoId) {
        await fetchIscrizioniByEvento(selectedEventoId);
      } else {
        await fetchAllIscrizioni();
      }
      
      setError(null);
    } catch (err) {
      console.error('Errore nella gestione del check-in:', err);
      setError('Impossibile aggiornare lo stato del check-in.');
    } finally {
      setLoading(false);
    }
  };

  // Filtra le iscrizioni in base al termine di ricerca
  const filteredIscrizioni = iscrizioni.filter(iscrizione => {
    if (!iscrizione || !searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Gestisci in modo sicuro l'accesso alle proprietà che potrebbero non esistere
    // Controlla se abbiamo user o utente (dipende dall'API chiamata)
    const user = iscrizione.user || iscrizione.utente || {};
    const evento = iscrizione.evento || {};
    
    // Estrai i valori in modo sicuro con fallback a stringhe vuote
    const nome = (user.nome || '').toLowerCase();
    const cognome = (user.cognome || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const titolo = (evento.titolo || '').toLowerCase();
    
    return (
      nome.includes(searchTermLower) ||
      cognome.includes(searchTermLower) ||
      email.includes(searchTermLower) ||
      titolo.includes(searchTermLower)
    );
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Gestione Iscrizioni
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="evento-select-label">Filtra per evento</InputLabel>
          <Select
            labelId="evento-select-label"
            value={selectedEventoId}
            label="Filtra per evento"
            onChange={handleEventoChange}
          >
            <MenuItem value="">Tutti gli eventi</MenuItem>
            {eventi.map((evento) => (
              <MenuItem key={evento.id} value={evento.id}>
                {evento.titolo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Cerca"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabella iscrizioni">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Utente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Evento</TableCell>
              <TableCell>Data Iscrizione</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell align="right">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredIscrizioni.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nessuna iscrizione trovata
                </TableCell>
              </TableRow>
            ) : (
              filteredIscrizioni
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((iscrizione, index) => (
                  <TableRow key={iscrizione.id || index}>
                    <TableCell>{iscrizione.id?.substring(0, 8) || 'N/D'}</TableCell>
                    <TableCell>
                      {(() => {
                        const user = iscrizione.user || iscrizione.utente || {};
                        const nome = user.nome || '';
                        const cognome = user.cognome || '';
                        const fullName = `${nome} ${cognome}`.trim();
                        return fullName || 'Utente sconosciuto';
                      })()}
                    </TableCell>
                    <TableCell>{(iscrizione.user || iscrizione.utente || {}).email || 'N/D'}</TableCell>
                    <TableCell>
                      {(() => {
                        const evento = iscrizione.evento || {};
                        return evento.titolo || 'Evento non disponibile';
                      })()}
                    </TableCell>
                    <TableCell>
                      {iscrizione.createdAt 
                        ? new Date(iscrizione.createdAt).toLocaleString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/D'}
                    </TableCell>
                    <TableCell>
                      {iscrizione.checkinEffettuato ? (
                        <Chip 
                          label="Effettuato" 
                          color="success" 
                          size="small"
                          icon={<CheckIcon />}
                        />
                      ) : (
                        <Chip 
                          label="Non effettuato" 
                          color="default" 
                          size="small"
                          icon={<CancelIcon />}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const evento = iscrizione.evento || {};
                        const eventoData = evento.data ? new Date(evento.data) : null;
                        const isEventoScaduto = eventoData && eventoData < new Date();
                        
                        return (
                          <Button
                            variant="outlined"
                            color={iscrizione.checkinEffettuato ? "error" : "success"}
                            size="small"
                            onClick={() => handleToggleCheckin(iscrizione.id, iscrizione.checkinEffettuato)}
                            disabled={isEventoScaduto}
                            title={isEventoScaduto ? 'Evento scaduto' : ''}
                          >
                            {iscrizione.checkinEffettuato ? "Annulla check-in" : "Effettua check-in"}
                          </Button>
                        );
                      })()}
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
        count={filteredIscrizioni.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Righe per pagina:"
      />
    </Box>
  );
};

export default AdminIscrizioniList;
