import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React from 'react'
import { CartList, OrdenSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts/ShopLayout';

const SummaryPage = () => {
  return (
    <ShopLayout title='Resumen de orden' pageDescriptiom='Resumen de la orden'>
      <Typography variant='h1' component={'h1'}>Resumen de la orden</Typography>
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
                  <Button color='secondary' className='circular-btn' fullWidth>
                    Confirmar orden
                  </Button>
                </Box>
              </CardContent>
            </Card>
        </Grid>
        
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage