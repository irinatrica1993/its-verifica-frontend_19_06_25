import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { it } from 'date-fns/locale';
import eventoService from '../../services/eventoService';

const EventoForm = ({ evento, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    titolo: evento?.titolo || '',
    descrizione: evento?.descrizione || '',
    data: evento?.data ? new Date(evento.data) : new Date()
  };

  const validationSchema = Yup.object({
    titolo: Yup.string()
      .required('Titolo obbligatorio')
      .min(3, 'Il titolo deve contenere almeno 3 caratteri'),
    descrizione: Yup.string()
      .required('Descrizione obbligatoria')
      .min(10, 'La descrizione deve contenere almeno 10 caratteri'),
    data: Yup.date()
      .required('Data obbligatoria')
      .min(new Date(), 'La data non può essere nel passato')
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        const eventoData = {
          ...values,
          data: values.data.toISOString()
        };
        
        let result;
        if (evento?.id) {
          // Aggiorna evento esistente
          result = await eventoService.updateEvento(evento.id, eventoData);
        } else {
          // Crea nuovo evento
          result = await eventoService.createEvento(eventoData);
        }
        
        onSave(result);
      } catch (err) {
        console.error('Errore durante il salvataggio dell\'evento:', err);
        setError(err.response?.data?.message || 'Errore durante il salvataggio dell\'evento');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {evento?.id ? 'Modifica evento' : 'Crea nuovo evento'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            id="titolo"
            name="titolo"
            label="Titolo evento"
            variant="outlined"
            margin="normal"
            value={formik.values.titolo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.titolo && Boolean(formik.errors.titolo)}
            helperText={formik.touched.titolo && formik.errors.titolo}
          />
          
          <TextField
            fullWidth
            id="descrizione"
            name="descrizione"
            label="Descrizione"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={formik.values.descrizione}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.descrizione && Boolean(formik.errors.descrizione)}
            helperText={formik.touched.descrizione && formik.errors.descrizione}
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
            <DateTimePicker
              label="Data e ora"
              value={formik.values.data}
              onChange={(newValue) => {
                formik.setFieldValue('data', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  name="data"
                  error={formik.touched.data && Boolean(formik.errors.data)}
                  helperText={formik.touched.data && formik.errors.data}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Annulla</Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={formik.handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (evento?.id ? 'Aggiorna' : 'Crea')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventoForm;
