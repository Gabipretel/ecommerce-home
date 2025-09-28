import React from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const AuthModal = ({ isOpen, onClose, type, title, message, onAccept }) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-400" />
      case 'error':
        return <XCircle className="w-8 h-8 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-8 h-8 text-yellow-400" />
      default:
        return <CheckCircle className="w-8 h-8 text-green-400" />
    }
  }

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20'
      case 'error':
        return 'bg-red-500/20'
      case 'warning':
        return 'bg-yellow-500/20'
      default:
        return 'bg-green-500/20'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800/90 border border-purple-500/20 backdrop-blur-sm rounded-lg p-6 w-full max-w-md">
        <div className="text-center space-y-4">
          <div className={`mx-auto w-16 h-16 ${getIconBg()} rounded-full flex items-center justify-center`}>
            {getIcon()}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-slate-300">{message}</p>
          </div>
          
          <button
            onClick={onAccept}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
