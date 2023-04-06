import React from 'react'
import { NextPage } from 'next';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { AddOutlined, ConfirmationNumberOutlined} from '@mui/icons-material';
import useSWR from 'swr';
import { IProduct } from '../../../interfaces';
import NextLink from 'next/link';


const columns: GridColDef[] = [
  { 
    field: 'img', 
    headerName: 'Foto',
    renderCell: ({row}:GridValueGetterParams) => {
        return (
             <>
                <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
                   <CardMedia 
                        component={'img'}
                        className='fadeIn'
                        image={row.img} //{`/products/${row.img}`}
                        alt={row.title}
                   />
                </a>
             </>
        );
    }
  },
  { 
    field: 'title', 
    headerName: 'Producto', 
    width:250 ,
    renderCell: ({row}:GridValueGetterParams) => {
        return (
          <>
            <NextLink href={`/admin/products/${row.slug}`} passHref>
                <Link underline='always'>
                  { row.title }
                </Link>
            </NextLink>
          </>
        )
  
    }
  },
  { field: 'gender', headerName: 'Genero'},
  { field: 'type', headerName: 'Tipo'},
  { field: 'inStock', headerName: 'Inventario'},
  { field: 'price', headerName: 'Precio'},
  { field: 'sizes', headerName: 'Tallas', width:250},
 ]

const ProductsPage:NextPage = () => {
 
    const { data, error } = useSWR<{products:IProduct[]}>('/api/admin/products') 
     
    
     if (!data && !error) {
        return <></>
     }
     // console.log({data})
     const rows = data!.products.map(product => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
     }))
      return (
        <AdminLayout
            title={`Productos (${data?.products.length})`}
            subtitle='Listado de productos'
            icon={<ConfirmationNumberOutlined />}
        >
          <Box
            display={'flex'}
            justifyContent={'end'}
            sx={{
              mb:2
            }}
          >
            <Button
              startIcon={<AddOutlined />}
              color={'secondary'}
              href={`/admin/products/${'new'}`}
            >
              Crear Producto
            </Button>

          </Box>
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
    

export default ProductsPage