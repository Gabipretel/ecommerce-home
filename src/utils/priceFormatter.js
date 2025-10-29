// Función utilitaria para formatear precios de manera consistente en toda la aplicación
export const formatPrice = (price) => {
  return `USD ${new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)}`;
};

// Función para formatear precios con USD y símbolo de dólar
export const formatPriceNumber = (price) => {
  return `USD ${new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)}`;
};
