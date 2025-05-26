import NavBar from "./components/NavBar";
import Slider from "./components/Slider";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import Select from "./components/Select";
import Paper from '@mui/material/Paper';
import MyCard from "./components/MyCard";
import {products} from "./data/products.js";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      <NavBar />
      <main className="flex-grow">
        <Slider />
        <div className="flex flex-col items-center gap-1 mt-4">
          <FilterBar />
          <Paper 
            elevation={3} 
            sx={{width: 400, margin: '0 auto'}} 
            className="flex flex-col items-center pb-4"
          >
            <Select />
            <SearchBar />
          </Paper>
        </div>
        <div className="max-w-[90%] mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="flex justify-center">
                <MyCard {...product} />
              </div>
            ))}
          </div>
        </div>
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default App;
