import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Código de cupón"
            value={codigoCupon}
            onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            disabled={cargando || cuponActivo}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none disabled:opacity-50"
          />
        </div>
        <Button
          onClick={handleAplicarCupon}
          disabled={cargando || cuponActivo || !codigoCupon.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
        >
          {cargando ? 'Validando...' : 'APLICAR'}
        </Button>
      </div>

      {cuponActivo && (
        <div className="flex items-center justify-between bg-green-600/20 border border-green-600/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">
              {cuponActivo.nombreCupon} - {cuponActivo.porcentajeDescuento}% OFF
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleQuitarCupon}
            className="text-green-400 hover:text-green-300 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {mensaje && (
        <div className={`p-3 rounded-lg border ${
          tipoMensaje === 'error' 
            ? 'bg-red-600/20 border-red-600/30 text-red-400' 
            : 'bg-green-600/20 border-green-600/30 text-green-400'
        }`}>
          <div className="flex items-center justify-between">
            <span>{mensaje}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={limpiarMensaje}
              className={`p-1 ${
                tipoMensaje === 'error' 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-green-400 hover:text-green-300'
              }`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuponInput;
