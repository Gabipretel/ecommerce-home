import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'
import { signInWithGoogle, logoutFirebase } from '../firebase/services'
import api from '../services/api'

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

  const sendWelcomeEmail = async (userEmail, userName) => {
    try {
      // Formatea el template HTML con los datos del usuario
      const emailTemplate = `<!DOCTYPE html>\n<html lang=\"es\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>¡Bienvenido a Gamer Once, Gamer Always!</title>\n    <style>\n      body {\n        font-family: 'Segoe UI', Roboto, Arial, sans-serif;\n        margin: 0;\n        padding: 0;\n        background: linear-gradient(135deg, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1);\n        color: #333;\n      }\n\n      .container {\n        max-width: 600px;\n        background: #fff;\n        margin: 50px auto;\n        padding: 30px 40px;\n        border-radius: 12px;\n        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      }\n\n      h2 {\n        color: #9a4dcf;\n        margin-bottom: 10px;\n      }\n\n      p {\n        font-size: 16px;\n        line-height: 1.6;\n        color: #444;\n      }\n\n      .highlight {\n        color: #9a4dcf;\n        font-weight: bold;\n      }\n\n      .footer {\n        text-align: center;\n        margin-top: 30px;\n        font-size: 14px;\n        color: #666;\n      }\n\n      .brand {\n        text-align: center;\n        margin-top: 20px;\n        font-size: 18px;\n        font-weight: bold;\n        color: #9a4dcf;\n      }\n\n      hr {\n        border: none;\n        border-top: 1px solid #ddd;\n        margin: 20px 0;\n      }\n\n      .button {\n        display: inline-block;\n        padding: 12px 24px;\n        background: linear-gradient(90deg, #ba83ca, #9a9ae1);\n        color: white;\n        text-decoration: none;\n        border-radius: 8px;\n        font-weight: bold;\n        margin-top: 15px;\n        transition: opacity 0.3s ease;\n      }\n\n      .button:hover {\n        opacity: 0.9;\n      }\n    </style>\n  </head>\n\n  <body>\n    <div class=\"container\">\n      <h2>¡Bienvenido a la comunidad Gamer!</h2>\n      <p>\n        Hola <strong>${userName}</strong>, gracias por registrarte en \n        <span class=\"highlight\">Gamer Once, Gamer Always</span>. 🎮  \n        Ya sos parte de una comunidad que vive y disfruta del gaming como vos.\n      </p>\n\n      <p>\n        Desde ahora vas a poder acceder a ofertas exclusivas, lanzamientos y novedades de productos gamer.\n      </p>\n\n      <p>\n        Te damos la bienvenida con todo nuestro entusiasmo 💜  \n        ¡Estamos felices de tenerte con nosotros!\n      </p>\n\n      <hr />\n\n      <p>📅 Fecha de registro: ${new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>\n\n      <div style=\"text-align: center;\">\n        <a href=\"http://localhost:5173/\" class=\"button\">Visitar Tienda</a>\n      </div>\n\n      <div class=\"footer\">\n        <p>Gracias por elegirnos 💜</p>\n        <div class=\"brand\">Gamer Once, Gamer Always</div>\n      </div>\n    </div>\n  </body>\n</html>`

      const emailData = {
        to: userEmail,
        subject: '¡Bienvenido a Gamer Once, Gamer Always! 🎮',
        html: emailTemplate
      }

      await api.post('/email', emailData)
    } catch (error) {
      console.log('Error al enviar email:', error)
    }
  }

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
      console.log('Error en login:', error)
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
      console.log('Error en login admin:', error)
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
        await sendWelcomeEmail(result.user.email, result.user.nombre)
      }
      return result
    } catch (error) {
      console.log('Error en registro:', error)
      return { success: false, message: 'Error al registrar usuario' }
    }
  }

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle()
      console.log(result,JSON.stringify(result))
      if (result.success) {
        // Verificar si es un usuario nuevo (no existe en localStorage)
        const existingGoogleUser = localStorage.getItem('googleUser')
        const isNewUser = !existingGoogleUser
        
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
        
        // Enviar email de bienvenida solo si es un nuevo usuario
        if (isNewUser) {
          await sendWelcomeEmail(result.user.email, result.user.nombre)
        }
      }
      return result
    } catch (error) {
      console.log('Error en login con Google:', error)
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
