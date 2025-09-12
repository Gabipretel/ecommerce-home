import React from 'react';
import { Link, useLocation } from 'react-router';
import { useSidebar } from '../../context/SidebarContext';

const AdminLayout = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      label: 'Inicio',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      path: '/admin/usuarios',
      label: 'Usuarios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      path: '/admin/categorias',
      label: 'Categorías',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      path: '/admin/productos',
      label: 'Productos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white/90 backdrop-blur-lg shadow-xl border-r border-purple-100/50 transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-purple-200/30">
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Panel Admin</h1>
            <p className="text-sm text-purple-600">Sistema de gestión</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-purple-100 transition-all duration-200 transform hover:scale-105"
            title={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isSidebarOpen ? (
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActiveRoute(item.path)
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-r-4 border-purple-500'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
              title={!isSidebarOpen ? item.label : ""}
            >
              <span className={`${isActiveRoute(item.path) ? 'text-purple-700' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              <span className={`ml-3 ${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 px-2">
          <Link
            to="/"
            className="flex items-center px-4 py-3 mx-2 rounded-lg text-red-600 hover:bg-red-50/80 transition-colors"
            title={!isSidebarOpen ? "Cerrar Sesión" : ""}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`ml-3 ${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
              Cerrar Sesión
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 backdrop-blur-sm shadow-sm border-b border-purple-200/50 px-6 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-purple-600">admin@example.com</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
                <span className="text-white font-medium text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
