import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#212121',
        color: 'white',
        py: 6,
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo y descripción */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SportsEsportsIcon sx={{ fontSize: 30, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                GG Store
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Tu tienda de confianza para componentes gaming de alta calidad. 
              Encuentra las mejores ofertas en hardware y periféricos.
            </Typography>
          </Grid>

          {/* Links rápidos */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Productos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Procesadores', 'Tarjetas Gráficas', 'Periféricos', 'Monitores'].map((text) => (
                <Link
                  key={text}
                  href="#"
                  color="inherit"
                  sx={{
                    opacity: 0.7,
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 1,
                      color: '#76b900'
                    }
                  }}
                >
                  {text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Links de ayuda */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Ayuda
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Soporte', 'Envíos', 'Devoluciones', 'Contacto'].map((text) => (
                <Link
                  key={text}
                  href="#"
                  color="inherit"
                  sx={{
                    opacity: 0.7,
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 1,
                      color: '#76b900'
                    }
                  }}
                >
                  {text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Redes sociales */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Síguenos
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { icon: <FacebookIcon />, label: 'Facebook' },
                { icon: <TwitterIcon />, label: 'Twitter' },
                { icon: <InstagramIcon />, label: 'Instagram' },
                { icon: <LinkedInIcon />, label: 'LinkedIn' }
              ].map((social) => (
                <IconButton
                  key={social.label}
                  aria-label={social.label}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#76b900'
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.7,
            textAlign: 'center',
            mt: 4,
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          © {new Date().getFullYear()} GG Store. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 