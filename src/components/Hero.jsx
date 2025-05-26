import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Hero = () => {
  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        py: { xs: 6, md: 10 },
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 4, md: 8 },
          }}
        >
          {/* Contenido de texto */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              GeForce RTX 5080
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#76b900',
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Potencia Real para Gaming
            </Typography>
            <Typography 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Experimenta el gaming en 4K con Ray Tracing y DLSS 3.0. 
              Rendimiento excepcional con un consumo eficiente.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<ShoppingCartIcon />}
                sx={{ 
                  bgcolor: '#76b900',
                  '&:hover': {
                    bgcolor: '#5c9100'
                  },
                  px: 4,
                  py: 1.5
                }}
              >
                Comprar Ahora
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: '#76b900',
                    color: '#76b900'
                  },
                  px: 4
                }}
              >
                Más Info
              </Button>
            </Box>
          </Box>

          {/* Imagen */}
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              height: { xs: '300px', sm: '400px', md: '500px' },
              width: '100%',
              overflow: 'hidden'
            }}
          >
            <img 
              src="/src/assets/images/image-01.jpg" 
              alt="NVIDIA GeForce RTX 5080" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                transition: 'transform 0.3s ease',
                filter: 'drop-shadow(0 0 20px rgba(118, 185, 0, 0.3))',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero; 