import { GetServerSideProps, NextPage } from 'next'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Box,  Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React, { useMemo, useState } from 'react'
import { CartList, OrdenSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { unstable_getServerSession } from 'next-auth';
import { dbOrders } from '../../database';
import { authOptions } from '../api/auth/[...nextauth]';
import { IOrder } from '../../interfaces';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { tesloAPi } from '../../api';
import { useRouter } from 'next/router';

export type INTENT = "CAPTURE" | "AUTHORIZE";

export type LinkDescription = {
  href: string;
  rel: string;
  method?: string;
  title?: string;
  mediaType?: string;
  encType?: string;
};

export type OrderResponseBody = {
  create_time?: string;
  update_time?: string;
  id: string;
  intent?: INTENT;
 //  payer: Partial<Payer>;
//  purchase_units: PurchaseUnit[];
  status:
      | "COMPLETED"
      | "SAVED"
      | "APPROVED"
      | "VOIDED"
  
      | "PAYER_ACTION_REQUIRED";
  links?: LinkDescription[];
};


interface Props {
  order: IOrder
}

const OrderPage:NextPage<Props> = ({order}) => {
    const router = useRouter()
    const [isPaying, setIsPaying] = useState<Boolean>(false)
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

    const onOrderCompleted = async(details: OrderResponseBody) =>{
        if (details.status !== 'COMPLETED') {
          return alert('No se completo orden en Paypal')
        } 

        setIsPaying(true)

        try {
            await tesloAPi.post('/orders/pay', {
              transactionid: details.id, 
              orderId: order._id
            })

          router.reload()
        } catch (error) {
          setIsPaying(false)
          console.log({error})
          alert('Error')
        } 
    } 

    return (
        <ShopLayout title={'Resumen de orden '+ _id } pageDescriptiom={'Resumen de la orden '+ _id} >
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
                    <Box sx={{mt:3}} display='flex' flexDirection={'column'}>
                     <Box sx={{
                      display: isPaying ? 'flex' : 'none'
                     }} display={'flex'} justifyContent={'center'} className='fadeIn'>
                        <CircularProgress />
                     </Box>

                     <Box flexDirection={'column'} sx={{
                      display: isPaying ? 'none' : 'flex',
                      flex: 1
                     }} >
                            {isPaid ? (
                              <Chip 
                                    sx={{
                                        my:2
                                    }}
                                    label={'Pagada'}
                                    variant='outlined'
                                    color='success'
                                    icon={<CreditScoreOutlined />}
                                />) : (
                              <PayPalButtons
                                  createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: order.total.toLocaleString(),
                                                },
                                            },
                                        ],
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions?.order!?.capture().then((details) => {
                                        console.log({details})
                                        onOrderCompleted(details)            
                                    });
                                }}
                              >

                              </PayPalButtons>
                        )}
                     </Box>                    
                    </Box>
                  </CardContent>
                </Card>
            </Grid>
            
          </Grid>
        </ShopLayout>
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
  // @ts-ignore
  if ( order.user !== session?.user?._id) {
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

export default OrderPage