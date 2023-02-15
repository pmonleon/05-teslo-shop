import { CreditCardOffOutlined } from '@mui/icons-material'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import React, { FC } from 'react'

type Props = {
    title: string | number
    subtitle: string
    icon: JSX.Element
}

export const SummaryTitle:FC<Props> = ({title, subtitle, icon}) => {

 


  return (
    
        <Grid item xs={12} sm={4} md={3}>
            <Card>
                <CardContent sx={{
                    width:'50px',
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                   {icon}
                </CardContent>
                <CardContent sx={{ display:'flex', flexDirection:'column', flex: '1 0 auto'}}>
                    <Typography variant='h3' component={'h3'}>
                            {title}
                    </Typography>
                    <Typography variant='caption'>
                            {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    
  )
}



