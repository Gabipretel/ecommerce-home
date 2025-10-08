import { useNavigate } from "react-router"
import { Button } from "../components/ui/button"
import {
  Gamepad2,
  Home
} from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Gaming Icon */}
        <div className="relative mb-8">
          <div className="relative inline-block">
            <Gamepad2 className="w-32 h-32 text-purple-400 mx-auto animate-pulse" />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¡Oops GAME OVER!
          </h2>
          <p className="text-xl text-slate-300 mb-2">
            La página que buscas no existe o ha sido movida
          </p>
          <p className="text-lg text-slate-400">
            Verifica la URL o regresa al inicio
          </p>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-center">
          <Button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Ir al Inicio
          </Button>
        </div>

        {/* Footer branding */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-2 text-slate-500">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm">GG Store - Gamer once, Gamer always</span>
          </div>
        </div>
      </div>
    </div>
  )
}
