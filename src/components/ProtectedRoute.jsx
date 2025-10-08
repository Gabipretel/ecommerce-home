import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

// Componente para proteger rutas de autenticación cuando el usuario ya está logueado
const AuthProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { isAuthenticated, userType, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Si el usuario ya está autenticado, redirigir según su tipo
      if (userType === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, userType, loading, navigate])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  // Si no está autenticado, mostrar el componente hijo (login/register)
  if (!isAuthenticated) {
    return children
  }

  // Si está autenticado, no mostrar nada (se redirigirá)
  return null
}

// Componente para proteger rutas de admin
const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { isAuthenticated, userType, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login-admin', { replace: true })
      } else if (userType !== 'admin') {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, userType, loading, navigate])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (isAuthenticated && userType === 'admin') {
    return children
  }

  return null
}

// Componente para proteger rutas de usuario
const UserProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login-user', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return children
  }

  return null
}

export { AuthProtectedRoute, AdminProtectedRoute, UserProtectedRoute }

