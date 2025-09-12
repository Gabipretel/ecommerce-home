import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import useDebounce from '../../hooks/useDebounce';

const ProductFilters = ({ onFilterChange, loading, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    nombre: currentFilters.nombre || '',
    activo: currentFilters.activo || '',
    destacado: currentFilters.destacado || '',
    id_categoria: currentFilters.id_categoria || '',
    id_marca: currentFilters.id_marca || '',
    orderBy: currentFilters.orderBy || 'createdAt',
    orderDirection: currentFilters.orderDirection || 'DESC',
    limit: currentFilters.limit || '10',
    ...currentFilters
  });

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);


  const debouncedNombre = useDebounce(filters.nombre, 1000);

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
      destacado: '',
      id_categoria: '',
      id_marca: '',
      orderBy: 'createdAt',
      orderDirection: 'DESC',
      limit: '10',
      offset: 0
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.nombre || filters.activo || filters.destacado || filters.id_categoria || filters.id_marca;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Búsqueda por nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto
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

        {/* Filtro por categoría */}
        <div>
          <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="id_categoria"
            value={filters.id_categoria}
            onChange={(e) => handleFilterChange('id_categoria', e.target.value)}
            disabled={loading || loadingOptions}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por marca */}
        <div>
          <label htmlFor="id_marca" className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select
            id="id_marca"
            value={filters.id_marca}
            onChange={(e) => handleFilterChange('id_marca', e.target.value)}
            disabled={loading || loadingOptions}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
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
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        {/* Filtro por destacado */}
        <div>
          <label htmlFor="destacado" className="block text-sm font-medium text-gray-700 mb-1">
            Destacado
          </label>
          <select
            id="destacado"
            value={filters.destacado}
            onChange={(e) => handleFilterChange('destacado', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">Todos</option>
            <option value="true">Destacados</option>
            <option value="false">No destacados</option>
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

      {/* Ordenamiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <option value="createdAt">Fecha de Creación</option>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio</option>
            <option value="stock">Stock</option>
            <option value="activo">Estado</option>
            <option value="destacado">Destacado</option>
            <option value="updatedAt">Última Modificación</option>
          </select>
        </div>

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
                  filters.id_categoria && `Categoría: ${categorias.find(c => c.id == filters.id_categoria)?.nombre}`,
                  filters.id_marca && `Marca: ${marcas.find(m => m.id == filters.id_marca)?.nombre}`,
                  filters.activo && `Estado: ${filters.activo === 'true' ? 'Activo' : 'Inactivo'}`,
                  filters.destacado && `Destacado: ${filters.destacado === 'true' ? 'Sí' : 'No'}`
                ].filter(Boolean).join(', ')
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;


