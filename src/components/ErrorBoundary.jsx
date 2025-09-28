import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Guarda los detalles del error
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto bg-slate-800/50 border border-red-500/20 backdrop-blur-sm rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              ¡Oops! Algo salió mal
            </h2>
            <p className="text-slate-300 mb-4">
              Ha ocurrido un error inesperado. Por favor, recarga la página.
            </p>
            <details className="text-left text-sm text-slate-400 mb-4">
              <summary className="cursor-pointer hover:text-slate-300">
                Detalles del error
              </summary>
              <pre className="mt-2 p-2 bg-slate-900/50 rounded text-xs overflow-auto">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Recargar Página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
