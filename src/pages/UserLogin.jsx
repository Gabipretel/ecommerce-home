import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Gamepad2, Zap, Eye, EyeOff } from 'lucide-react'
import AuthModal from '../components/AuthModal'
import { useAuth } from '../context/AuthContext'

const UserLogin = () => {
  const navigate = useNavigate()
  const { loginUser, loginWithGoogle } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '' })

  const validateForm = () => {
    const newErrors = {}

    // Valida los campos requeridos
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    if (!formData.password) newErrors.password = 'La contraseña es requerida'

    // Valida el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpia el error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const result = await loginUser(formData.email, formData.password)

      if (result.success) {
        setModal({
          isOpen: true,
          type: 'success',
          title: '¡Bienvenido/a!',
          message: `Hola ${result.user.nombre}, un placer volverte a ver.`
        })
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Error en el Login',
          message: result.message || 'Credenciales incorrectas. Intenta nuevamente.'
        })
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error en el Login',
        message: 'Error de conexión. Intenta nuevamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    
    try {
      const result = await loginWithGoogle()
      
      if (result.success) {
        setModal({
          isOpen: true,
          type: 'success',
          title: '¡Bienvenido/a!',
          message: `Hola ${result.user.nombre}, bienvenido a GG.`
        })
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Error con Google',
          message: result.message || 'Error al iniciar sesión con Google.'
        })
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error con Google',
        message: 'Error de conexión con Google. Intenta nuevamente.'
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleModalAccept = () => {
    setModal({ isOpen: false, type: '', title: '', message: '' })
    if (modal.type === 'success') {
      navigate('/')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm rounded-lg">
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto flex items-center justify-center space-x-2">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-purple-400" />
                <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GG
                </h1>
                <p className="text-xs text-slate-400 -mt-1">Gamer once, Gamer always</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold">Iniciar Sesión</h2>
              <p className="text-slate-300">Accede a tu cuenta de usuario</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-slate-200 text-sm font-medium">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 rounded-lg px-3 py-2 transition-colors"
                  placeholder="gamer@example.com"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-slate-200 text-sm font-medium">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 rounded-lg px-3 py-2 pr-10 transition-colors"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>

              {/* Separador */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-slate-600"></div>
                <span className="px-3 text-slate-400 text-sm">o</span>
                <div className="flex-1 border-t border-slate-600"></div>
              </div>

              {/* Botón de Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isGoogleLoading}
                className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGoogleLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continuar con Google</span>
                  </>
                )}
              </button>

              <div className="text-center space-y-2">
                <p className="text-slate-400 text-sm">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 font-medium"
                    onClick={() => navigate('/register-user')}
                  >
                    Regístrate aquí
                  </button>
                </p>
                <p className="text-slate-400 text-sm">
                  ¿Eres administrador?{' '}
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                    onClick={() => navigate('/login-admin')}
                  >
                    Inicia sesión 
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onAccept={handleModalAccept}
      />
    </>
  )
}

export default UserLogin
