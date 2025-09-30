import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductFilters from '../../components/admin/ProductFilters';
import ProductForm from '../../components/admin/ProductForm';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Toast from '../../components/admin/Toast';
import useCrud from '../../hooks/useCrud';
import useToast from '../../hooks/useToast';
import { formatPrice } from '../../utils/priceFormatter';

const ProductManagement = () => {
  const {
    data: productos,
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
  } = useCrud('productos');

  const { toast, showSuccess, showError, hideToast } = useToast();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteType, setDeleteType] = useState('soft'); // 'soft' o 'permanent'

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (productData) => {
    try {
      await createItem(productData);
      setShowCreateModal(false);
      showSuccess('Producto creado exitosamente 🛍️');
    } catch (error) {
      showError('Error al crear producto: ' + error.message);
    }
  };

  const handleEditProduct = async (id) => {
    try {
      const product = await getById(id);
      setSelectedProduct(product);
      setShowEditModal(true);
    } catch (error) {
      showError('Error al cargar producto: ' + error.message);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await updateItem(selectedProduct.id, productData);
      setShowEditModal(false);
      setSelectedProduct(null);
      showSuccess('Producto actualizado exitosamente 🔄');
    } catch (error) {
      showError('Error al actualizar producto: ' + error.message);
    }
  };

  const handleDeleteProduct = (product, permanent = false) => {
    setSelectedProduct(product);
    setDeleteType(permanent ? 'permanent' : 'soft');
    setShowDeleteDialog(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteItem(selectedProduct.id, deleteType === 'permanent');
      setShowDeleteDialog(false);
      setSelectedProduct(null);
      showSuccess(deleteType === 'permanent' ? 'Producto eliminado permanentemente 🗑️' : 'Producto desactivado exitosamente ⚠️');
    } catch (error) {
      showError('Error al eliminar producto: ' + error.message);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (activo) => {
    return activo ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactivo
      </span>
    );
  };

  const getFeaturedBadge = (destacado) => {
    return destacado ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Destacado
      </span>
    ) : null;
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Sin stock
        </span>
      );
    } else if (stock < 10) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Stock bajo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        En stock
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header con botón para crear producto */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600">Administra el catálogo de productos</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        {/* Filtros */}
        <ProductFilters 
          onFilterChange={handleFilterChange}
          loading={loading}
          currentFilters={filters}
        />

        {/* Error Message */}
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

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando productos...</span>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hay productos</h3>
              <p className="text-gray-500">No se encontraron productos con los filtros aplicados.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU / Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría / Marca
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock / Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productos.map((producto) => (
                      <tr key={producto.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              {producto.imagen_url ? (
                                <img 
                                  className="h-16 w-16 rounded-lg object-cover" 
                                  src={producto.imagen_url} 
                                  alt={producto.nombre}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center ${producto.imagen_url ? 'hidden' : 'flex'}`}
                              >
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {producto.nombre}
                                {getFeaturedBadge(producto.destacado)}
                              </div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {producto.descripcion || 'Sin descripción'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{formatPrice(producto.precio)}</div>
                          <div className="text-sm text-gray-500">{producto.sku}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{producto.categoria?.nombre || 'Sin categoría'}</div>
                          <div className="text-sm text-gray-500">{producto.marca?.nombre || 'Sin marca'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <div className="text-sm text-gray-900">Stock: {producto.stock}</div>
                            <div className="flex space-x-1">
                              {getStockBadge(producto.stock)}
                              {getStatusBadge(producto.activo)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(producto.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditProduct(producto.id)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Editar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(producto, false)}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                              title="Desactivar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(producto, true)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Eliminar permanentemente"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {pagination && pagination.total > pagination.limit && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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

        {/* Modal para crear producto */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear Nuevo Producto"
          size="xl"
        >
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setShowCreateModal(false)}
            loading={loading}
          />
        </Modal>

        {/* Modal para editar producto */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          title="Editar Producto"
          size="xl"
        >
          <ProductForm
            product={selectedProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
            }}
            loading={loading}
          />
        </Modal>

        {/* Dialog de confirmación para eliminar */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedProduct(null);
          }}
          onConfirm={confirmDeleteProduct}
          title={deleteType === 'permanent' ? 'Eliminar Producto Permanentemente' : 'Desactivar Producto'}
          message={
            deleteType === 'permanent'
              ? `¿Estás seguro de que deseas eliminar permanentemente "${selectedProduct?.nombre}"? Esta acción no se puede deshacer.`
              : `¿Estás seguro de que deseas desactivar "${selectedProduct?.nombre}"? El producto no será visible para los clientes.`
          }
          confirmText={deleteType === 'permanent' ? 'Eliminar Permanentemente' : 'Desactivar'}
          type={deleteType === 'permanent' ? 'danger' : 'warning'}
        />

        {/* Toast Notifications */}
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

export default ProductManagement;
