import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Box,  Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React from 'react'
import { CartList, OrdenSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts/ShopLayout';

const OrderPage = () => {
    return (
        <ShopLayout title='Resumen de orden 123456' pageDescriptiom='Resumen de la orden'>
          <Typography variant='h1' component={'h1'}>Orden: ABC-123456</Typography>
         <Chip 
            sx={{
                my:2
            }}
            label={'Pendiente de pago'}
            variant='outlined'
            color='error'
            icon={<CreditCardOffOutlined />}
         />
         <Chip 
            sx={{
                my:2
            }}
            label={'Pagada'}
            variant='outlined'
            color='success'
            icon={<CreditScoreOutlined />}
         />
         
          <Grid container>
            <Grid item xs={12} sm={7} >
              {/* CartList */}
              <CartList />
            </Grid>
            <Grid item xs={12} sm={5} >
                <Card className='sumary-card'>
                  <CardContent>
                    <Typography variant='h2'>
                      Resumen (3 productos)
                    </Typography>
    
                    <Divider sx={{my: 2}}/>
    
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography variant={'subtitle1'}>Dirección de entrega</Typography>
                        <NextLink href={'/checkout/address'} passHref>
                            <Link underline={'always'}>
                                Editar
                            </Link>
                        </NextLink>
                    </Box>
                    
                    <Typography >Luis Torres</Typography>
                    <Typography >323 Algun lugar</Typography>
                    <Typography >StyllVillage, HT-124</Typography>
                    <Typography >Costa Rica</Typography>
                    <Typography >+31 6234517</Typography>
    
                    <Divider sx={{my: 2}}/>
    
                    <Box display={'flex'} justifyContent={'end'}>
                        <NextLink href={'/cart'} passHref>
                            <Link underline={'always'}>
                                Editar
                            </Link>
                        </NextLink>
                    </Box>
                   
                    {/* OrdenSummary */}
                    <OrdenSummary />
                    <Box sx={{mt:3}}>
                        {/* TODO */}
                      <h1>Pagar</h1>
                      <Chip 
                            sx={{
                                my:2
                            }}
                            label={'Pagada'}
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                        />
                    </Box>
                  </CardContent>
                </Card>
            </Grid>
            
          </Grid>
        </ShopLayout>
      )
}

export default OrderPage