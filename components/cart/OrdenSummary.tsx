import { Grid, Typography } from '@mui/material'
import React, { FC } from 'react'

export const OrdenSummary: FC = () => {
  return (
    <Grid container>
        <Grid item xs={6}>
          <Typography>No. Productos</Typography>
        </Grid>     
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <Typography>3</Typography>
        </Grid>     
        <Grid item xs={6}>
          <Typography>Subtotal</Typography>
        </Grid>    
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <Typography>{ `$${113.35}` }</Typography>
        </Grid>   
        <Grid item xs={6}>
          <Typography>Impuestos (15%)</Typography>
        </Grid>    
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <Typography>{ `$${30.15}` }</Typography>
        </Grid>   
        <Grid item xs={6} sx={{mt:2}}>
          <Typography variant={'subtitle1'}>Total :</Typography>
        </Grid>    
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <Typography>{ `$${143.50}` }</Typography>
        </Grid>   
    </Grid>
  )
}
