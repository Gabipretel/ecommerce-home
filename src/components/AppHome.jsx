import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import {
  Gamepad2,
  Zap,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Monitor,
  Cpu,
  Laptop,
  Box,
  Power,
  MemoryStick,
  CircuitBoardIcon as Motherboard,
  Star,
  Truck,
  Shield,
  Headphones,
  LogOut,
  Settings
} from "lucide-react"
import authService from "../services/authService"
import api from "../services/api"

export default function AppHome() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    { name: "Procesadores", icon: Cpu, color: "from-blue-500 to-cyan-500" },
    { name: "Placas de Video", icon: Monitor, color: "from-green-500 to-emerald-500" },
    { name: "Memorias RAM", icon: MemoryStick, color: "from-purple-500 to-violet-500" },
    { name: "Mothers", icon: Motherboard, color: "from-orange-500 to-red-500" },
    { name: "Fuentes", icon: Power, color: "from-yellow-500 to-orange-500" },
    { name: "Gabinetes", icon: Box, color: "from-pink-500 to-rose-500" },
    { name: "Monitores", icon: Monitor, color: "from-indigo-500 to-purple-500" },
    { name: "Notebooks", icon: Laptop, color: "from-teal-500 to-cyan-500" },
  ]

  const brands = ["NVIDIA", "AMD", "Logitech", "Samsung", "Corsair", "Razer", "Intel", "Gamemax"]

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      const type = authService.getUserType()
      const user = authService.getCurrentUser()
      
      setIsAuthenticated(authenticated)
      setUserType(type)
      setCurrentUser(user)
    }
    
    checkAuth()
    
    // Escuchar cambios en el localStorage
    window.addEventListener('storage', checkAuth)
    
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // Cargar productos
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Temporalmente deshabilitado para debugging
        // const response = await api("http://localhost:3000/api/productos")
        // console.log("Respuesta de productos:", response.data)
        
        // Por ahora usar productos vacíos para forzar el uso de productos de ejemplo
        console.log("Usando productos de ejemplo para debugging")
        setProducts([])
        
      } catch (error) {
        console.error("Error al cargar productos:", error)
        setError(error.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    getAllProducts()
  }, [])

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUserType(null)
    setCurrentUser(null)
    setIsMenuOpen(false)
    // Recargar la página para actualizar el estado
    window.location.reload()
  }

  const handleLogin = () => {
    navigate('/login-user')
  }

  const handleRegister = () => {
    navigate('/register-user')
  }

  const handleAdminPanel = () => {
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
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
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Hola, {String(currentUser?.email || '').split('@')[0] || 'Usuario'}</span>
                  </div>
                  
                  {userType === 'admin' && (
                    <Button 
                      variant="ghost" 
                      className="text-slate-300 hover:text-white"
                      onClick={handleAdminPanel}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Panel Admin
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="text-slate-300 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-slate-300 hover:text-white"
                    onClick={handleLogin}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={handleRegister}
                  >
                    Registrarse
                  </Button>
                </>
              )}
              
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2 text-slate-300 px-3 py-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Hola, {String(currentUser?.email || '').split('@')[0] || 'Usuario'}</span>
                      </div>
                      
                      {userType === 'admin' && (
                        <Button 
                          variant="ghost" 
                          className="text-slate-300 hover:text-white justify-start"
                          onClick={handleAdminPanel}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Panel Admin
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        className="text-slate-300 hover:text-white justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className="text-slate-300 hover:text-white justify-start"
                        onClick={handleLogin}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Iniciar Sesión
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white justify-start"
                        onClick={handleRegister}
                      >
                        Registrarse
                      </Button>
                    </>
                  )}
                  
                  <Button variant="ghost" className="text-slate-300 hover:text-white justify-start">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrito (3)
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Tu Setup Gaming
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Perfecto Te Espera
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Descubre la mejor tecnología gaming con precios increíbles. Desde componentes de alta gama hasta
              periféricos profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
                Ver Ofertas
              </Button>
              <Button
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 text-lg"
                onClick={() => navigate('/categorias')}
              >
                Explorar Categorías
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Explora por Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 mt-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-sm md:text-base">{category.name}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-slate-800/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Productos Destacados</h2>
          
          {loading ? (
            <div className="text-center text-white">
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-400">
              <p>Error al cargar productos: {error}</p>
              <p className="text-slate-300">Mostrando productos de ejemplo</p>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? products.map((product) => (
              <Card
                key={product.id}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/productos/${product.id}`)}
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={product.imagen || "/placeholder.svg"}
                      alt={product.nombre}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {product.descuento && (
                      <Badge className="absolute top-2 right-2 bg-red-600 text-white">-{product.descuento}%</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {String(product.marca || 'Gaming')}
                    </Badge>
                    <h3 className="text-white font-semibold text-sm group-hover:text-purple-400 transition-colors">
                      {String(product.nombre || 'Producto')}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? "text-yellow-400 fill-current" : "text-slate-600"
                          }`}
                        />
                      ))}
                      <span className="text-slate-400 text-sm">(4.5)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-white">${Number(product.precio || 0).toFixed(2)}</span>
                      {product.precio_anterior && (
                        <span className="text-slate-400 line-through">${Number(product.precio_anterior || 0).toFixed(2)}</span>
                      )}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Agregar al Carrito
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : !loading ? (
              // Productos de ejemplo si no hay productos de la API
              [
                {
                  id: 1,
                  nombre: "NVIDIA RTX 4080 Super",
                  marca: "NVIDIA",
                  precio: 1299.99,
                  precio_anterior: 1499.99,
                  imagen: "/placeholder.svg?height=200&width=200",
                  rating: 4.8,
                  descuento: 13,
                },
                {
                  id: 2,
                  nombre: "Logitech G Pro X Superlight",
                  marca: "Logitech",
                  precio: 149.99,
                  precio_anterior: 179.99,
                  imagen: "/placeholder.svg?height=200&width=200",
                  rating: 4.9,
                  descuento: 17,
                },
                {
                  id: 3,
                  nombre: 'Samsung Odyssey G7 32"',
                  marca: "Samsung",
                  precio: 699.99,
                  precio_anterior: 799.99,
                  imagen: "/placeholder.svg?height=200&width=200",
                  rating: 4.7,
                  descuento: 12,
                },
                {
                  id: 4,
                  nombre: "AMD Ryzen 9 7900X",
                  marca: "AMD",
                  precio: 549.99,
                  precio_anterior: 599.99,
                  imagen: "/placeholder.svg?height=200&width=200",
                  rating: 4.8,
                  descuento: 8,
                },
              ].map((product) => (
                <Card
                  key={product.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={product.imagen || "/placeholder.svg"}
                        alt={String(product.nombre)}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {product.descuento && (
                        <Badge className="absolute top-2 right-2 bg-red-600 text-white">-{product.descuento}%</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {String(product.marca)}
                      </Badge>
                      <h3 className="text-white font-semibold text-sm group-hover:text-purple-400 transition-colors">
                        {String(product.nombre)}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-slate-600"
                            }`}
                          />
                        ))}
                        <span className="text-slate-400 text-sm">({product.rating})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">${Number(product.precio).toFixed(2)}</span>
                        {product.precio_anterior && (
                          <span className="text-slate-400 line-through">${Number(product.precio_anterior).toFixed(2)}</span>
                        )}
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        Agregar al Carrito
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Marcas de Confianza</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
              >
                <span className="text-slate-300 font-semibold text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-slate-800/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Envío Gratis</h3>
              <p className="text-slate-300">En compras superiores a $100</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Garantía Extendida</h3>
              <p className="text-slate-300">Hasta 3 años en productos seleccionados</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Soporte 24/7</h3>
              <p className="text-slate-300">Atención especializada siempre disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-700 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
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
              <p className="text-slate-300 text-sm">
                Tu tienda de confianza para tecnología gaming y componentes de alta gama.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Categorías</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>
                  <Link to="/categorias" className="hover:text-purple-400">
                    Procesadores
                  </Link>
                </li>
                <li>
                  <Link to="/categorias" className="hover:text-purple-400">
                    Placas de Video
                  </Link>
                </li>
                <li>
                  <Link to="/categorias" className="hover:text-purple-400">
                    Memorias RAM
                  </Link>
                </li>
                <li>
                  <Link to="/categorias" className="hover:text-purple-400">
                    Monitores
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Ayuda</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>
                  <a href="#" className="hover:text-purple-400">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400">
                    Envíos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400">
                    Devoluciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400">
                    Garantías
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>Email: info@gg-store.com</li>
                <li>Teléfono: +1 (555) 123-4567</li>
                <li>Horario: Lun-Vie 9AM-6PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">© 2024 GG Store. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
