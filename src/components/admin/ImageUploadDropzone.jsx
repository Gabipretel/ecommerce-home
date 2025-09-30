import React, { useState, useCallback } from 'react';

const ImageUploadDropzone = ({ 
  onImageUploaded, 
  existingImageUrl = '', 
  disabled = false,
  label = "Imagen Principal"
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImageUrl);
  const [error, setError] = useState('');

  // Configuración de validación
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const validateImageFile = (file) => {
    const errors = [];
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push('Formato de archivo no soportado. Use JPG, PNG, GIF o WebP.');
    }
    
    if (file.size > MAX_FILE_SIZE) {
      errors.push('El archivo es demasiado grande. Máximo 5MB.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const uploadImage = async (file) => {
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3000/api/productos/upload/imagen-principal', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }
      
      const data = await response.json();
      const imageUrl = data.data.url;
      
      // Actualizar preview y notificar al componente padre
      setPreview(imageUrl);
      onImageUploaded(imageUrl, data.data.public_id);
      
      return data.data;
    } catch (error) {
      setError('Error al subir imagen: ' + error.message);
      throw error;
    } finally {
      setUploading(false);
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
    
    const file = files[0];
    const validation = validateImageFile(file);
    
    if (!validation.isValid) {
      setError(validation.errors.join('\n'));
      return;
    }
    
    try {
      await uploadImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [disabled]);

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file || disabled) return;
    
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.errors.join('\n'));
      return;
    }
    
    try {
      await uploadImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [disabled]);

  const removeImage = () => {
    setPreview('');
    setError('');
    onImageUploaded('', '');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
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
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Subiendo imagen...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              disabled={disabled}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="py-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 mb-2">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-400">
              JPG, PNG, GIF o WebP (máx. 5MB)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled}
              className="hidden"
              id="image-upload-input"
            />
            <button
              type="button"
              onClick={() => document.getElementById('image-upload-input').click()}
              disabled={disabled}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Seleccionar Imagen
            </button>
          </div>
        )}
      </div>

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

export default ImageUploadDropzone;
