import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
const MyCard = ({title,price,image,alt,rating,descuento}) => {

  return (
    <Card sx={{ 
      width: 345,
      height: 450,
      display: 'flex', 
      flexDirection: 'column'
    }}>
    <CardMedia
      sx={{ 
        height: 200,
        width: '100%',
        objectFit: 'contain',
        backgroundColor: '#f5f5f5'
      }}
      component="img"
      image={image}
      title={alt}
    />
    <CardContent sx={{ 
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      pb: 2
    }}>
      <Typography gutterBottom variant="h6">
        {title}
      </Typography>
      <Rating name="read-only" value={rating} readOnly />
      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        ${price}
      </Typography>
    </CardContent>
    <CardActions sx={{ 
      p: 2,
      pt: 0,
      pb: 3
    }}>
      <Button 
        size="small" 
        variant="contained" 
        fullWidth
        sx={{
          py: 1
        }}
      >
        Agregar al carrito
      </Button>
    </CardActions>
  </Card>
  )
}

export default MyCard
