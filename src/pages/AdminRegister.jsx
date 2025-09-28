import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Gamepad2, Zap, Eye, EyeOff, Shield } from 'lucide-react'
import AuthModal from '../components/AuthModal'
import authService from '../services/authService'

const AdminRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'admin'
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '' })

  const validateForm = () => {
    const newErrors = {}

    // Valida los campos requeridos
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    if (!formData.password) newErrors.password = 'La contraseña es requerida'

    // Valida el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    // Valida la contraseña
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener mínimo 8 caracteres'
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener al menos una letra minúscula'
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener al menos una letra mayúscula'
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener al menos un número'
      } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener al menos un carácter especial'
      }
    }

    // Valida la confirmacion de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    // Valida el rol
    if (!['admin', 'superadmin'].includes(formData.rol)) {
      newErrors.rol = 'El rol debe ser admin o superadmin'
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
      const result = await authService.registerAdmin({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        rol: formData.rol
      })

      if (result.success) {
        setModal({
          isOpen: true,
          type: 'success',
          title: '¡Administrador Creado!',
          message: 'El administrador ha sido registrado exitosamente.'
        })
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Error en el Registro',
          message: result.message || 'Hubo un problema al crear el administrador. Intenta nuevamente.'
        })
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error en el Registro',
        message: 'Error de conexión. Intenta nuevamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalAccept = () => {
    setModal({ isOpen: false, type: '', title: '', message: '' })
    if (modal.type === 'success') {
      navigate('/admin')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm rounded-lg">
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto flex items-center justify-center space-x-1">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-purple-400" />
                <Shield className="w-4 h-4 text-blue-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GG
                </h1>
                <p className="text-xs text-slate-400 -mt-1">Admin Panel</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold">Crear Administrador</h2>
              <p className="text-slate-300">Registra un nuevo administrador del sistema</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-slate-200 text-sm font-medium">
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 rounded-lg px-3 py-2 transition-colors"
                    placeholder="Nombre del admin"
                  />
                  {errors.nombre && <p className="text-red-400 text-sm">{errors.nombre}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="apellido" className="text-slate-200 text-sm font-medium">
                    Apellido *
                  </label>
                  <input
                    id="apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 rounded-lg px-3 py-2 transition-colors"
                    placeholder="Apellido del admin"
                  />
                  {errors.apellido && <p className="text-red-400 text-sm">{errors.apellido}</p>}
                </div>
              </div>

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
                  placeholder="admin@example.com"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="rol" className="text-slate-200 text-sm font-medium">
                  Rol *
                </label>
                <select
                  id="rol"
                  value={formData.rol}
                  onChange={(e) => handleInputChange('rol', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white focus:border-purple-400 rounded-lg px-3 py-2 transition-colors"
                >
                  <option value="admin">Administrador</option>
                  <option value="superadmin">Super Administrador</option>
                </select>
                {errors.rol && <p className="text-red-400 text-sm">{errors.rol}</p>}
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
                    placeholder="Ingresa la contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-slate-400 text-xs">
                  La contraseña debe tener mínimo 8 caracteres con mayúscula, minúscula, número y símbolo
                </p>
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-slate-200 text-sm font-medium">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 rounded-lg px-3 py-2 pr-10 transition-colors"
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-slate-400 text-xs">
                  Debe coincidir exactamente con la contraseña anterior
                </p>
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creando administrador...</span>
                  </div>
                ) : (
                  'Crear Administrador'
                )}
              </button>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  ¿Ya tienes cuenta de admin?{' '}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 font-medium"
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

export default AdminRegister
