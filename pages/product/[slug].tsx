import { Box, Button, Grid, Typography } from '@mui/material'
import { NextPage } from 'next'
// import { useRouter } from 'next/router'
import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { ProductSlideShow, SizesSelector } from '../../components/products'
import { FullScreenLoading, ItemCounter } from '../../components/ui'
// import { useProdducts } from '../../hooks'
import { IProduct } from '../../interfaces'
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'
// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
import { GetStaticProps } from 'next'
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
import { GetStaticPaths } from 'next'
import { dbProducts } from '../../database'

type Props = {
  product: IProduct
}


const ProductPage: NextPage<Props> = ({product}) => {

   // const { query } = useRouter()
  // const { products: product , isError, isLoading} = useProdducts(`/products/${query.slug}`)

  

  return (
    <ShopLayout title={product.title} pageDescriptiom={product.description}>
         
          <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            {/* todo slideshow */} 
            <ProductSlideShow images={product.images} />    
          </Grid>
          <Grid item xs={12} sm={5}>
            <Box display={'flex'} flexDirection={'column'}>
                {/* Titulos */}
                <Typography variant='h1' component={'h1'}>{product.title}</Typography>
                <Typography variant='subtitle1' component={'h2'}>${product.price}</Typography>
                {/* Cantidad */}
                <Box sx={{my:2}}>
                  <Typography variant={'subtitle2'}>Cantidad</Typography>
                  {/* ItemCounter */}
                  <ItemCounter />
                  <SizesSelector 
                    sizes={product.sizes} 
                   // selectedSize={product.sizes[0]} 
                  />
                </Box>
                {/* Agragar al carrito */}
                <Button color={'secondary'} className='circular-btn'>
                  Agregar al carrito
                </Button>
                {/* <Chip label='No hay disponibles' color={'error'} variant={'outlined'} /> */}
                {/* Descripcion */}
                <Box sx={{mt:3}}>
                    <Typography variant={'subtitle2'}>Descripción</Typography>
                    <Typography variant={'body2'}>{product.description}</Typography>
                </Box>
            </Box>
          </Grid>
        </Grid>
       
    </ShopLayout>

  )
}



// No usar SSR ...

// export const getServerSideProps: GetServerSideProps = async ({params}) => {
//  const { slug = '' } = params as {slug:string}
//   //console.log(ctx.req.url as string, ctx.query, ctx.params) 
//   const product = await dbProducts.getProductBySlug( slug ) // your fetch function here 

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }


// usar getStaticPaths
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const ProductsSlug = await dbProducts.getAllProductsSlugs()  // your fetch function here 


  return {
    paths: ProductsSlug.map(({slug}) =>({
        params: {
          slug
        }    
      }))    
    ,
    fallback: "blocking"
  }
}


// usar el GetSataticProps
export const getStaticProps: GetStaticProps = async ({params}) => {
  const { slug = '' } = params as {slug:string}
  const product = await dbProducts.getProductBySlug( slug ) // your fetch function here 

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // cada dia
  }
}

export default ProductPage