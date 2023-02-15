import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProdducts } from '../../hooks'
import { IProduct } from '../../interfaces'

const Women = () => {
    const router = useRouter()
    const pathnameSplited : string[] = router.asPath.split('/')
    const path:string = pathnameSplited[pathnameSplited.length -1]
    console.log(path)
    const { products, isError, isLoading} = useProdducts(`/products?gender=${path}`)
   // const { products, isError, isLoading} = useProdducts(`/products?gender=women`)

    if (isError) return <div>failed to load</div>

  
    return (
      <>
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
           
      </>
     
    )
}

export default Women