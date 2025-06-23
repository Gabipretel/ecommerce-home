import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router";
import MyCard from "../components/MyCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const ListCategories = () => {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCategorias = async () => {
    try {
      setIsLoading(true);
      const apiResponse = await api("/categorias");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      // console.log(JSON.stringify(apiResponse.data.data, null, 5));
      setCategorias(apiResponse.data.data);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = "Error al obtener las categorías";
      throw new Error(errorMessage);
    }
  };

  const renderCategorias = () => {
    return (
      <div className= "min-h-screen bg-blue-100">
        <div className="flex flex-col items-center gap-1 mt-4">
          <NavBar />
          <h1 className="text-3xl font-semibold text-center mt-20">
            Categorías
          </h1>
          <div className="flex flex-wrap gap-5 mt-24 justify-center px-4">
            {categorias.map((categoria) => (
              <Link to={`/categorias/${categoria.id}`} key={categoria.id}>
                <MyCard
                  nombre={categoria.nombre}
                  imagen_url={categoria.imagenUrl}
                  isCardProduct={false}
                />
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  useEffect(() => {
    getCategorias();
  }, []);

  return (
    <div>
      {isLoading ? (
        <h2> Cargando categorias, por favor espere...</h2>
      ) : (
        renderCategorias()
      )}
    </div>
  );
};

export default ListCategories;
