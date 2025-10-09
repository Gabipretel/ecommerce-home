"use client"

import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Gamepad2,
  Zap,
  ShoppingCart,
  User,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  LogOut,
  Settings
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { formatPrice } from "../utils/priceFormatter"
import { getImageUrlWithFallback } from "../utils/imageUtils"
import CartSummary from "../components/CartSummary"
import CartSidebar from "../components/CartSidebar"

const CartDetail = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Usar el contexto de autenticación
  const { isAuthenticated, userType, user: currentUser, logout } = useAuth()
  
  // Usar el contexto del carrito
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
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

  const handleCheckout = () => {
    alert('Funcionalidad de checkout en desarrollo')
  }

  // Si es admin, redirigir o mostrar mensaje
  if (userType === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-slate-400 mb-6">Los administradores no pueden acceder al carrito de compras</p>
          <Button
            onClick={() => navigate('/admin')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Ir al Panel de Administración
          </Button>
        </div>
      </div>
    )
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Hola, {String(currentUser?.email || '').split('@')[0] || 'Usuario'}</span>
                  </div>
                  
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
              
              <CartSummary onClick={() => setIsCartOpen(true)} />
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-slate-900/95 backdrop-blur-md z-50 flex flex-col md:hidden">
          <div className="px-4 py-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2" onClick={() => navigate('/')}>
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
              <Button variant="ghost" className="text-slate-300" onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="p-4 flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-slate-300 px-3 py-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Hola, {String(currentUser?.email || '').split('@')[0] || 'Usuario'}</span>
                  </div>
                  
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
              
              <CartSummary onClick={() => setIsCartOpen(true)} isMobile={true} />
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-slate-800/30 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-purple-400 p-0" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al inicio
            </Button>
            <span className="text-slate-500">/</span>
            <span className="text-purple-400">Carrito de Compras</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <ShoppingBag className="w-8 h-8 mr-3 text-purple-400" />
            Mi Carrito de Compras
          </h1>
          <p className="text-slate-400">
            {totalItems > 0 ? `${totalItems} productos en tu carrito` : 'Tu carrito está vacío'}
          </p>
        </div>

        {items.length === 0 ? (
          // Carrito vacío
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                <ShoppingBag className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h3>
              <p className="text-slate-400 mb-6">
                Descubre nuestros increíbles productos y comienza a llenar tu carrito
              </p>
              <Button
                onClick={() => navigate('/catalogo')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Explorar Productos
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Productos ({totalItems})</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vaciar carrito
                </Button>
              </div>

              {items.map((item) => (
                <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 mt-4">
                    <div className="flex space-x-6">
                      {/* Imagen del producto */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={getImageUrlWithFallback(item.imagen_principal)}
                          alt={item.nombre}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-semibold text-lg mb-1">
                              {item.nombre}
                            </h4>
                            {item.marca?.nombre && (
                              <Badge variant="outline" className="text-purple-400 border-purple-400 text-sm">
                                {item.marca.nombre}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Controles de cantidad */}
                          <div className="flex items-center space-x-3">
                            <span className="text-slate-300 text-sm">Cantidad:</span>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-8 h-8 p-0 border-slate-600"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-white font-medium w-12 text-center text-lg">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0 border-slate-600"
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Precio */}
                          <div className="text-right">
                            <div className="text-white font-bold text-xl">
                              {formatPrice(item.precio * item.quantity)}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {formatPrice(item.precio)} c/u
                            </div>
                          </div>
                        </div>

                        {/* Indicador de stock */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-slate-400 text-sm">
                            Stock disponible: {item.stock}
                          </div>
                          {item.quantity >= item.stock && (
                            <div className="text-orange-400 text-sm">
                              Stock máximo alcanzado
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800/50 border-slate-700 sticky top-24">
                <CardContent className="p-6 mt-4">
                  <h3 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal ({totalItems} productos):</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Envío:</span>
                      <span className="text-green-400">Gratis</span>
                    </div>
                    <div className="border-t border-slate-700 pt-4">
                      <div className="flex justify-between text-white font-bold text-xl">
                        <span>Total:</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg mb-4"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Finalizar Compra
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/catalogo')}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Seguir Comprando
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

export default CartDetail
