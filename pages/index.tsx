import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
import { useProdducts } from '../hooks/useProducts';
import { IProduct } from '../interfaces';


const HomePage: NextPage = () => {
 
const { products, isError, isLoading} = useProdducts('/products')

  if (isError) return <div>failed to load</div>

  
  return (
    <ShopLayout
      title={'Teslo-Shop | Home'}
      pageDescriptiom={'Encuentra los mejores productos de Teslo aqui'}
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

export default HomePage
