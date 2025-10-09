import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import { getImageUrlWithFallback } from '../utils/imageUtils';
import StockModal from './StockModal';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [stockModal, setStockModal] = useState({ isOpen: false, message: '' })
  
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleQuantityChange = (productId, newQuantity, currentStock) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity > currentStock) {
      setStockModal({
        isOpen: true,
        message: `No hay más stock disponible. Solo quedan ${currentStock} unidades.`
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/carrito');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-purple-400" />
            Carrito ({totalItems})
          </h2>
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
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            // Carrito vacío
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-slate-400 mb-4">
                Agrega productos para comenzar tu compra
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Continuar comprando
              </Button>
            </div>
          ) : (
            // Lista de productos
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      {/* Imagen del producto */}
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={getImageUrlWithFallback(item.imagen_principal)}
                          alt={item.nombre}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium text-sm line-clamp-2">
                            {item.nombre}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-400 p-1 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {item.marca?.nombre && (
                          <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs mb-2">
                            {item.marca.nombre}
                          </Badge>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Controles de cantidad */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                              className="w-8 h-8 p-0 border-slate-600"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-white font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                              className="w-8 h-8 p-0 border-slate-600"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Precio */}
                          <div className="text-right">
                            <div className="text-white font-bold">
                              {formatPrice(item.precio * item.quantity)}
                            </div>
                            <div className="text-slate-400 text-xs">
                              {formatPrice(item.precio)} c/u
                            </div>
                          </div>
                        </div>

                        {/* Indicador de stock */}
                        {item.quantity >= item.stock && (
                          <div className="text-orange-400 text-xs mt-1">
                            Stock máximo: {item.stock}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer con totales y acciones */}
        {items.length > 0 && (
          <div className="border-t border-slate-700 p-4 space-y-4">
            {/* Resumen de totales */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({totalItems} productos):</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
              >
                Finalizar Compra
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Vaciar carrito
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stock Modal */}
      <StockModal
        isOpen={stockModal.isOpen}
        onClose={() => setStockModal({ isOpen: false, message: '' })}
        message={stockModal.message}
        type="warning"
      />
    </>
  );
};

export default CartSidebar;
