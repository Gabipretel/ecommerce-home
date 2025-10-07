/**
 * Utilidades para el manejo consistente de imágenes en toda la aplicación
 */

/**
 * Extrae la URL de una imagen, manejando diferentes formatos de datos
 * @param {string|object} imageData - Puede ser una URL string o un objeto con propiedad url
 * @returns {string} - URL de la imagen o string vacío si no hay imagen
 */
export const getImageUrl = (imageData) => {
  if (!imageData) return '';
  
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  if (typeof imageData === 'object' && imageData.url) {
    return imageData.url;
  }
  
  return '';
};

/**
 * Extrae el public_id de una imagen, manejando diferentes formatos de datos
 * @param {string|object} imageData - Puede ser un objeto con propiedad public_id
 * @returns {string} - public_id de la imagen o string vacío si no hay public_id
 */
export const getImagePublicId = (imageData) => {
  if (!imageData || typeof imageData !== 'object') return '';
  
  return imageData.public_id || '';
};

/**
 * Crea un array de URLs de imágenes a partir de una galería
 * @param {Array} gallery - Array de imágenes (strings o objetos)
 * @returns {Array} - Array de URLs de imágenes
 */
export const getGalleryUrls = (gallery) => {
  if (!Array.isArray(gallery)) return [];
  
  return gallery
    .map(img => getImageUrl(img))
    .filter(url => url !== '');
};

/**
 * Crea un array de objetos de imagen con URL y public_id
 * @param {Array} gallery - Array de imágenes (strings o objetos)
 * @returns {Array} - Array de objetos {url, public_id}
 */
export const getGalleryObjects = (gallery) => {
  if (!Array.isArray(gallery)) return [];
  
  return gallery.map(img => ({
    url: getImageUrl(img),
    public_id: getImagePublicId(img)
  })).filter(img => img.url !== '');
};

/**
 * Combina imagen principal y galería en un array de URLs
 * @param {string|object} mainImage - Imagen principal
 * @param {Array} gallery - Galería de imágenes
 * @returns {Array} - Array de URLs de todas las imágenes
 */
export const getAllImageUrls = (mainImage, gallery = []) => {
  const images = [];
  
  // Agregar imagen principal
  const mainUrl = getImageUrl(mainImage);
  if (mainUrl) {
    images.push(mainUrl);
  }
  
  // Agregar imágenes de galería
  const galleryUrls = getGalleryUrls(gallery);
  galleryUrls.forEach(url => {
    if (!images.includes(url)) {
      images.push(url);
    }
  });
  
  return images;
};

/**
 * Valida si una URL de imagen es válida
 * @param {string} url - URL a validar
 * @returns {boolean} - true si la URL es válida
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Verificar que sea una URL válida
  try {
    new URL(url);
    return true;
  } catch {
    // Si no es una URL absoluta, verificar que sea una ruta relativa válida
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};

/**
 * Obtiene la URL de imagen con fallback a placeholder
 * @param {string|object} imageData - Datos de la imagen
 * @param {string} placeholder - URL del placeholder (default: "/placeholder.svg")
 * @returns {string} - URL de la imagen o placeholder
 */
export const getImageUrlWithFallback = (imageData, placeholder = "/placeholder.svg") => {
  const url = getImageUrl(imageData);
  return url || placeholder;
};

