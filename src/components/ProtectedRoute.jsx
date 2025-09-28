import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import authService from '../services/authService'

// Componente para proteger rutas de autenticación cuando el usuario ya está logueado
const AuthProtectedRoute = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated()
    const userType = authService.getUserType()
    
    if (isAuthenticated) {
      // Si el usuario ya está autenticado, redirigir según su tipo
      if (userType === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [navigate])

  // Si no está autenticado, mostrar el componente hijo (login/register)
  if (!authService.isAuthenticated()) {
    return children
  }

  // Si está autenticado, no mostrar nada (se redirigirá)
  return null
}

// Componente para proteger rutas de admin
const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated()
    const userType = authService.getUserType()
    
    if (!isAuthenticated) {
      navigate('/login-admin', { replace: true })
    } else if (userType !== 'admin') {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const isAuthenticated = authService.isAuthenticated()
  const userType = authService.getUserType()

  if (isAuthenticated && userType === 'admin') {
    return children
  }

  return null
}

// Componente para proteger rutas de usuario
const UserProtectedRoute = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated()
    
    if (!isAuthenticated) {
      navigate('/login-user', { replace: true })
    }
  }, [navigate])

  if (authService.isAuthenticated()) {
    return children
  }

  return null
}

export { AuthProtectedRoute, AdminProtectedRoute, UserProtectedRoute }
