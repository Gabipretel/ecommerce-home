import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import { formatPrice } from "../utils/priceFormatter";
import { useCupon } from "../context/CuponContext";
const MyCard = ({
  nombre,
  precio,
  imagen_url,
  rating,
  descuento,
  isCardProduct = true,
  oferta,
}) => {
  const { cuponActivo, calcularPrecioConCupon } = useCupon();
  
  const precioNumerico = typeof precio === 'string' ? parseFloat(precio) : precio;
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 345,
        minHeight: 450,
        display: "flex",
        flexDirection: "column",
        margin: 'auto',
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
        '@media (max-width: 600px)': {
          maxWidth: '100%',
          minHeight: 400,
        },
        '@media (min-width: 601px) and (max-width: 960px)': {
          maxWidth: 320,
          minHeight: 420,
        }
      }}
    >
      <CardMedia
        sx={{
          height: { xs: 180, sm: 200, md: 200 },
          width: "100%",
          objectFit: "contain",
          backgroundColor: "#f5f5f5",
          padding: 1,
        }}
        component="img"
        image={imagen_url}
        title={nombre}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pb: 2,
        }}
      >
        <Typography 
          gutterBottom 
          variant="h6" 
          sx={{ 
            minHeight: { xs: '48px', sm: '64px' }, 
            lineHeight: 1.2,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            fontWeight: 'bold',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {nombre}
        </Typography>
        {oferta && (
          <Chip
            sx={{ width: "fit-content" }}
            label="Oferta!"
            color="success"
            variant="outlined"
          />
        )}
        {rating && <Rating name="read-only" value={rating} readOnly />}
        {precioNumerico && typeof precioNumerico === 'number' && !isNaN(precioNumerico) && (
          <>
            {(() => {
              const precioConCupon = calcularPrecioConCupon(precioNumerico);
              
              // Si hay cupón activo Y es válido, solo se aplica el descuento del cupón
              if (cuponActivo && precioConCupon) {
                return (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.secondary",
                        fontWeight: "bold",
                        textDecoration: "line-through",
                        fontSize: "0.9rem"
                      }}
                    >
                      {formatPrice(precioNumerico)}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ 
                        color: "success.main", 
                        fontWeight: "bold",
                        fontSize: "1.1rem"
                      }}
                    >
                      {formatPrice(precioConCupon)}
                    </Typography>
                    <Chip
                      label={`${cuponActivo.porcentajeDescuento}% OFF con cupón`}
                      color="success"
                      size="small"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  </>
                );
              }
              
              // Si NO hay cupón válido, usa lógica de descuento del producto
              return (
                <>
                  <Typography
                    variant="h6"
                    sx={
                      oferta && descuento > 0 && typeof descuento === 'number' ? {
                        color: "text.secondary",
                        fontWeight: "bold",
                        textDecoration: "line-through",
                        fontSize: "0.9rem"
                      } : {
                        color: "primary.main",
                        fontWeight: "bold",
                      }
                    }
                  >
                    {formatPrice(precioNumerico)}
                  </Typography>
                  {oferta && descuento > 0 && typeof descuento === 'number' && (
                    <>
                      <Typography
                        variant="h6"
                        sx={{ 
                          color: "primary.main", 
                          fontWeight: "bold",
                          fontSize: "1.1rem"
                        }}
                      >
                        {formatPrice(precioNumerico - (precioNumerico * descuento) / 100)}
                      </Typography>
                      <Chip
                        label={`${descuento}% OFF`}
                        color="primary"
                        size="small"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </>
                  )}
                </>
              );
            })()}
          </>
        )}
      </CardContent>
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          pb: 3,
        }}
      >
        {isCardProduct && (
          <Button
            size="small"
            variant="contained"
            fullWidth
            sx={{
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              fontWeight: 'bold',
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
            }}
          >
            Agregar al carrito
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default MyCard;
