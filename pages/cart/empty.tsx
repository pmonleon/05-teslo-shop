import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout';

const EmptyCartPage = () => {
  return (
    <ShopLayout title='Carrito vaacío' pageDescriptiom='No hay artículos en el carrito de compras'>
        <Box 
            display={'flex'} 
            justifyContent={'center'} 
            alignItems={'center'} 
            height={'calc(100vh - 200px)'}
            sx={{
                flexDirection:{
                    xs: 'column',
                    sm: 'row'
                }
            }}
        >
            <RemoveShoppingCartOutlined sx={{fontSize:100}} />
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Typography variant='h2' component={'h2'} fontSize={40} fontWeight={200}>
                    Su carrito esta vacío
                </Typography>
                <NextLink href={'/'} passHref>
                    <Link typography={'h4'} color='secondary'>
                        Regresar
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyCartPage