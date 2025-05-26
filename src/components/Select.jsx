import { FormControl, InputLabel, MenuItem } from "@mui/material";
import  { useState } from "react";
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

const MySelect = () => {
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('');

  const handleCategoriaChange = (event) => {
    setCategoria(event.target.value);
  };

  const handleOrdenChange = (event) => {
    setOrden(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', py: 2 }}>
      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel id="category-select-label">Categorias</InputLabel>
        <Select
          labelId="category-select-label"
          value={categoria}
          label="Categorias"
          onChange={handleCategoriaChange}
        >
          <MenuItem value={'Procesadores'}>Procesadores</MenuItem>
          <MenuItem value={'Memorias'}>Memorias</MenuItem>
          <MenuItem value={'Motherboards'}>Motherboards</MenuItem>
          <MenuItem value={'Tarjetas Graficas'}>Tarjetas Graficas</MenuItem>
          <MenuItem value={'Almacenamiento'}>Almacenamiento</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel id="price-select-label">Ordenar</InputLabel>
        <Select
          labelId="price-select-label"
          value={orden}
          label="Ordenar"
          onChange={handleOrdenChange}
        >
          <MenuItem value={'Menor a Mayor'}>Menor a Mayor</MenuItem>
          <MenuItem value={'Mayor a Menor'}>Mayor a Menor</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default MySelect;
