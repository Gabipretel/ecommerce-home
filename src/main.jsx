import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import GeneralCatalog from "./pages/GeneralCatalog.jsx";
import CategoryDetail from "./pages/CategoryDetail.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { CuponProvider } from "./context/CuponContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";

// Páginas de autenticación
import UserRegister from "./pages/UserRegister.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

// Páginas del panel de administración
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import CategoryManagement from "./pages/admin/CategoryManagement.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CuponProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<App />} />
            <Route path="/catalogo" element={<GeneralCatalog />} />
            <Route path="/categorias/:id" element={<CategoryDetail />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            
            {/* Rutas de autenticación */}
            <Route path="/register-user" element={<UserRegister />} />
            <Route path="/register-admin" element={<AdminRegister />} />
            <Route path="/login-user" element={<UserLogin />} />
            <Route path="/login-admin" element={<AdminLogin />} />
            
            {/* Rutas del panel de administración */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<UserManagement />} />
            <Route path="/admin/productos" element={<ProductManagement />} />
            <Route path="/admin/categorias" element={<CategoryManagement />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </CuponProvider>
  </StrictMode>
);
