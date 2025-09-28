import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../services/api";
import ProductCatalog from "../components/ProductCatalog";

const CategoryDetail = () => {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCategory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/categorias/${id}`);
        setCategoryName(response.data.data.nombre);
      } catch (err) {
        console.error('Error loading category:', err);
        setError('Error al cargar la categoría');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getCategory();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando categoría...</p>
        </div>
      </div>
    );
  }

  if (error || !categoryName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Categoría no encontrada'}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <ProductCatalog categoryId={id} categoryName={categoryName} />;
};

export default CategoryDetail;
