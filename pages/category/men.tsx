import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProdducts } from '../../hooks'
import { IProduct } from '../../interfaces'

const menPage = () => {
    const router = useRouter()
    const pathnameSplited : string[] = router.asPath.split('/')
    const path:string = pathnameSplited[pathnameSplited.length -1]
    const { products, isError, isLoading} = useProdducts(`/products?gender=${path}`)

    if (isError) return <div>failed to load</div>
  
    return (
      <ShopLayout
        title={'Teslo-Shop | Man'}
        pageDescriptiom={'Encuentra los mejores productos para hombres de Teslo aqui'}
        imageFullUrl={''}
      >
           <Typography variant='h1' component={'h1'}>
                Tienda
           </Typography>
           <Typography variant='h2' sx={{
              mb:1
           }} >
            Todos los productos
           </Typography>
          
           {
            isLoading ?
            <FullScreenLoading /> :
            <ProductList products={products as IProduct[]} />
           }
           
      </ShopLayout>
     
    )
}

export default menPage