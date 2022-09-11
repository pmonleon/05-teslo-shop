import { Box, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products';
import { IProduct } from '../../interfaces';
import { GetServerSideProps } from 'next'
import { dbProducts } from '../../database';

type Props = {
  products: IProduct[]
  existProducts:boolean
  query: string
}


const SearchPage: NextPage<Props> = ({products, existProducts, query}) => {
 
  return (
    <ShopLayout
      title={'Teslo-Shop | Search'}
      pageDescriptiom={'Encuentra los mejores productos de Teslo aqui'}
      imageFullUrl={''}
    >
         <Typography variant='h1' component={'h1'}>
              Buscar producto
         </Typography>

         {
          existProducts 
          ? <Typography variant='h2' textTransform={'capitalize'} sx={{
                mb:1
            }} >
              Todos los productos relacionados con la busqueda: { query }
            </Typography> 
          
         : <Box display={'flex'}>

              <Typography variant='h2' sx={{
                  mb:1
              }} >
                No existen productos relacionados con la busqueda:
              </Typography>
              <Typography  variant='h2' textTransform={'capitalize'} color={'secondary'} sx={{
                  mb:1, ml:1
              }} >
                 { query }
              </Typography>
            </Box> 

         }
       
        
     
          <ProductList products={products as IProduct[]} />
        
         
    </ShopLayout>
   
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({params}) => {
  
  const { query = '' } = params as { query: string }

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }
  
  let products = await  dbProducts.getProductsByTerms(query)// your fetch function here 

  const existProducts = products.length > 0
  if (!existProducts) {
      // TODO retornar sugerencias si la buesqueda es un array vacio
      // products = await dbProducts.getAllProducts( )
      products = await  dbProducts.getProductsByTerms('shirts')
  }



  return {
    props: {
      products,
      existProducts,
      query
    }
  }
}


export default SearchPage
