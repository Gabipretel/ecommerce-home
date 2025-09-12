import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import ListCategories from "./pages/ListCategories.jsx";
import CategoryDetail from "./pages/CategoryDetail.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { CuponProvider } from "./context/CuponContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";

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
            <Route path="/categorias" element={<ListCategories />} />
            <Route path="/categorias/:id" element={<CategoryDetail />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            
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
