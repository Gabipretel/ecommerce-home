import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';

const CategoryFilters = ({ onFilterChange, loading, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    nombre: currentFilters.nombre || '',
    activo: currentFilters.activo || '',
    orderBy: currentFilters.orderBy || 'nombre',
    orderDirection: currentFilters.orderDirection || 'ASC',
    limit: currentFilters.limit || '10',
    ...currentFilters
  });


  const debouncedNombre = useDebounce(filters.nombre, 1000);

  const handleFilterChange = (key, value) => {
    const newFilters = { 
      ...filters, 
      [key]: value,
      offset: key !== 'offset' ? 0 : value 
    };
    setFilters(newFilters);
    
    if (key !== 'nombre') {
      onFilterChange(newFilters);
    }
  };

  useEffect(() => {
    const newFilters = {
      ...filters,
      nombre: debouncedNombre,
      offset: 0
    };
    onFilterChange(newFilters);
  }, [debouncedNombre]);

  const clearFilters = () => {
    const clearedFilters = {
      nombre: '',
      activo: '',
      orderBy: 'nombre',
      orderDirection: 'ASC',
      limit: '10',
      offset: 0
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.nombre || filters.activo;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros de Búsqueda</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={loading}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Búsqueda por nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de Categoría
          </label>
          <input
            type="text"
            id="nombre"
            placeholder="Buscar por nombre..."
            value={filters.nombre}
            onChange={(e) => handleFilterChange('nombre', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <label htmlFor="activo" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="activo"
            value={filters.activo}
            onChange={(e) => handleFilterChange('activo', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label htmlFor="orderBy" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="orderBy"
            value={filters.orderBy}
            onChange={(e) => handleFilterChange('orderBy', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="nombre">Nombre</option>
            <option value="id">ID</option>
            <option value="activo">Estado</option>
          </select>
        </div>

        {/* Resultados por página */}
        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
            Por página
          </label>
          <select
            id="limit"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Dirección del orden */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="orderDirection" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <select
            id="orderDirection"
            value={filters.orderDirection}
            onChange={(e) => handleFilterChange('orderDirection', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="ASC">Ascendente</option>
            <option value="DESC">Descendente</option>
          </select>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span className="text-sm text-blue-800">
              Filtros aplicados: {
                [
                  filters.nombre && `Nombre: "${filters.nombre}"`,
                  filters.activo && `Estado: ${filters.activo === 'true' ? 'Activa' : 'Inactiva'}`
                ].filter(Boolean).join(', ')
              }
            </span>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Nota sobre las categorías:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Las categorías activas aparecen en la tienda online</li>
              <li>Las categorías inactivas no son visibles para los clientes</li>
              <li>No se pueden eliminar categorías que tengan productos asociados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;


