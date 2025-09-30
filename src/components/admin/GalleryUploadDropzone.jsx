import React, { useState, useCallback } from 'react';

const GalleryUploadDropzone = ({ 
  onImagesUploaded, 
  existingImages = [], 
  disabled = false,
  maxImages = 10 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(existingImages);
  const [error, setError] = useState('');

  // Configuración de validación
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const validateMultipleFiles = (files) => {
    const errors = [];
    const validFiles = [];
    
    if (files.length > maxImages) {
      errors.push(`Máximo ${maxImages} imágenes permitidas.`);
    }
    
    Array.from(files).forEach((file, index) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`Imagen ${index + 1}: Formato no soportado. Use JPG, PNG, GIF o WebP.`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`Imagen ${index + 1}: Archivo demasiado grande. Máximo 5MB.`);
      } else {
        validFiles.push(file);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      validFiles
    };
  };

  const uploadImages = async (files) => {
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('imagenes', file);
      });
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3000/api/productos/upload/galeria', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al subir imágenes');
      }
      
      const data = await response.json();
      
      // Crear objetos de imagen con preview y datos de Cloudinary
      const newImages = data.data.map((img, index) => ({
        url: img.url,
        public_id: img.public_id,
        preview: URL.createObjectURL(files[index])
      }));
      
      // Actualizar estado local
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      
      // Notificar al componente padre
      const imageUrls = updatedImages.map(img => img.url);
      onImagesUploaded(imageUrls, updatedImages.map(img => img.public_id));
      
      return data.data;
    } catch (error) {
      setError('Error al subir imágenes: ' + error.message);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = images[index];
    
    try {
      // Llamar al endpoint para eliminar la imagen de Cloudinary
      if (imageToRemove.public_id) {
        const token = localStorage.getItem('accessToken');
        await fetch(`http://localhost:3000/api/productos/imagen/${imageToRemove.public_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
      }
      
      // Actualizar estado local
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      
      // Revocar URL del preview si existe
      if (imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      
      // Notificar al componente padre
      const imageUrls = updatedImages.map(img => img.url);
      onImagesUploaded(imageUrls, updatedImages.map(img => img.public_id));
      
    } catch (error) {
      setError('Error al eliminar imagen: ' + error.message);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    const validation = validateMultipleFiles(files);
    if (!validation.isValid) {
      setError(validation.errors.join('\n'));
      return;
    }
    
    // Verificar límite total
    if (images.length + validation.validFiles.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes en la galería. Actualmente tienes ${images.length}.`);
      return;
    }
    
    try {
      await uploadImages(validation.validFiles);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  }, [disabled, images.length, maxImages]);

  const handleFileSelect = useCallback(async (e) => {
    const files = e.target.files;
    if (files.length === 0 || disabled) return;
    
    const validation = validateMultipleFiles(files);
    if (!validation.isValid) {
      setError(validation.errors.join('\n'));
      return;
    }
    
    if (images.length + validation.validFiles.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes en la galería. Actualmente tienes ${images.length}.`);
      return;
    }
    
    try {
      await uploadImages(validation.validFiles);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
    
    // Limpiar el input
    e.target.value = '';
  }, [disabled, images.length, maxImages]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Galería de Imágenes (Opcional)
      </label>
      
      {/* Zona de drop para nuevas imágenes */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
          dragOver && !disabled
            ? 'border-blue-400 bg-blue-50' 
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600 text-sm">Subiendo imágenes...</p>
          </div>
        ) : (
          <div className="py-4">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-gray-600 text-sm mb-1">
              Arrastra múltiples imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-400 mb-2">
              Máximo {maxImages} imágenes ({images.length}/{maxImages})
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={disabled || images.length >= maxImages}
              className="hidden"
              id="gallery-upload-input"
            />
            <button
              type="button"
              onClick={() => document.getElementById('gallery-upload-input').click()}
              disabled={disabled || images.length >= maxImages}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Seleccionar Imágenes
            </button>
          </div>
        )}
      </div>

      {/* Preview de imágenes existentes */}
      {images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Imágenes de la galería ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview || image.url}
                  alt={`Galería ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
          {error.split('\n').map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryUploadDropzone;
