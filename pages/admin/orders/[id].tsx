import { GetServerSideProps, NextPage } from 'next'
import { CardMembershipOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Box,  Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React, { useMemo } from 'react'
import { CartList, OrdenSummary } from '../../../components/cart';
import { unstable_getServerSession } from 'next-auth';
import { dbOrders } from '../../../database';
import { authOptions } from '../../api/auth/[...nextauth]';
import { IOrder } from '../../../interfaces';
import { AdminLayout } from '../../../components/layouts';

interface Props {
  order: IOrder
}

const OrderAdminPage:NextPage<Props> = ({order}) => {
    // console.log(order)
    const { 
      _id,
      user,
      orderItems,
      shippingAddress:{
        firstName,
        lastName,
        address,
        address2,
        zip,
        telephone,
        city,
        country
      },
      paymentResult,
      numberOfItems,
      tax,
      total,
      subtotal,
      isPaid,
      paidAt
  } = order

    const orderValues = useMemo(() =>{ 
      return {total, tax, subtotal, numberOfItems} 
    }, [total, tax, subtotal, numberOfItems])


    return (
        <AdminLayout title={'Resumen de orden'} subtitle={'Panel administración'} icon={<CardMembershipOutlined />} >
          <Typography variant='h1' component={'h1'}>Orden: {_id}</Typography>
          { !isPaid ? (
              <Chip 
                  sx={{
                      my:2
                  }}
                  label={'Pendiente de pago'}
                  variant='outlined'
                  color='error'
                  icon={<CreditCardOffOutlined />}
              />):(
         <Chip 
            sx={{
                my:2
            }}
            label={'Pagada'}
            variant='outlined'
            color='success'
            icon={<CreditScoreOutlined />}
         />)}
         
          <Grid container className='fadeIn'>
            <Grid item xs={12} sm={7} >
              {/* CartList */}
              <CartList
                editable = {false}
                products ={orderItems}
              />
            </Grid>
            <Grid item xs={12} sm={5} >
                <Card className='sumary-card'>
                  <CardContent>
                    <Typography variant='h2'>
                      Resumen ({numberOfItems} - {numberOfItems > 1 ? 'productos' : 'producto'})
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
                    
                    <Typography >{firstName} {lastName}</Typography>
                    <Typography >{address} {address2 ? ` ,${address2}` : null} </Typography>
                    <Typography >{city}, {zip}</Typography>
                    <Typography >{country}</Typography>
                    <Typography >{telephone}</Typography>
    
                    <Divider sx={{my: 2}}/>
                   
                    <OrdenSummary 
                       orderValues={orderValues}
                    />

                    <Box flexDirection={'column'} sx={{ display:'flex', justifyContent: 'start', flex:1 }} >
                            {isPaid ? (
                              <Chip 
                                    sx={{
                                        my:2,
                                    }}
                                    label={'Pagada'}
                                    variant='outlined'
                                    color='success'
                                    icon={<CreditScoreOutlined />}
                                />) : (
                            <Chip 
                                    sx={{
                                        my:2,
                                    }}
                                    label={'Pendiente de pago'}
                                    variant='outlined'
                                    color='error'
                                    icon={<CreditCardOffOutlined />}
                                />
                        )}
                     </Box>      
                  </CardContent>
                </Card>
            </Grid>
            
          </Grid>
        </AdminLayout>
      )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, res, query}) => {
  
  const { id = '' } = query
  
    // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions)
  
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/${id}` ,
        permanent:false
      }
    }
  }
  
  const order = await dbOrders.getOrderById(id.toString())
  
  if (!order) {
    return {
      redirect: {
        destination: `/orders/history` ,
        permanent:false
      }
    }
  }

  return {
    props: {
       order
    }
  }
}

export default OrderAdminPage

