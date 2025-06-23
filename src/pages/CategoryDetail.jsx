import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../services/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import MyCard from "../components/MyCard";

const CategoryDetail = () => {
  const { id } = useParams();
  const [detalleCategoria, setDetalleCategoria] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const getDetalleCategoria = async () => {
    const detalle = await api(`/categorias/${id}`);
    console.log(JSON.stringify(detalle.data, null, 5));
    setDetalleCategoria(detalle);
  };

  const renderDetalleCategoria = () => {
    if(!detalleCategoria) return null;
    const { nombre, imagenUrl, descripcion } = detalleCategoria.data.data;
    return (
      <div className="min-h-screen bg-blue-100">
      <div className="flex flex-col items-center gap-1 mt-4 ">
        <NavBar />
        <h1 className="text-3xl font-semibold text-center mt-20">{nombre}</h1>
        <div className="flex flex-wrap gap-5 mt-24 justify-center px-4">
          <MyCard
            nombre={descripcion}
            imagen_url={imagenUrl}
            isCardProduct={false}
          />
        </div>
      </div>
        <Footer />
      </div>
    );
  };

  useEffect(() => {
    getDetalleCategoria();
  }, []);

  return (
    <div>
      {isLoading ? (
        <h2>Cargando detalle por favor espere...</h2>
      ) : (
        renderDetalleCategoria()
      )}
    </div>
  );
};

export default CategoryDetail;
