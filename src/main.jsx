import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import GeneralCatalog from "./pages/GeneralCatalog.jsx";
import CategoryDetail from "./pages/CategoryDetail.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CartDetail from "./pages/CartDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import { CuponProvider } from "./context/CuponContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// Páginas de autenticación
import UserRegister from "./pages/UserRegister.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Contact from "./pages/Contact.jsx";

// Páginas del panel de administración
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import CategoryManagement from "./pages/admin/CategoryManagement.jsx";

// Componentes de protección de rutas
import { AuthProtectedRoute, AdminProtectedRoute } from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <CuponProvider>
        <SidebarProvider>
          <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<App />} />
            <Route path="/catalogo" element={<GeneralCatalog />} />
            <Route path="/categorias/:id" element={<CategoryDetail />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<CartDetail />} />
            <Route path="/contacto" element={<Contact />} />
            
            {/* Rutas de autenticación - protegidas para usuarios ya logueados */}
            <Route path="/register-user" element={<AuthProtectedRoute><UserRegister /></AuthProtectedRoute>} />
            {/* <Route path="/register-admin" element={<AuthProtectedRoute><AdminRegister /></AuthProtectedRoute>} /> */}
            <Route path="/login-user" element={<AuthProtectedRoute><UserLogin /></AuthProtectedRoute>} />
            <Route path="/login-admin" element={<AuthProtectedRoute><AdminLogin /></AuthProtectedRoute>} />
            
            {/* Rutas del panel de administración - solo para admins */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/usuarios" element={<AdminProtectedRoute><UserManagement /></AdminProtectedRoute>} />
            <Route path="/admin/productos" element={<AdminProtectedRoute><ProductManagement /></AdminProtectedRoute>} />
            <Route path="/admin/categorias" element={<AdminProtectedRoute><CategoryManagement /></AdminProtectedRoute>} />
            
            {/* Ruta catch-all para páginas no encontradas - DEBE IR AL FINAL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Router>
        </SidebarProvider>
      </CuponProvider>
    </CartProvider>
  </AuthProvider>
);
