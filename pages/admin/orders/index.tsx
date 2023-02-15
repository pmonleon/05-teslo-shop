import React from 'react'
import { NextPage } from 'next';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { ConfirmationNumberOutlined, SearchOutlined } from '@mui/icons-material';
import useSWR from 'swr';
import { IOrder, IUser } from '../../../interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order Id', width: 250 },
  { field: 'email', headerName: 'Email', width: 250},
  { field: 'name', headerName: 'Nombre Completo', width:250 },
  { field: 'total', headerName: 'Tola Importe'},
  { 
    field: 'isPaid', 
    headerName: 'Pagada', 
    renderCell: ({row}:GridValueGetterParams) => {
        return (
          <>
            {
              row.isPaid 
              ? <Chip variant='outlined' color='success' label='Pagada' />
              : <Chip variant='outlined' color='error' label='Pendiente'/>
            }
          </>
        )
      }        
    },
  { field: 'numberOfItems', headerName: 'No. Productos', width: 150, align:'center' },
  { field: 'createdAt', headerName: 'Fecha', width: 150 },
  { 
    field: 'actions', 
    headerName: 'Ver Orden',   
    renderCell: ({row}:GridValueGetterParams) => {
        return (
          <>
            <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer' >
                <SearchOutlined />
                Ver Orden
            </a>
          </>
        )
    }
        
   },
 ]

 
const OrdersPage:NextPage = () => {
const { data, error } = useSWR<{orders:IOrder[]}>('/api/admin/orders') 
 

 if (!data && !error) {
    return <></>
 }
 // console.log({data})
 const rows = data!.orders.map(order => ({
    id: order._id,
    name: (order.user as IUser).name,
    email: (order.user as IUser).email,
    isPaid: order.isPaid,
    total: order.total.toFixed(2),
    numberOfItems: order.numberOfItems,
    createdAt: order.createdAt
 }))
  return (
    <AdminLayout
        title='Ordenes'
        subtitle='Listado de ordenes'
        icon={<ConfirmationNumberOutlined />}
    >
        
        <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{height: 650, width:'100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>

    </AdminLayout>
  )
}

export default OrdersPage