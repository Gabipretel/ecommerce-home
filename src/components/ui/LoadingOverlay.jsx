import React from 'react';
import { PacmanLoader } from 'react-spinners';

const LoadingOverlay = ({ 
  isLoading, 
  message = "Cargando...", 
  size = 60, 
  color = "#fbbf24",
  showOverlay = true 
}) => {
  if (!isLoading) return null;

  if (showOverlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <PacmanLoader color={color} size={size} />
          <p className="text-white text-xl mt-6 font-semibold">{message}</p>
        </div>
      </div>
    );
  }

  // Versión sin overlay para botones o elementos pequeños
  return (
    <div className="flex items-center justify-center space-x-2">
      <PacmanLoader color={color} size={size} />
      <span>{message}</span>
    </div>
  );
};

export default LoadingOverlay;
