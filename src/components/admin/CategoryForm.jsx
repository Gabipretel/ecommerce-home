import React, { useState, useEffect } from 'react';

const CategoryForm = ({ category = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    id_administrador: 1,
    nombre: '',
    descripcion: '',
    activo: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        id_administrador: category.id_administrador || 1,
        nombre: category.nombre || '',
        descripcion: category.descripcion || '',
        activo: category.activo !== undefined ? category.activo : true
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        id_administrador: parseInt(formData.id_administrador)
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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Categoría *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.nombre ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Electrónicos, Ropa, Hogar..."
        />
        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          placeholder="Describe qué tipo de productos incluye esta categoría..."
        />
        <p className="text-sm text-gray-500 mt-1">
          La descripción ayuda a los usuarios a entender qué productos encontrarán en esta categoría.
        </p>
      </div>

      {/* Estado Activo */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="activo"
          name="activo"
          checked={formData.activo}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div>
          <label htmlFor="activo" className="text-sm font-medium text-gray-900">
            Categoría activa
          </label>
          <p className="text-sm text-gray-500">
            Las categorías inactivas no serán visibles para los clientes
          </p>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {formData.nombre || 'Nombre de la categoría'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {formData.descripcion || 'Descripción de la categoría'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                formData.activo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.activo ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </div>
          ) : (
            category ? 'Actualizar Categoría' : 'Crear Categoría'
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;


