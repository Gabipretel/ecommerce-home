import { useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const FilterBar = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleToggle = (filterId) => {
    setSelectedFilter(selectedFilter === filterId ? null : filterId);
  };

  const filters = [
    { label: "Nuevos Ingresos", id: 1 },
    { label: "Mas Vendidos", id: 2 },
    { label: "Ofertas", id: 3 }

  ];

  return (
    <Stack 
      direction="row" 
      spacing={2} 
      className='w-full justify-center items-center py-4'
    >
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          label={filter.label}
          onClick={() => handleToggle(filter.id)}
          sx={{
            backgroundColor: selectedFilter === filter.id ? '#2c3e50' : 'white',
            color: selectedFilter === filter.id ? 'white' : '#2c3e50',
            border: `1px solid ${selectedFilter === filter.id ? '#2c3e50' : '#94a3b8'}`,
            '&:hover': {
              backgroundColor: selectedFilter === filter.id ? '#34495e' : '#f8fafc',
            },
            fontWeight: selectedFilter === filter.id ? 700 : 400,
            fontSize: '0.85rem',
            padding: '22px 10px',
            letterSpacing: '0.3px',
            boxShadow: selectedFilter === filter.id ? '0 4px 4px rgba(0,0,0,0.5)' : 'none',
          }}
        />
      ))}
    </Stack>
  );
};

export default FilterBar;
