import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/priceFormatter';

const CartSummary = ({ onClick, isMobile = false }) => {
  const { getTotalItems, getTotalPrice } = useCart();
  const { userType } = useAuth();
  
  // Ocultar carrito para administradores
  if (userType === 'admin') {
    return null;
  }
  
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (isMobile) {
    return (
      <Button 
        variant="ghost" 
        className="text-slate-300 hover:text-white justify-start"
        onClick={onClick}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Carrito ({totalItems})
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      className="text-slate-300 hover:text-white relative"
      onClick={onClick}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Carrito
      {totalItems > 0 && (
        <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs">
          {totalItems}
        </Badge>
      )}
    </Button>
  );
};

export default CartSummary;
