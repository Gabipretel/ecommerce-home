import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import ListCategories from "./pages/ListCategories.jsx";
import CategoryDetail from "./pages/CategoryDetail.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { CuponProvider } from "./context/CuponContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CuponProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/categorias" element={<ListCategories />} />
          <Route path="/categorias/:id" element={<CategoryDetail />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </CuponProvider>
  </StrictMode>
);
