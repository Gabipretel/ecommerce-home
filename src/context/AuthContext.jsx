import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'
import { signInWithGoogle, logoutFirebase } from '../firebase/services'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      const type = authService.getUserType()
      const currentUser = authService.getCurrentUser()

      setIsAuthenticated(authenticated)
      setUserType(type)
      setUser(currentUser)
      setLoading(false)
    }

    checkAuth()

    // Escuchar cambios en localStorage (para múltiples pestañas)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Login tradicional de usuario
  const loginUser = async (email, password) => {
    try {
      const result = await authService.loginUser(email, password)
      if (result.success) {
        setIsAuthenticated(true)
        setUserType('user')
        setUser(result.user)
      }
      return result
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, message: 'Error al iniciar sesión' }
    }
  }

  // Login tradicional de admin
  const loginAdmin = async (email, password) => {
    try {
      const result = await authService.loginAdmin(email, password)
      if (result.success) {
        setIsAuthenticated(true)
        setUserType('admin')
        setUser(result.admin)
      }
      return result
    } catch (error) {
      console.error('Error en login admin:', error)
      return { success: false, message: 'Error al iniciar sesión' }
    }
  }

  // Registro tradicional de usuario
  const registerUser = async (userData) => {
    try {
      const result = await authService.registerUser(userData)
      if (result.success) {
        setIsAuthenticated(true)
        setUserType('user')
        setUser(result.user)
      }
      return result
    } catch (error) {
      console.error('Error en registro:', error)
      return { success: false, message: 'Error al registrar usuario' }
    }
  }

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle()
      if (result.success) {
        // Guardar información del usuario de Google en localStorage
        // Simular el mismo formato que el login tradicional
        const googleToken = `google_${result.user.uid}_${Date.now()}`
        
        localStorage.setItem('accessToken', googleToken)
        localStorage.setItem('userType', 'user')
        localStorage.setItem('googleUser', JSON.stringify(result.user))
        
        setIsAuthenticated(true)
        setUserType('user')
        setUser({
          id: result.user.uid,
          email: result.user.email,
          nombre: result.user.nombre,
          apellido: result.user.apellido,
          photoURL: result.user.photoURL,
          provider: 'google'
        })
      }
      return result
    } catch (error) {
      console.error('Error en login con Google:', error)
      return { success: false, message: 'Error al iniciar sesión con Google' }
    }
  }

  // Logout
  const logout = async () => {
    try {
      // Si es usuario de Google, cerrar sesión en Firebase también
      const googleUser = localStorage.getItem('googleUser')
      if (googleUser) {
        await logoutFirebase()
        localStorage.removeItem('googleUser')
      }
      
      // Limpiar localStorage tradicional
      authService.logout()
      
      setIsAuthenticated(false)
      setUserType(null)
      setUser(null)
      
      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, message: 'Error al cerrar sesión' }
    }
  }

  // Verificar si es usuario de Google
  const isGoogleUser = () => {
    return !!localStorage.getItem('googleUser')
  }

  const value = {
    isAuthenticated,
    user,
    userType,
    loading,
    loginUser,
    loginAdmin,
    registerUser,
    loginWithGoogle,
    logout,
    isGoogleUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
