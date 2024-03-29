import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React, { FC, useContext, useMemo } from 'react'
import { CartContext } from '../../context';
import { ItemCounter } from '../ui';
import { ICartProduct } from '../../interfaces/cart';
import { IOrderItem } from '../../interfaces/order';


interface Props {
  editable?: boolean
  products?: IOrderItem[] 
}

export const CartList:FC<Props> = ({editable, products}) => {
  const { cart:cartProducts, updateCartQuantity, removeCartProduct} = useContext(CartContext)

  const onNewQuantityCartProduct = (value: number, product: ICartProduct | IOrderItem) => {
      product.quantity += value
      updateCartQuantity(product as ICartProduct)
  }

  const onRemoveProductCart = (product:ICartProduct | IOrderItem) => {
    removeCartProduct(product as ICartProduct)
  }

  const cart = useMemo(() => products ? products : cartProducts, [products, cartProducts])
  
  return (
    <>
      {
        cart.map((product, index) => (
          <Grid container spacing={2} sx={{mb:1}} key={index}>
            <Grid item xs={3} >
              {/* Todo llevar a la pagina del producto */}
              <NextLink href={`/product/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia 
                      image={`${product?.image}`}
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
                  Talla:<strong>{product.size}</strong>
                </Typography>
                {/* ⁄Condicional editable*/}
                {
                  editable ? 
                   <ItemCounter
                    currentValue={ product.quantity }
                    maxValue={ 10 }
                    onUpdatedQuantity= {(value) => onNewQuantityCartProduct(value, product)}
                   /> : 
                   <Typography variant='h5'>{product.quantity} {' '} {product.quantity > 1 ? 'productos' : 'producto' }</Typography>
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
                  <Button variant={'text'} color={'secondary'} onClick={() => onRemoveProductCart(product)} >
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
