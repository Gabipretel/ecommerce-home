// Función utilitaria para formatear precios de manera consistente en toda la aplicación
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Función para formatear precios sin símbolo de moneda (solo números)
export const formatPriceNumber = (price) => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};
