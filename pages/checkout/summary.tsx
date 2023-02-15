import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { count } from 'console';
import Cookies from 'js-cookie';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { CartList, OrdenSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartContext } from '../../context';
import { jwt } from '../../utils';
import { countries } from '../../utils/countries';
import { useRouter } from 'next/router';

const SummaryPage:NextPage = () => {
  const { shippingAddres, numberOfItems, createOrder } = useContext(CartContext)
  const router = useRouter()
  const [isPosting, setIsPosting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  useEffect(() => {
    if (!Cookies.get('firstName') || !address) {
      router.push('/checkout/address')
    }
  }, [])


  const countryName = useMemo(() => countries.filter( item => item.code === country )[0].name, [countries])
  
  
  if (!shippingAddres) { return <></> }
  const { firstName, lastName, address, address2, city, country, zip, telephone } = shippingAddres


  
  const onCreateOrder = async():Promise<void> => {
      setIsPosting(true)
      setErrorMessage('')
     
      const {hasError, message} = await createOrder()
      if (hasError) {
        setIsPosting(false)
        setErrorMessage(message!) 
        return    
      }
      console.log(message)
      router.replace(`/orders/${message}`)
      
  } 


  return (
    <ShopLayout title='Resumen de orden' pageDescriptiom='Resumen de la orden'>
      <Typography variant='h1' component={'h1'}>Resumen de la orden</Typography>
      <Grid container>
        <Grid item xs={12} sm={7} >
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5} >
            <Card className='sumary-card'>
              <CardContent>
                <Typography variant='h2'>
                  Resumen ({numberOfItems} {' '} {numberOfItems > 1 ? 'productos' : 'producto'})
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
              
                <Typography >{ firstName } { lastName }</Typography>
                <Typography >{ address } { !!address2 ? ', ' + address2  : '' } </Typography>
                <Typography >{ city }, {zip} </Typography>
                <Typography >{ countryName }</Typography>
                <Typography >{ telephone }</Typography>

                <Divider sx={{my: 2}}/>

                <Box display={'flex'} justifyContent={'end'}>
                    <NextLink href={'/cart'} passHref>
                        <Link underline={'always'}>
                            Editar
                        </Link>
                    </NextLink>
                </Box>
                
                <OrdenSummary />
                <Box sx={{mt:3, display:'flex', flexDirection:'column'}}>
                  <Button 
                    color='secondary' 
                    className='circular-btn' 
                    fullWidth
                    onClick={onCreateOrder}
                    disabled={isPosting}
                  >
                    Confirmar orden
                  </Button>
                  <Chip 
                     color='error'
                     label={errorMessage}
                     sx={{
                       display: errorMessage ? 'flex' : 'none',
                       mt: 2
                     }}
                  />
                </Box>
              </CardContent>
            </Card>
        </Grid>
        
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
   
  // const { token = '' } = req.cookies;
  let isValidToken = false

  // try {
  //     await jwt.isValidToken(token)
  //     isValidToken = true
  // } catch (error) {
  //     isValidToken = false
  // }

  // if (!isValidToken) {

  //     return {
  //         redirect: {
  //             destination: ('/auth/login?page=/checkout/summary'),
  //             permanent: false
  //         }
  //     }
  // }

  return {
      props: {
          
      }
  }
}

export default SummaryPage