import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../services/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalProductos: 0,
    productosActivos: 0,
    totalCategorias: 0,
    categoriasActivas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [usuariosTotal, usuariosActivos, productosTotal, productosActivos, categoriasTotal, categoriasActivas] = await Promise.all([
          adminApi.getUsuarios({ limit: 1 }),
          adminApi.getUsuarios({ activo: true, limit: 1 }),
          adminApi.getProductos({ limit: 1 }),
          adminApi.getProductos({ activo: true, limit: 1 }),
          adminApi.getCategorias({ limit: 1 }),
          adminApi.getCategorias({ activo: true, limit: 1 })
        ]);

        setStats({
          totalUsuarios: usuariosTotal.pagination?.total || 0,
          usuariosActivos: usuariosActivos.pagination?.total || 0,
          totalProductos: productosTotal.pagination?.total || 0,
          productosActivos: productosActivos.pagination?.total || 0,
          totalCategorias: categoriasTotal.pagination?.total || 0,
          categoriasActivas: categoriasActivas.pagination?.total || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Usuarios Totales',
      value: stats.totalUsuarios,
      subtitle: `${stats.usuariosActivos} activos`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Productos Totales',
      value: stats.totalProductos,
      subtitle: `${stats.productosActivos} activos`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'green'
    },
    {
      title: 'Categorías Totales',
      value: stats.totalCategorias,
      subtitle: `${stats.categoriasActivas} activas`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-600 border-purple-200',
      green: 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200',
      purple: 'bg-gradient-to-br from-pink-50 to-purple-50 text-pink-600 border-pink-200'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl p-6 text-white shadow-strong">
          <h1 className="text-2xl font-bold">¡Bienvenido al Panel de Administración!</h1>
          <p className="mt-2 opacity-90">
            Gestiona tu ecommerce de forma simple y eficiente
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 ${getColorClasses(card.color)} transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                  <p className="text-sm opacity-60 mt-1">{card.subtitle}</p>
                </div>
                <div className="opacity-75">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-purple-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/usuarios'}
              className="group p-6 border-2 border-dashed border-purple-200 rounded-lg hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto text-purple-300 group-hover:text-purple-500 mb-2 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-200">Nuevo Usuario</p>
              </div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/admin/productos'}
              className="group p-6 border-2 border-dashed border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto text-emerald-300 group-hover:text-emerald-500 mb-2 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition-colors duration-200">Nuevo Producto</p>
              </div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/admin/categorias'}
              className="group p-6 border-2 border-dashed border-pink-200 rounded-lg hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto text-pink-300 group-hover:text-pink-500 mb-2 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm font-medium text-gray-600 group-hover:text-pink-600 transition-colors duration-200">Nueva Categoría</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
