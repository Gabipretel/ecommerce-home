import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Acciones del carrito
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Reducer del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Producto ya existe, actualizar cantidad
        const newItems = [...state.items];
        const currentQuantity = newItems[existingItemIndex].quantity;
        const newQuantity = currentQuantity + quantity;
        
        // Validar stock
        if (newQuantity > product.stock) {
          return state;
        }
        
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity
        };

        return { ...state, items: newItems };
      } else {
        // Producto nuevo
        if (quantity > product.stock) {
          return state;
        }

        const newItem = {
          id: product.id,
          nombre: product.nombre,
          precio: parseFloat(product.precio) || 0,
          imagen_principal: product.imagen_principal || product.imagen_url,
          stock: product.stock || 0,
          marca: product.marca,
          quantity: quantity
        };

        return { ...state, items: [...state.items, newItem] };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        };
      }

      const newItems = state.items.map(item => {
        if (item.id === productId) {
          if (quantity > item.stock) {
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });

      return { ...state, items: newItems };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return { ...state, items: [] };
    }

    case CART_ACTIONS.LOAD_CART: {
      return { ...state, items: action.payload || [] };
    }

    default:
      return state;
  }
};

// Hook para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Proveedor del carrito
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error guardando carrito:', error);
    }
  }, [state.items]);

  // Funciones del carrito
  const addToCart = (product, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const canAddToCart = (product, quantity = 1) => {
    const currentQuantity = getItemQuantity(product.id);
    return (currentQuantity + quantity) <= product.stock;
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    isInCart,
    canAddToCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
