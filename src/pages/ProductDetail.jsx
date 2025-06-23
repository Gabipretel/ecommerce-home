import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  Chip,
  Rating,
  Divider,
  CircularProgress,
} from "@mui/material";
import { ShoppingCart, ArrowBack } from "@mui/icons-material";
import { Link } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CuponInput from "../components/CuponInput";
import { useCupon } from "../context/CuponContext";
import api from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cuponActivo, calcularPrecioConCupon } = useCupon();

  useEffect(() => {
    const getProducto = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/productos/${id}`);
        setProducto(response.data.data);
      } catch (error) {
        setError("Error al cargar el producto");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProducto();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "blue.50" }}>
        <NavBar />
        <Container sx={{ py: 20, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  if (error || !producto) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "blue.50" }}>
        <NavBar />
        <Container sx={{ py: 20, textAlign: "center" }}>
          <Typography variant="h4" color="error" gutterBottom>
            {error || "Producto no encontrado"}
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Volver al inicio
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Convertir precio a número
  const precioNumerico =
    typeof producto.precio === "string"
      ? parseFloat(producto.precio)
      : producto.precio;
  const precioConCupon = calcularPrecioConCupon(precioNumerico);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "blue.50" }}>
      <NavBar />

      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
        >
          Volver al catálogo
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                sx={{
                  height: 500,
                  objectFit: "contain",
                  bgcolor: "#f5f5f5",
                }}
                image={producto.imagen_url}
                alt={producto.nombre}
              />
            </Card>
          </Grid>

          {/* Información del producto */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {/* Título y marca */}
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                {producto.nombre}
              </Typography>

              {/* Marca y categoría */}
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                {producto.marca && (
                  <Chip
                    label={producto.marca.nombre}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {producto.categoria && (
                  <Chip
                    label={producto.categoria.nombre}
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </Box>

              {producto.rating && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Rating value={producto.rating} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({producto.rating}/5)
                  </Typography>
                </Box>
              )}

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {producto.descripcion}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Stock disponible: {producto.stock} unidades
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ¿Tienes un cupón de descuento?
                </Typography>
                <CuponInput />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 4 }}>
                {precioNumerico && (
                  <>

                    {cuponActivo && precioConCupon ? (
                      // Con cupón activo
                      <>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "text.secondary",
                            textDecoration: "line-through",
                            mb: 1,
                          }}
                        >
                          Precio original: ${precioNumerico.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            color: "success.main",
                            fontWeight: "bold",
                            mb: 1,
                          }}
                        >
                          ${precioConCupon.toFixed(2)}
                        </Typography>
                        <Chip
                          label={`¡${cuponActivo.porcentajeDescuento}% OFF con cupón!`}
                          color="success"
                          sx={{ mb: 2 }}
                        />
                      </>
                    ) : (
                      // Sin cupón - lógica normal del producto
                      <>
                        {producto.oferta && producto.descuento > 0 ? (
                          <>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "text.secondary",
                                textDecoration: "line-through",
                                mb: 1,
                              }}
                            >
                              Precio original: ${precioNumerico.toFixed(2)}
                            </Typography>
                            <Typography
                              variant="h3"
                              sx={{
                                color: "primary.main",
                                fontWeight: "bold",
                                mb: 1,
                              }}
                            >
                              $
                              {(
                                precioNumerico -
                                (precioNumerico * producto.descuento) / 100
                              ).toFixed(2)}
                            </Typography>
                            <Chip
                              label={`¡${producto.descuento}% OFF!`}
                              color="primary"
                              sx={{ mb: 2 }}
                            />
                          </>
                        ) : (
                          <Typography
                            variant="h3"
                            sx={{
                              color: "primary.main",
                              fontWeight: "bold",
                              mb: 2,
                            }}
                          >
                            ${precioNumerico.toFixed(2)}
                          </Typography>
                        )}
                      </>
                    )}
                  </>
                )}
              </Box>

              <Box sx={{ mt: "auto" }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  disabled={producto.stock === 0}
                  sx={{
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default ProductDetail;
