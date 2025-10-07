import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import ImageUploadDropzone from './ImageUploadDropzone';
import GalleryUploadDropzone from './GalleryUploadDropzone';

const ProductForm = ({ product = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    id_categoria: '',
    id_marca: '',
    id_administrador: 1, // Dejamos este id de administrador por defecto, pero va a cambiar de acuerdo al admin logeado 
    nombre: '',
    descripcion: '',
    sku: '',
    precio: '',
    stock: '',
    imagen_principal: { url: '', public_id: '' },
    galeria_imagenes: [],
    destacado: false,
    activo: true
  });
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [categoriasResponse, marcasResponse] = await Promise.all([
          adminApi.getCategorias({ activo: true, limit: 100 }),
          adminApi.getMarcas()
        ]);
        
        setCategorias(categoriasResponse.data || []);
        setMarcas(marcasResponse.data || []);
      } catch (error) {
        console.log('Error loading options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        id_categoria: product.id_categoria || '',
        id_marca: product.id_marca || '',
        id_administrador: product.id_administrador || 1,
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        sku: product.sku || '',
        precio: product.precio || '',
        stock: product.stock || '',
        imagen_principal: {
          url: product.imagen_principal?.url || product.imagen_url || '', 
          public_id: product.imagen_principal?.public_id || product.imagen_public_id || ''
        },
        galeria_imagenes: Array.isArray(product.galeria_imagenes) 
          ? product.galeria_imagenes.map(img => 
              typeof img === 'string' 
                ? { url: img, public_id: '' } 
                : { url: img.url || img, public_id: img.public_id || '' }
            ) 
          : [],
        destacado: product.destacado || false,
        activo: product.activo !== undefined ? product.activo : true
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es obligatorio';
    }

    if (!formData.precio) {
      newErrors.precio = 'El precio es obligatorio';
    } else if (isNaN(formData.precio) || parseFloat(formData.precio) < 0) {
      newErrors.precio = 'El precio debe ser un número válido';
    }

    if (!formData.id_categoria) {
      newErrors.id_categoria = 'La categoría es obligatoria';
    }

    if (!formData.id_marca) {
      newErrors.id_marca = 'La marca es obligatoria';
    }

    if (formData.stock && (isNaN(formData.stock) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'El stock debe ser un número válido';
    }

    if (!formData.imagen_principal.url.trim()) {
      newErrors.imagen_principal = 'La imagen principal es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        id_categoria: parseInt(formData.id_categoria),
        id_marca: parseInt(formData.id_marca),
        id_administrador: parseInt(formData.id_administrador),
        imagen_principal: formData.imagen_principal,
        galeria_imagenes: formData.galeria_imagenes
      };
      onSubmit(submitData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar la subida de imagen principal
  const handleImageUploaded = (imageUrl, publicId) => {
    setFormData(prev => ({
      ...prev,
      imagen_principal: {
        url: imageUrl,
        public_id: publicId
      }
    }));
    
    // Limpiar error de imagen si existe
    if (errors.imagen_principal) {
      setErrors(prev => ({
        ...prev,
        imagen_principal: ''
      }));
    }
  };

  // Manejar la subida de imágenes de galería
  const handleGalleryImagesUploaded = (imageUrls, publicIds) => {
    const galeriaImagenes = imageUrls.map((url, index) => ({
      url: url,
      public_id: publicIds[index] || ''
    }));
    
    setFormData(prev => ({
      ...prev,
      galeria_imagenes: galeriaImagenes
    }));
  };

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando opciones...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: iPhone 15 Pro Max"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
            SKU *
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sku ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: IPH15PM001"
          />
          {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
            Precio *
          </label>
          <input
            type="number"
            step="0.01"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.precio ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <select
            id="id_categoria"
            name="id_categoria"
            value={formData.id_categoria}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.id_categoria ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {errors.id_categoria && <p className="text-red-500 text-xs mt-1">{errors.id_categoria}</p>}
        </div>

        {/* Marca */}
        <div>
          <label htmlFor="id_marca" className="block text-sm font-medium text-gray-700 mb-1">
            Marca *
          </label>
          <select
            id="id_marca"
            name="id_marca"
            value={formData.id_marca}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.id_marca ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona una marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
          {errors.id_marca && <p className="text-red-500 text-xs mt-1">{errors.id_marca}</p>}
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descripción detallada del producto..."
        />
      </div>

      {/* Imagen Principal */}
      <div>
        <ImageUploadDropzone
          onImageUploaded={handleImageUploaded}
          existingImageUrl={formData.imagen_principal.url}
          existingPublicId={formData.imagen_principal.public_id}
          disabled={loading}
          label="Imagen Principal"
        />
        {errors.imagen_principal && <p className="text-red-500 text-xs mt-1">{errors.imagen_principal}</p>}
      </div>

      {/* Galería de Imágenes */}
      <div>
        <GalleryUploadDropzone
          onImagesUploaded={handleGalleryImagesUploaded}
          existingImages={formData.galeria_imagenes.map(img => ({ 
            url: img.url || img, 
            public_id: img.public_id || '',
            preview: img.url || img 
          }))}
          disabled={loading}
          maxImages={10}
        />
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="destacado"
            name="destacado"
            checked={formData.destacado}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="destacado" className="ml-2 block text-sm text-gray-900">
            Producto destacado
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="activo"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
            Producto activo
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </div>
          ) : (
            product ? 'Actualizar Producto' : 'Crear Producto'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;


