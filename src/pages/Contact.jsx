import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import api from "../services/api"
import {
  Gamepad2,
  Zap,
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  ArrowLeft,
  Smartphone
} from "lucide-react"

export default function Contact() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    consulta: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Formatear el template HTML con los datos del formulario
      const emailTemplate = `<!DOCTYPE html>\n<html lang=\"es\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>Gracias por tu consulta - Gamer Once, Gamer Always</title>\n    <style>\n      body {\n        font-family: 'Segoe UI', Roboto, Arial, sans-serif;\n        margin: 0;\n        padding: 0;\n        background: linear-gradient(135deg, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1);\n        color: #333;\n      }\n\n      .container {\n        max-width: 600px;\n        background: #fff;\n        margin: 50px auto;\n        padding: 30px 40px;\n        border-radius: 12px;\n        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      }\n\n      h2 {\n        color: #9a4dcf;\n        margin-bottom: 10px;\n      }\n\n      p {\n        font-size: 16px;\n        line-height: 1.6;\n        color: #444;\n      }\n\n      .footer {\n        text-align: center;\n        margin-top: 30px;\n        font-size: 14px;\n        color: #666;\n      }\n\n      .brand {\n        text-align: center;\n        margin-top: 20px;\n        font-size: 18px;\n        font-weight: bold;\n        color: #9a4dcf;\n      }\n\n      hr {\n        border: none;\n        border-top: 1px solid #ddd;\n        margin: 20px 0;\n      }\n    </style>\n  </head>\n\n  <body>\n    <div class=\"container\">\n      <h2>¡Gracias por tu consulta!</h2>\n      <p>\n        Hola <strong>${formData.nombre}</strong>, gracias por comunicarte con nosotros.\n        Tu mensaje fue recibido correctamente y uno de nuestros representantes se pondrá en contacto contigo a la brevedad.\n      </p>\n\n      <p><strong>Detalle de tu consulta:</strong></p>\n      <p><strong>Email:</strong> ${formData.email}</p>\n      <p><strong>Mensaje:</strong> ${formData.consulta}</p>\n\n      <hr />\n\n      <p>📅 Fecha de envío: ${new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>\n\n      <div class=\"footer\">\n        <p>Gracias por confiar en nosotros 💜</p>\n        <div class=\"brand\">Gamer Once, Gamer Always</div>\n      </div>\n    </div>\n  </body>\n</html>`

      const emailData = {
        to: formData.email,
        subject: 'Confirmación de consulta - Gamer Once, Gamer Always',
        html: emailTemplate
      }

      const response = await api.post('/email', emailData)
      
      if (response.data.success) {
        setSubmitMessage('¡Gracias por tu consulta! Te responderemos pronto. Revisa tu email para más detalles.')
        setFormData({ nombre: '', email: '', consulta: '' })
      } else {
        setSubmitMessage('Hubo un problema al enviar tu consulta. Intenta nuevamente.')
      }
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSubmitMessage(''), 3000)
    } catch (error) {
      setSubmitMessage('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-purple-400" />
                <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GG
                </h1>
                <p className="text-xs text-slate-400 -mt-1 hidden sm:block">Gamer once, Gamer always</p>
              </div>
            </div>

            {/* Back Button */}
            <Button 
              variant="ghost" 
              className="text-slate-300 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contáctanos
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para ayudarte con tu setup gaming perfecto.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 mt-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-3 text-purple-400" />
                  Envíanos tu consulta
                </h2>

                {submitMessage && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-400 text-center">{submitMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-slate-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="consulta" className="block text-sm font-medium text-slate-300 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Consulta
                    </label>
                    <textarea
                      id="consulta"
                      name="consulta"
                      value={formData.consulta}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar consulta
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 mt-4">
                  <h2 className="text-2xl font-bold text-white mb-6">Información de contacto</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Email</h3>
                        <p className="text-slate-300">info@gg-store.com</p>
                        <p className="text-slate-400 text-sm">Respuesta en 24 horas</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Teléfono</h3>
                        <p className="text-slate-300">+1 (555) 123-4567</p>
                        <p className="text-slate-400 text-sm">Lun-Vie 9AM-6PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <button onClick={() => window.open('https://wa.me/573178520111')} className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-6 h-6 text-white" />
                      </button>
                      <div onClick={() => window.open('https://wa.me/573178520111')}>
                        <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                        <p className="text-slate-300">+1 (555) 123-4567</p>
                        <p className="text-slate-400 text-sm">Lun-Vie 9AM-6PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Ubicación</h3>
                        <p className="text-slate-300">Siempre Viva 123</p>
                        <p className="text-slate-300">Santa Rosa, La Pampa</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
