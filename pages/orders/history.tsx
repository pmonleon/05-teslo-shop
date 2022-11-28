import { SearchOutlined } from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next'
import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import React, { useMemo } from 'react'
import { ShopLayout } from '../../components/layouts'
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { getOrdersByUser } from '../../database/dbOrders';
import { IOrder } from '../../interfaces/order';

interface Props {
    orders: IOrder[] | null
}

const HistoryPage:NextPage<Props> = ({orders}) => {
    console.log(orders)
    const rows: GridRowsProp = useMemo(() => {
        if (!orders) {
            return []
        }
        return orders.map( (item, index) => {
            return {
                id: index + 1,
                paid: item.isPaid,
                fullName: `${item.shippingAddress.firstName.toUpperCase()} ${item.shippingAddress.lastName.toUpperCase()}`,
                orderLink: item._id
            }
        })
    }, [orders])


    const columns: GridColDef[] = useMemo(() => {
        return (
            [
                { field: 'id', headerName: 'ID', width:100 },
                { field: 'fullName', headerName: 'Nombre completo', width:300 },
                {
                    field: 'paid',
                    headerName: 'Pagada',
                    description:'Muestra información si esta la orden pagada o no',
                    width: 200 ,
                    renderCell: (params:GridValueGetterParams) => {
                        return (
                            params.row.paid ? (
                                <Chip 
                                    color={'success'}
                                    label={'pagada'}
                                    variant={'outlined'}
                                />
                            ) : (
                                <Chip
                                    color={'error'}
                                    label={'pendiente'}
                                    variant={'outlined'}
                                />
                            )
                          )}
                    },      
                    { 
                        field: 'orderLink', 
                        headerName: 'Ver orden',
                        description: 'Número del pedido vinculado a la orden',
                        width:300 ,
                        sortable:false,
                        renderCell: (params:GridValueGetterParams) => {
                            return (
                                <NextLink href={`/orders/${params.row.orderLink}`} passHref>
                                    <Link>
                                       <SearchOutlined />
                                    </Link>
                                </NextLink>
                            )
                        }, 
                    }
                
            ]
        )
    }, [])
 


  return (
    <ShopLayout title='Historial de ordenes' pageDescriptiom='Historial de ordenes del cliente'>
        <Typography variant={'h1'} component={'h1'}>Historial de ordenes</Typography>
        { !orders || !orders.length
          ? <h2>¡ Oops parce que todavía no tienes ninguna orden !</h2>
          : <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{height: 650, width:'100%'}}>
                    <DataGrid 
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>}
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  
// @ts-ignore
  const session:any = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/history` ,
        permanent:false
      }
    }
  }

   const orders = await getOrdersByUser(session?.user!._id)

    return {
        props: {
            orders
        }
    }
}


export default HistoryPage