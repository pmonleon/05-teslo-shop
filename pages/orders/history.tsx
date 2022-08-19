import { SearchOutlined } from '@mui/icons-material';
import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import React from 'react'
import { ShopLayout } from '../../components/layouts'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width:100 },
    { field: 'fullName', headerName: 'Nombre completo', width:300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description:'Muestra información si esta la orden pagad o no',
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

const rows: GridRowsProp = [
    {id: 1, paid:true, fullName: 'Luis Perez', orderLink: '1-13241' },
    {id: 2, paid:false, fullName: 'Ernesto Torres',  orderLink: '2-56645'},
    {id: 3, paid:true, fullName: 'Daniela Castillo', orderLink: '3-32464'},
    {id: 4, paid:true, fullName: 'Elena Taulada', orderLink: '4-45347' },
    {id: 5, paid:true, fullName: 'Daniel Tomas' ,  orderLink: '5-55555'},
    {id: 6, paid:true, fullName: 'Begoña Garcia',  orderLink: '6-83242'},
] 

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de ordenes' pageDescriptiom='Historial de ordenes del cliente'>
        <Typography variant={'h1'} component={'h1'}>Historial de ordenes</Typography>
        <Grid container>
            <Grid item xs={12} sx={{height: 650, width:'100%'}}>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default HistoryPage