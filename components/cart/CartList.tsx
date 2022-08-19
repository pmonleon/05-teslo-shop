import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React, { FC } from 'react'
import { initialData } from '../../database/products';
import { ItemCounter } from '../ui';

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2]
]

interface Props {
  editable?: boolean
}

export const CartList:FC<Props> = ({editable}) => {
  return (
    <>
      {
        productsInCart.map(product => (
          <Grid container spacing={2} sx={{mb:1}} key={product.slug}>
            <Grid item xs={3} >
              {/* Todo llevar a la pagina del producto */}
              <NextLink href={`/product/slug`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia 
                      image={`/products/${product.images[0]}`}
                      component='img'
                      sx={{br:5}}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>
            <Grid item xs={7} >
              <Box display={'flex'} flexDirection={'column'}>
                <Typography variant='body1'>
                  {product.title}
                </Typography>
                <Typography variant='body1'>
                  Talla:<strong>M</strong>
                </Typography>
                {/* ⁄Condicional editable*/}
                {
                  editable ? 
                   <ItemCounter /> : 
                   <Typography variant='h5'>3 items</Typography>
                }
                
              </Box>
            </Grid>
            <Grid item xs={2} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Typography variant={'subtitle1'}>
                  {`$${product.price}`}
                </Typography>
                {/* Editabvle */}
                {
                  editable && 
                  <Button variant={'text'} color={'secondary'} >
                    Borrar
                  </Button>
                }
               
            </Grid>
          </Grid>
          
        ))
      }
    </>
  )
}
