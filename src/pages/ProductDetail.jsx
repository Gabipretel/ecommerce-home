"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Gamepad2,
  Zap,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Star,
  Heart,
  Share2,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import api from "../services/api"
import { useCupon } from "../context/CuponContext"
import CuponInput from "../components/CuponInput"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { cuponActivo, calcularPrecioConCupon } = useCupon()

  useEffect(() => {
    const getProducto = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/productos/${id}`)
        setProducto(response.data.data)
      } catch (error) {
        setError("Error al cargar el producto")
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      getProducto()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Producto no encontrado'}</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  const price = parseFloat(producto.precio) || 0
  const discount = producto.descuento || 0
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : price
  const precioConCupon = calcularPrecioConCupon(price)

  // Crear array de imágenes (por ahora solo una, pero preparado para múltiples)
  const images = producto.imagen_url ? [producto.imagen_url] : ["/placeholder.svg"]

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Sin Stock", color: "bg-red-600", textColor: "text-red-100" }
    if (stock <= 5) return { text: `Últimas ${stock} unidades`, color: "bg-orange-600", textColor: "text-orange-100" }
    return { text: "En Stock", color: "bg-green-600", textColor: "text-green-100" }
  }

  const stockStatus = getStockStatus(producto.stock || 0)

  // Características simuladas (se pueden agregar a la API después)
  const features = [
    "Garantía oficial",
    "Envío gratis",
    "Soporte técnico",
    "Calidad premium"
  ]

  const specifications = {
    "Marca": producto.marca?.nombre || 'Sin especificar',
    "Categoría": producto.categoria?.nombre || 'Sin especificar',
    "Stock": producto.stock || 0,
    "Estado": producto.activo ? 'Activo' : 'Inactivo'
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

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar productos, marcas o categorías..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <User className="w-4 h-4 mr-2" />
                {isLoggedIn ? "Mi Cuenta" : "Iniciar Sesión"}
              </Button>
              <Button variant="ghost" className="text-slate-300 hover:text-white relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
                <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs">3</Badge>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-slate-800/30 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-purple-400 p-0" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al catálogo
            </Button>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{producto.categoria?.nombre}</span>
            <span className="text-slate-500">/</span>
            <span className="text-purple-400">{producto.nombre}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            {/* Imagen Principal */}
            <div className="relative bg-slate-800/50 rounded-lg overflow-hidden">
              <img
                src={images[selectedImage] || "/placeholder.svg"}
                alt={producto.nombre}
                className="w-full h-96 object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-600 text-white text-lg px-3 py-1">
                  -{discount}%
                </Badge>
              )}

              {/* Navegación de imágenes */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-purple-400" : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${producto.nombre} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="space-y-6">
            {/* Header del producto */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  {producto.marca?.nombre || 'Sin marca'}
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  {producto.categoria?.nombre || 'Sin categoría'}
                </Badge>
                <Badge className={`${stockStatus.color} ${stockStatus.textColor}`}>
                  <Package className="w-3 h-3 mr-1" />
                  {stockStatus.text}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">{producto.nombre}</h1>
              <p className="text-slate-400 text-sm">ID: {producto.id}</p>

              {/* Rating simulado */}
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-semibold">4.0</span>
                <span className="text-slate-400">(Nuevo producto)</span>
              </div>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {cuponActivo && precioConCupon ? (
                  <>
                    <span className="text-4xl font-bold text-green-400">${precioConCupon.toFixed(2)}</span>
                    <span className="text-2xl text-slate-400 line-through">${price.toFixed(2)}</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-white">${price.toFixed(2)}</span>
                    {discount > 0 && (
                      <span className="text-2xl text-slate-400 line-through">${originalPrice.toFixed(2)}</span>
                    )}
                  </>
                )}
              </div>
              {cuponActivo && precioConCupon ? (
                <p className="text-green-400 font-semibold">
                  ¡Ahorras ${(price - precioConCupon).toFixed(2)} con cupón {cuponActivo.porcentajeDescuento}%!
                </p>
              ) : discount > 0 ? (
                <p className="text-green-400 font-semibold">
                  Ahorras ${(originalPrice - price).toFixed(2)} ({discount}% de descuento)
                </p>
              ) : null}
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Descripción</h3>
              <p className="text-slate-300 leading-relaxed">
                {producto.descripcion || 'Este producto de alta calidad está diseñado para satisfacer todas tus necesidades. Con tecnología de vanguardia y materiales premium, te garantizamos una experiencia excepcional.'}
              </p>
            </div>

            {/* Cupón Input */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">¿Tienes un cupón?</h3>
              <CuponInput />
            </div>

            {/* Características principales */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Características principales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cantidad y Botones */}
            <div className="space-y-4">
              {/* Selector de cantidad */}
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold">Cantidad:</span>
                <div className="flex items-center border border-slate-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="text-slate-300 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 text-white font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(producto.stock || 10, quantity + 1))}
                    disabled={quantity >= (producto.stock || 10)}
                    className="text-slate-300 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-slate-400 text-sm">({producto.stock || 0} disponibles)</span>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg"
                  disabled={producto.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </Button>

                <Button
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white py-3"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Favoritos
                </Button>

                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 py-3">
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>

            {/* Información de envío */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-semibold">Envío Gratis</p>
                  <p className="text-slate-400 text-xs">En compras +$100</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white text-sm font-semibold">Garantía</p>
                  <p className="text-slate-400 text-xs">1 año</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white text-sm font-semibold">Entrega</p>
                  <p className="text-slate-400 text-xs">2-5 días hábiles</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de información adicional */}
        <div className="mt-8">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-8">
              <button className="border-purple-500 text-purple-400 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                Especificaciones
              </button>
            </nav>
          </div>
          
          <div className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-700">
                      <span className="text-slate-400 font-medium">{key}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProductDetail;
