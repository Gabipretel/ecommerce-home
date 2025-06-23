import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Slider from "./components/Slider";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import Select from "./components/Select";
import Paper from "@mui/material/Paper";
import MyCard from "./components/MyCard";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import CuponInput from "./components/CuponInput";
import { Link } from "react-router";
import api from "./services/api";
const App = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await api("http://localhost:3000/api/productos");
      console.log(JSON.stringify(response.data.data, null, 5));
      setProducts(response.data.data);
    } catch (error) {
      const errorMessage = "No se pudo obtener los productos";
      throw new Error(errorMessage);
    }
  };

  const renderProducts = () => {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {products.map((product) => (
            <div key={product.id} className="w-full max-w-sm">
              <Link 
                to={`/productos/${product.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <MyCard {...product} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      <NavBar />
      <main className="flex-grow">
        <Slider />
        <div className="flex flex-col items-center gap-1 mt-4">
          <FilterBar />
                    <Paper
            elevation={3}
            sx={{ width: 400, margin: "0 auto" }}
            className="flex flex-col items-center pb-4"
          >
            <Select />
            <SearchBar />
          </Paper>
          
          <div className="w-full flex justify-center mt-6">
            <CuponInput />
          </div>
        </div>
         <div className="w-full flex justify-center">
            {renderProducts()}
          </div>
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default App;
