import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import { CartList, OrdenSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from 'next/router';

const CartPage = () => {
  const { isLoaded, numberOfItems } = useContext(CartContext)
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && numberOfItems === 0) {
      router.replace('/cart-empty')
    }
  
  }, [isLoaded, numberOfItems, router])
  

  if (!isLoaded || numberOfItems === 0) {
    return (<></>)
  }

  return (
    <ShopLayout title='Carrito | 3' pageDescriptiom='Carrito de compras de la tienda'>
      <Typography variant='h1' component={'h1'}>Carrito</Typography>
      <Grid container>
        <Grid item xs={12} sm={7} >
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5} >
            <Card className='sumary-card'>
              <CardContent>
                <Typography variant='h2'>
                  Orden
                </Typography>
                <Divider sx={{my: 2}}/>
                <OrdenSummary />
                <Box sx={{mt:3}}>
                  <Button
                   color='secondary' 
                   className='circular-btn' 
                   onClick={() =>{ 
                    console.log('first')
                    router.push('/checkout/address')}}
                   fullWidth>
                    Checkout
                  </Button>
                </Box>
              </CardContent>
            </Card>
        </Grid>
        
      </Grid>
    </ShopLayout>
  )
}

export default CartPage