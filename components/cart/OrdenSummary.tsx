import { Grid, Typography } from '@mui/material'
import React, { FC, useContext, useMemo } from 'react'
import { CartContext } from '../../context/cart/CartContext';
import { currency } from '../../utils';

interface OrderValues {
 orderValues?: { 
  total: number 
  subtotal: number 
  tax:number 
  numberOfItems: number
 }
}

export const OrdenSummary: FC<OrderValues> = ({orderValues}) => {

  const {total: totalContext, subtotal: subtotalContext, tax: taxContext, numberOfItems: numberOfItemsContext} = useContext(CartContext)
  
  const {total, subtotal, tax, numberOfItems} = useMemo( () => {
    return {
      total: orderValues?.total ? orderValues?.total : totalContext,
      subtotal: orderValues?.subtotal ? orderValues?.subtotal : subtotalContext,
      tax: orderValues?.tax ? orderValues?.tax : taxContext,
      numberOfItems: orderValues?.numberOfItems ? orderValues?.numberOfItems : numberOfItemsContext
    }
  }, [orderValues])
  
  return (
    <Grid container>
        <Grid item xs={6}>
          <Typography>No. Productos</Typography>
        </Grid>     
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <Typography>{numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
        </Grid>     
        <Grid item xs={6}>
          <Typography>Subtotal</Typography>
        </Grid>    
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <Typography>{ currency.format(subtotal) }</Typography>
        </Grid>   
        <Grid item xs={6}>
          <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE)*100}%)</Typography>
        </Grid>    
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <Typography>{ currency.format(tax) }</Typography>
        </Grid>   
        <Grid item xs={6} sx={{mt:2}}>
          <Typography variant={'subtitle1'}>Total :</Typography>
        </Grid>    
        <Grid item xs={6} sx={{mt:2}} display={'flex'} justifyContent={'end'}>
          <Typography><strong>{ currency.format(total) }</strong></Typography>
        </Grid>   
    </Grid>
  )
}
