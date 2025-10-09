import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

const StockModal = ({ isOpen, onClose, message, type = 'warning' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-orange-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <AlertCircle className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-md mx-4">
        <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-white">
                Stock Insuficiente
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-slate-300 mb-4">
              {message || 'No hay más productos disponibles en stock.'}
            </p>
            
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockModal;
