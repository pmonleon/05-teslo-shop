import React, { useEffect, useState } from 'react'
import { NextPage } from 'next';
import { AdminLayout } from '../../components/layouts';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { SummaryTitle } from '../../components/admin/SummaryTitle';
import { Grid, Typography } from '@mui/material';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '../../interfaces';


const DashboardPage:NextPage = () => {

    const {data, error} = useSWR<DashboardSummaryResponse>('/api/admin/dashboard',{
        refreshInterval: 30 * 1000 // cada 30 secs
    })

    const [refreshIn, setRefreshIn] = useState<number>(30)

    useEffect(() => {
      
      const interval = setInterval(()=>{
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
        }, 1000)
    
      return () => {
        clearInterval(interval)
      }
    }, [])
    

   if (!data && !error) {
     return <></>
   }

   if (error) {
    console.log(error)
    return <Typography>Error al cargar la información</Typography>
   }
  // console.log({data})
   const { 
    numberOfClients, 
    numberOfOrders, 
    numberOfProducts, 
    numberOfProductsWithLowInventory, 
    numberOfProductsWithNoInventory,
    notPaidOrders, 
    paidOrders } = data!

  return (
    <AdminLayout
        title='Dashboard'
        subtitle='Estadísticas generales'
        icon={<DashboardOutlined />}
    >
        <Grid container spacing={2} >

            <SummaryTitle 
                title={numberOfOrders}
                subtitle={'Ordenes Totales'}
                icon={ <CreditCardOffOutlined color='secondary' sx={{fontSize: 40}}/>}
            />
            <SummaryTitle 
                title={paidOrders}
                subtitle={'Ordenes Pagadas'}
                icon={ <AttachMoneyOutlined color='success' sx={{fontSize: 40}}/>}
            />
            <SummaryTitle 
                title={notPaidOrders}
                subtitle={'Ordenes Pendientes'}
                icon={ <CreditCardOffOutlined color='error' sx={{fontSize: 40}}/>}
            />
            <SummaryTitle 
                title={numberOfClients}
                subtitle={'Clientes'}
                icon={ <GroupOutlined color='primary' sx={{fontSize: 40}}/>}
            />
            <SummaryTitle 
                title={numberOfProducts}
                subtitle={'Productos'}
                icon={ <CategoryOutlined color='warning' sx={{fontSize: 40}}/>}
            />
            <SummaryTitle 
                title={numberOfProductsWithNoInventory}
                subtitle={'Sin Existencias'}
                icon={ <CancelPresentationOutlined color='error' sx={{fontSize: 40}}/>}
            />
            <SummaryTitle 
                title={numberOfProductsWithLowInventory}
                subtitle={'Bajo Inventario'}
                icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{fontSize: 40}}/>}
            />
            <SummaryTitle 
                title={refreshIn}
                subtitle={'Actualizacion en: '}
                icon={ <AccessTimeOutlined color='secondary' sx={{fontSize: 40}}/>}
            />

        </Grid>
    </AdminLayout>
  )
}

export default DashboardPage



