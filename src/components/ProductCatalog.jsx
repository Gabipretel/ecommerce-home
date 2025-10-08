"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/Checkbox"
import Slider from "./Slider"
import LoadingOverlay from "./ui/LoadingOverlay"
import {
  Gamepad2,
  Zap,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Filter,
  Grid3X3,
  List,
  Star,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
  Package,
  LogOut,
  Settings
} from "lucide-react"
import api from "../services/api"
import { formatPrice } from "../utils/priceFormatter"
import { getImageUrlWithFallback } from "../utils/imageUtils"
import { useAuth } from "../context/AuthContext"

const ProductCatalog = ({ categoryId, categoryName }) => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Usar el contexto de autenticación
  const { isAuthenticated, userType, user: currentUser, logout } = useAuth()

  const [activeFilters, setActiveFilters] = useState({
    categories: categoryId ? [categoryName] : [],
    brands: [],
  })

  // Cargar datos desde la API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Simular tiempo de carga para visualizar el loader
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Cargar productos
        let productsResponse
        if (categoryId) {
          // Usar el endpoint correcto según la documentación: /api/productos?id_categoria=X
          productsResponse = await api.get(`/productos?id_categoria=${categoryId}&activo=true&orderBy=createdAt&orderDirection=DESC`)
        } else {
          productsResponse = await api.get('/productos?activo=true&orderBy=createdAt&orderDirection=DESC')
        }
        
        // Cargar categorías y marcas para filtros
        const [categoriesResponse, brandsResponse] = await Promise.all([
          api.get('/categorias'),
          api.get('/marcas')
        ])

        setProducts(productsResponse.data.data || [])
        setCategories(categoriesResponse.data.data || [])
        setBrands(brandsResponse.data.data || [])
        
        // Si estamos en una categoría específica, establecer filtros iniciales
        if (categoryId && categoryName) {
          setSelectedCategories([categoryName])
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [categoryId, categoryName])

  // Función para filtrar productos
  const getFilteredProducts = () => {
    let filtered = products.filter((product) => product.activo !== false)

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.nombre?.toLowerCase().includes(term) ||
          product.marca?.nombre?.toLowerCase().includes(term) ||
          product.categoria?.nombre?.toLowerCase().includes(term),
      )
    }

    // Filtrar por categorías
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((product) => 
        activeFilters.categories.includes(product.categoria?.nombre)
      )
    }

    // Filtrar por marcas
    if (activeFilters.brands.length > 0) {
      filtered = filtered.filter((product) => 
        activeFilters.brands.includes(product.marca?.nombre)
      )
    }

    // Filtrar por rango de precio
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.precio) || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    return filtered
  }

  // Función para obtener conteo de productos por categoría
  const getCategoryCount = (categoryName) => {
    return products.filter(
      (product) =>
        product.activo !== false &&
        product.categoria?.nombre === categoryName &&
        (searchTerm
          ? product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.marca?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categoria?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
          : true),
    ).length
  }

  // Función para obtener conteo de productos por marca
  const getBrandCount = (brandName) => {
    return products.filter(
      (product) =>
        product.activo !== false &&
        product.marca?.nombre === brandName &&
        (searchTerm
          ? product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.marca?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categoria?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
          : true) &&
        (activeFilters.categories.length > 0 ? 
         activeFilters.categories.includes(product.categoria?.nombre) : true),
    ).length
  }

  // Función para limpiar filtros
  const clearAllFilters = () => {
    const initialCategories = categoryId && categoryName ? [categoryName] : []
    setActiveFilters({ categories: initialCategories, brands: [] })
    setSelectedCategories(initialCategories)
    setSelectedBrands([])
    setPriceRange([0, 2000])
    setSearchTerm("")
    setCurrentPage(1)
  }

  // Obtener productos filtrados
  const filteredProducts = getFilteredProducts()
  const productsPerPage = 6
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Sin Stock", color: "bg-red-600", textColor: "text-red-100" }
    if (stock <= 5) return { text: `Últimas ${stock} unidades`, color: "bg-orange-600", textColor: "text-orange-100" }
    return { text: "En Stock", color: "bg-green-600", textColor: "text-green-100" }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
      // No necesitamos navigate() aquí, el estado se actualizará automáticamente
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

  if (loading) {
    return <LoadingOverlay isLoading={true} message="Cargando productos..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Volver al inicio
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

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar productos, marcas o categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
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
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-slate-900/95 backdrop-blur-md z-50 flex flex-col">
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
                  <p className="text-xs text-slate-400 -mt-1 hidden sm:block">Gamer once, Gamer always</p>
                </div>
              </div>
              <Button variant="ghost" className="text-slate-300" onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="p-4 flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar productos, marcas o categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full bg-slate-800/50 border border-slate-600 text-white hover:bg-slate-700/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            <div className={`space-y-6 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
              {/* Categories Filter */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Categorías</h3>
                    {selectedCategories.length > 0 && !categoryId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategories([])
                          setActiveFilters((prev) => ({ ...prev, categories: [] }))
                        }}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {categories.map((category) => {
                      const count = getCategoryCount(category.nombre)
                      const isDisabled = categoryId && category.nombre !== categoryName
                      return (
                        <div key={category.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1">
                            <Checkbox
                              id={category.nombre}
                              checked={selectedCategories.includes(category.nombre)}
                              disabled={isDisabled}
                              onCheckedChange={(checked) => {
                                if (isDisabled) return
                                if (checked) {
                                  const newCategories = [...selectedCategories, category.nombre]
                                  setSelectedCategories(newCategories)
                                  setActiveFilters((prev) => ({ ...prev, categories: newCategories }))
                                } else {
                                  const newCategories = selectedCategories.filter((c) => c !== category.nombre)
                                  setSelectedCategories(newCategories)
                                  setActiveFilters((prev) => ({ ...prev, categories: newCategories }))
                                }
                                setCurrentPage(1)
                              }}
                              className="border-slate-600 data-[state=checked]:bg-purple-600"
                            />
                            <label 
                              htmlFor={category.nombre} 
                              className={`text-slate-300 text-sm cursor-pointer flex-1 ${
                                isDisabled ? 'opacity-50' : ''
                              }`}
                            >
                              {category.nombre}
                            </label>
                          </div>
                          <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                            {count}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Brands Filter */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Marcas</h3>
                    {selectedBrands.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBrands([])
                          setActiveFilters((prev) => ({ ...prev, brands: [] }))
                        }}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {brands.map((brand) => {
                      const count = getBrandCount(brand.nombre)
                      return (
                        <div key={brand.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1">
                            <Checkbox
                              id={brand.nombre}
                              checked={selectedBrands.includes(brand.nombre)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const newBrands = [...selectedBrands, brand.nombre]
                                  setSelectedBrands(newBrands)
                                  setActiveFilters((prev) => ({ ...prev, brands: newBrands }))
                                } else {
                                  const newBrands = selectedBrands.filter((b) => b !== brand.nombre)
                                  setSelectedBrands(newBrands)
                                  setActiveFilters((prev) => ({ ...prev, brands: newBrands }))
                                }
                                setCurrentPage(1)
                              }}
                              className="border-slate-600 data-[state=checked]:bg-purple-600"
                            />
                            <label htmlFor={brand.nombre} className="text-slate-300 text-sm cursor-pointer flex-1">
                              {brand.nombre}
                            </label>
                          </div>
                          <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                            {count}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Price Range Filter */}
              {/* <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-4">Rango de Precio</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={2000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-slate-300 text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header Section */}
            <div className="mb-6">
              {/* Breadcrumbs and View Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="text-slate-400 hover:text-purple-400 p-0"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Volver al inicio
                  </Button>
                  {categoryName && (
                    <>
                      <span className="text-slate-500">/</span>
                      <span className="text-purple-400">{categoryName}</span>
                    </>
                  )}
                </div>
                
                {/* View Toggle */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-purple-600" : "border-slate-600 text-slate-300"}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-purple-600" : "border-slate-600 text-slate-300"}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Results Info */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {searchTerm
                    ? `Resultados para "${searchTerm}"`
                    : categoryName
                      ? `Catálogo de ${categoryName}`
                      : "Catálogo de Productos"}
                </h1>
                <p className="text-slate-300">
                  Mostrando {currentProducts.length} de {filteredProducts.length} productos
                  {(activeFilters.categories.length > 0 || activeFilters.brands.length > 0 || searchTerm) && (
                    <span className="text-purple-400"> (filtrados de {products.length} total)</span>
                  )}
                </p>
              </div>

              {/* Active Filters */}
              {(activeFilters.categories.length > 0 || activeFilters.brands.length > 0 || searchTerm) && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-400">Filtros activos:</span>

                  {searchTerm && (
                    <Badge variant="outline" className="text-purple-400 border-purple-400 bg-purple-400/10">
                      Búsqueda: "{searchTerm}"
                      <button onClick={() => setSearchTerm("")} className="ml-2 hover:text-purple-300">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {activeFilters.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-green-400 border-green-400 bg-green-400/10">
                      {category}
                      {!categoryId && (
                        <button
                          onClick={() => {
                            const newCategories = selectedCategories.filter((c) => c !== category)
                            setSelectedCategories(newCategories)
                            setActiveFilters((prev) => ({ ...prev, categories: newCategories }))
                          }}
                          className="ml-2 hover:text-green-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}

                  {activeFilters.brands.map((brand) => (
                    <Badge key={brand} variant="outline" className="text-blue-400 border-blue-400 bg-blue-400/10">
                      {brand}
                      <button
                        onClick={() => {
                          const newBrands = selectedBrands.filter((b) => b !== brand)
                          setSelectedBrands(newBrands)
                          setActiveFilters((prev) => ({ ...prev, brands: newBrands }))
                        }}
                        className="ml-2 hover:text-blue-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}

                  {!categoryId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    >
                      Limpiar todos
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* No Results Message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
                    <Filter className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No encontramos productos</h3>
                  <p className="text-slate-300 mb-6">
                    No hay productos que coincidan con los criterios seleccionados.
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 && (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {currentProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock || 0)
                  const price = parseFloat(product.precio) || 0
                  const discount = product.descuento || 0
                  const originalPrice = discount > 0 ? price / (1 - discount / 100) : price
                  
                  return (
                    <Card
                      key={product.id}
                      className={`product-card bg-slate-800/50 border-slate-700 hover:border-purple-500/50 group cursor-pointer ${
                        viewMode === "list" ? "flex flex-row" : "flex flex-col"
                      }`}
                      onClick={() => navigate(`/productos/${product.id}`)}
                    >
                      <CardContent className={`p-4 ${viewMode === "list" ? "flex w-full" : "flex flex-col h-full"}`}>
                        <div className={`product-image relative ${viewMode === "list" ? "w-48 flex-shrink-0 mr-6" : "mb-4"}`}>
                          <img
                            src={getImageUrlWithFallback(product.imagen_principal || product.imagen_url)}
                            alt={product.nombre}
                            className={`object-cover rounded-lg ${viewMode === "list" ? "w-full h-46 mt-2" : "w-full h-48"}`}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                          {/* {discount > 0 && (
                            <Badge className="absolute top-2 right-2 bg-red-600 text-white">-{discount}%</Badge>
                          )} */}
                          {/* <div className="absolute top-2 left-2 flex space-x-1">
                            <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70">
                              <Heart className="w-4 h-4 text-white" />
                            </Button>
                            <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70">
                              <Eye className="w-4 h-4 text-white" />
                            </Button>
                          </div> */}
                        </div>

                        <div className={`space-y-3 ${viewMode === "list" ? "flex-1" : "flex-1 flex flex-col"}`}>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-purple-400 border-purple-400">
                              {product.marca?.nombre || 'Sin marca'}
                            </Badge>
                            <Badge className={`${stockStatus.color} ${stockStatus.textColor} text-xs`}>
                              <Package className="w-3 h-3 mr-1" />
                              {stockStatus.text}
                            </Badge>
                          </div>

                          <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors line-clamp-2">
                            {product.nombre}
                          </h3>

                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 4) ? "text-yellow-400 fill-current" : "text-slate-600"
                                }`}
                              />
                            ))}
                            <span className="text-slate-400 text-sm">({product.reviews || 0})</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-white">{formatPrice(price)}</span>
                            {discount > 0 && (
                              <span className="text-slate-400 line-through">{formatPrice(originalPrice)}</span>
                            )}
                          </div>

                          <div className={`flex gap-2 mt-auto ${viewMode === "list" ? "mt-4" : ""}`}>
                            <Button
                              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                              disabled={product.stock === 0}
                              onClick={(e) => {
                                e.stopPropagation()
                                // Aquí iría la lógica para agregar al carrito
                              }}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              {product.stock === 0 ? "Sin Stock" : "Agregar"}
                            </Button>
                            <Button
                              variant="outline"
                              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/productos/${product.id}`)
                              }}
                            >
                              Ver Detalle
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className={
                      currentPage === i + 1
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog
