import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@mui/material";

const SearchBar = () => {
  return (
    <TextField
      label="Buscar"
      placeholder="Buscar..."
      size="small"
      sx={{ minWidth: 300 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
