import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryFilters from '../../components/admin/CategoryFilters';
import CategoryForm from '../../components/admin/CategoryForm';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Toast from '../../components/admin/Toast';
import useCrud from '../../hooks/useCrud';
import useToast from '../../hooks/useToast';

const CategoryManagement = () => {
  const {
    data: categorias,
    loading,
    error,
    pagination,
    filters,
    createItem,
    updateItem,
    deleteItem,
    handleFilterChange,
    handlePageChange,
    fetchData,
    getById
  } = useCrud('categorias');

  const { toast, showSuccess, showError, hideToast } = useToast();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (categoryData) => {
    try {
      await createItem(categoryData);
      setShowCreateModal(false);
      showSuccess('Categoría creada exitosamente');
    } catch (error) {
      showError('Error al crear categoría: ' + error.message);
    }
  };

  const handleEditCategory = async (id) => {
    try {
      const category = await getById(id);
      setSelectedCategory(category);
      setShowEditModal(true);
    } catch (error) {
      showError('Error al cargar categoría: ' + error.message);
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      await updateItem(selectedCategory.id, categoryData);
      setShowEditModal(false);
      setSelectedCategory(null);
      showSuccess('Categoría actualizada exitosamente');
    } catch (error) {
      showError('Error al actualizar categoría: ' + error.message);
    }
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      await deleteItem(selectedCategory.id, false);
      setShowDeleteDialog(false);
      setSelectedCategory(null);
      showSuccess('Categoría desactivada exitosamente');
    } catch (error) {
      showError('Error al desactivar categoría: ' + error.message);
    }
  };

  const getStatusBadge = (activo) => {
    return activo ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Activa
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactiva
      </span>
    );
  };

  const getCategoryIcon = (nombre) => {
    // TODO: Agregar iconos para las categorias al crearlas.
    const iconMap = {
      'electronico': '',
      'ropa': '',
      'hogar': '',
      'deportes': '',
      'libros': '',
      'juguetes': '',
      'salud': '',
      'cocina': '',
      'automovil': '',
      'musica': ''
    };

    const key = nombre.toLowerCase();
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (key.includes(keyword)) {
        return icon;
      }
    }
    return ''
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header con botón para crear categoría */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
            <p className="text-gray-600">Administra las categorías de productos</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Categoría
          </button>
        </div>

        {/* Filtros */}
        <CategoryFilters 
          onFilterChange={handleFilterChange}
          loading={loading}
          currentFilters={filters}
        />

        {/* Error Mensaje */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Categorías */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando categorías...</span>
            </div>
          ) : categorias.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hay categorías</h3>
              <p className="text-gray-500">No se encontraron categorías con los filtros aplicados.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Crear primera categoría
              </button>
            </div>
          ) : (
            <>
              {/* Mapeo de Categorías */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categorias.map((categoria) => (
                    <div
                      key={categoria.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      {/* Header de la tarjeta */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl">
                          {getCategoryIcon(categoria.nombre)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(categoria.activo)}
                          <span className="text-xs text-gray-500">ID: {categoria.id}</span>
                        </div>
                      </div>

                      {/* Contenido de la tarjeta */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          {categoria.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {categoria.descripcion || 'Sin descripción disponible'}
                        </p>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Admin ID: {categoria.id_administrador}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditCategory(categoria.id)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar categoría"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(categoria)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Desactivar categoría"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paginación */}
              {pagination && pagination.total > pagination.limit && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                      disabled={pagination.offset === 0}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                      disabled={pagination.offset + pagination.limit >= pagination.total}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">{pagination.offset + 1}</span>
                        {' '}a{' '}
                        <span className="font-medium">
                          {Math.min(pagination.offset + pagination.limit, pagination.total)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{pagination.total}</span>
                        {' '}resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                          disabled={pagination.offset === 0}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Anterior</span>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                          disabled={pagination.offset + pagination.limit >= pagination.total}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Siguiente</span>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal para crear categoría */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear Nueva Categoría"
          size="lg"
        >
          <CategoryForm
            onSubmit={handleCreateCategory}
            onCancel={() => setShowCreateModal(false)}
            loading={loading}
          />
        </Modal>

        {/* Modal para editar categoría */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCategory(null);
          }}
          title="Editar Categoría"
          size="lg"
        >
          <CategoryForm
            category={selectedCategory}
            onSubmit={handleUpdateCategory}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
            }}
            loading={loading}
          />
        </Modal>

        {/* Mensaje de confirmación para desactivar */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedCategory(null);
          }}
          onConfirm={confirmDeleteCategory}
          title="Desactivar Categoría"
          message={`¿Estás seguro de que deseas desactivar la categoría "${selectedCategory?.nombre}"? La categoría no será visible para los clientes, pero se mantendrán sus productos asociados.`}
          confirmText="Desactivar"
          type="warning"
        />

        {/* Toasts para mostrar... */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
          duration={toast.duration}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;
