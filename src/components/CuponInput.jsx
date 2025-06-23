import React, { useState } from 'react';
import { TextField, Button, Box, Alert, Chip } from '@mui/material';
import { LocalOffer, Close } from '@mui/icons-material';
import { useCupon } from '../context/CuponContext';
import api from '../services/api';

const CuponInput = () => {
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cargando, setCargando] = useState(false);
  const { 
    cuponActivo, 
    mensaje, 
    tipoMensaje, 
    aplicarCupon, 
    quitarCupon, 
    mostrarError, 
    limpiarMensaje 
  } = useCupon();

  const handleAplicarCupon = async () => {
    if (!codigoCupon.trim()) {
      mostrarError('Por favor, ingresa un código de cupón');
      return;
    }

    setCargando(true);
    limpiarMensaje();

    try {
      const response = await api.get(`/cupones/validar/${codigoCupon.trim()}`);
      
      if (response.data.valido) {
        aplicarCupon(response.data.data);
        setCodigoCupon('');
      } else {
        mostrarError('El código de cupón ingresado no es válido o ha expirado.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        mostrarError('El código de cupón ingresado no es válido o ha expirado.');
      } else {
        mostrarError('Error al validar el cupón. Intenta nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleQuitarCupon = () => {
    quitarCupon();
    setCodigoCupon('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAplicarCupon();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Código de cupón"
          placeholder="Ingresa tu código"
          value={codigoCupon}
          onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          disabled={cargando || cuponActivo}
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <LocalOffer sx={{ color: 'action.active', mr: 1 }} />
          }}
        />
        <Button
          variant="contained"
          onClick={handleAplicarCupon}
          disabled={cargando || cuponActivo || !codigoCupon.trim()}
          sx={{ minWidth: 120 }}
        >
          {cargando ? 'Validando...' : 'Aplicar'}
        </Button>
      </Box>

      {cuponActivo && (
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<LocalOffer />}
            label={`${cuponActivo.nombreCupon} - ${cuponActivo.porcentajeDescuento}% OFF`}
            color="success"
            variant="outlined"
            onDelete={handleQuitarCupon}
            deleteIcon={<Close />}
            sx={{ 
              fontSize: '0.9rem',
              fontWeight: 'bold',
              '& .MuiChip-deleteIcon': {
                color: 'success.main'
              }
            }}
          />
        </Box>
      )}

      {mensaje && (
        <Alert 
          severity={tipoMensaje === 'error' ? 'error' : 'success'}
          onClose={limpiarMensaje}
          sx={{ mb: 2 }}
        >
          {mensaje}
        </Alert>
      )}
    </Box>
  );
};

export default CuponInput;
