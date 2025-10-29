import React from 'react';
import { CheckCircle, Mail, Truck, CreditCard, X } from 'lucide-react';
import { Button } from './ui/button';

const CheckoutSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              ¡Compra Finalizada!
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-slate-300 text-lg mb-4">
              Tu compra ha sido concluida con éxito
            </p>
            <p className="text-slate-400 text-sm">
              Nos estaremos comunicando contigo por email para acordar la metodología de pago y envío
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white text-sm font-medium">Confirmación por Email</p>
                <p className="text-slate-400 text-xs">Recibirás los detalles de tu pedido</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white text-sm font-medium">Método de Pago</p>
                <p className="text-slate-400 text-xs">Acordaremos la forma de pago más conveniente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
              <Truck className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white text-sm font-medium">Envío Seguro</p>
                <p className="text-slate-400 text-xs">Coordinaremos la entrega a tu domicilio</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessModal;
