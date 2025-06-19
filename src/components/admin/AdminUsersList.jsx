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
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    cognome: '',
    password: '',
    role: 'user'
  });
  
  const { user } = useAuth();
  const currentUser = user;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento degli utenti:', err);
      setError('Impossibile caricare la lista degli utenti. Verifica la connessione e i permessi.');
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

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        password: '',
        role: user.role
      });
      setOpenEditDialog(true);
    } else {
      setSelectedUser(null);
      setFormData({
        email: '',
        nome: '',
        cognome: '',
        password: '',
        role: 'user'
      });
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenEditDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error('Errore nella creazione dell\'utente:', err);
      setError('Impossibile creare l\'utente. Verifica i dati inseriti.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
      
      await axios.put(`${API_URL}/users/${selectedUser.id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error('Errore nell\'aggiornamento dell\'utente:', err);
      setError('Impossibile aggiornare l\'utente. Verifica i dati inseriti.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchUsers();
      } catch (err) {
        console.error('Errore nell\'eliminazione dell\'utente:', err);
        setError('Impossibile eliminare l\'utente.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Gestione Utenti
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Utente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabella utenti">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Cognome</TableCell>
              <TableCell>Ruolo</TableCell>
              <TableCell>Data Registrazione</TableCell>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nessun utente trovato
                </TableCell>
              </TableRow>
            ) : (
              users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.cognome}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role === 'admin' ? 'Amministratore' : 'Utente'} 
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                        disabled={currentUser.id === user.id}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={currentUser.id === user.id}
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
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Righe per pagina:"
      />

      {/* Dialog per creare un nuovo utente */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Crea Nuovo Utente</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Inserisci i dati per creare un nuovo utente.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="nome"
            label="Nome"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nome}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="cognome"
            label="Cognome"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.cognome}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Ruolo</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              label="Ruolo"
              onChange={handleInputChange}
            >
              <MenuItem value="user">Utente</MenuItem>
              <MenuItem value="admin">Amministratore</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={!formData.email || !formData.nome || !formData.cognome || !formData.password}
          >
            Crea
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per modificare un utente esistente */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Modifica Utente</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Modifica i dati dell'utente.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="nome"
            label="Nome"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nome}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="cognome"
            label="Cognome"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.cognome}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password (lascia vuoto per non modificare)"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Ruolo</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              label="Ruolo"
              onChange={handleInputChange}
            >
              <MenuItem value="user">Utente</MenuItem>
              <MenuItem value="admin">Amministratore</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
            disabled={!formData.email || !formData.nome || !formData.cognome}
          >
            Aggiorna
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersList;
