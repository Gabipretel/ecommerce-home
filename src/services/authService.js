import api from './api'

class AuthService {
  // Helper para manejar errores de axios de manera consistente
  handleError(error) {
    console.error('Error en authService:', error)
    
    if (error.response) {
      const errorData = error.response.data
      return { 
        success: false, 
        message: errorData.message || 'Error en el servidor', 
        errors: errorData.errors 
      }
    } else if (error.request) {
      return { success: false, message: 'Error de conexión. Verifica tu internet.' }
    } else {
      return { success: false, message: 'Error inesperado. Intenta nuevamente.' }
    }
  }
  // Registro de usuario normal
  async registerUser(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      const data = response.data
      
      if (data.success) {
        // Guardar tokens en localStorage
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('userType', 'user')
        return { success: true, user: data.data.user }
      } else {
        return { success: false, message: data.message, errors: data.errors }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // Registro de administrador
  async registerAdmin(adminData) {
    try {
      const response = await api.post('/auth/register-admin', adminData)
      const data = response.data
      
      if (data.success) {
        return { success: true, admin: data.data.admin }
      } else {
        return { success: false, message: data.message, errors: data.errors }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // Login de usuario
  async loginUser(email, password) {
    try {
      const response = await api.post('/auth/login-user', { email, password })
      const data = response.data
      
      if (data.success) {
        // Guardar tokens en localStorage
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('userType', 'user')
        return { success: true, user: data.data.user }
      } else {
        return { success: false, message: data.message, errors: data.errors }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // Login de administrador
  async loginAdmin(email, password) {
    try {
      const response = await api.post('/auth/login-admin', { email, password })
      const data = response.data
      
      if (data.success) {
        // Guardar tokens en localStorage
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('userType', 'admin')
        return { success: true, admin: data.data.admin }
      } else {
        return { success: false, message: data.message, errors: data.errors }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // Renovar token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      const response = await api.post('/auth/refresh', { refreshToken })
      const data = response.data
      
      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        return true
      }
    } catch (error) {
      console.error('Error renovando token:', error)
      this.logout()
    }
    
    return false
  }

  // Logout
  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userType')
    localStorage.removeItem('googleUser')
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('accessToken')
  }

  // Obtener tipo de usuario
  getUserType() {
    return localStorage.getItem('userType')
  }

  // Obtener token
  getToken() {
    return localStorage.getItem('accessToken')
  }

  // Obtener información del usuario actual
  getCurrentUser() {
    const userType = this.getUserType()
    const token = this.getToken()
    
    if (!token || !userType) {
      return null
    }

    // Verificar si es usuario de Google
    const googleUser = localStorage.getItem('googleUser')
    if (googleUser && token.startsWith('google_')) {
      try {
        const parsedGoogleUser = JSON.parse(googleUser)
        return {
          id: parsedGoogleUser.uid,
          email: parsedGoogleUser.email,
          nombre: parsedGoogleUser.nombre,
          apellido: parsedGoogleUser.apellido,
          type: 'user',
          provider: 'google',
          photoURL: parsedGoogleUser.photoURL
        }
      } catch (error) {
        console.error('Error parseando usuario de Google:', error)
        return null
      }
    }

    try {
      // Decodificar el token JWT para obtener información del usuario
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        id: payload.id,
        email: payload.email,
        type: payload.type,
        rol: payload.rol
      }
    } catch (error) {
      console.error('Error decodificando token:', error)
      return null
    }
  }

  // Verificar si el usuario es administrador
  isAdmin() {
    return this.getUserType() === 'admin'
  }

  // Verificar si el usuario es superadministrador
  isSuperAdmin() {
    const user = this.getCurrentUser()
    return user && user.rol === 'superadmin'
  }

  // Verificar si el token está próximo a expirar (útil para mostrar advertencias)
  isTokenExpiringSoon() {
    const token = this.getToken()
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000 // Convertir a milisegundos
      const currentTime = Date.now()
      const timeUntilExpiry = expirationTime - currentTime
      
      // Considerar que está próximo a expirar si quedan menos de 5 minutos
      return timeUntilExpiry < 5 * 60 * 1000
    } catch (error) {
      console.error('Error verificando expiración del token:', error)
      return false
    }
  }
}

export default new AuthService()
