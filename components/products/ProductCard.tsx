import { Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'
import { Box } from '@mui/system';
import NextLink from 'next/link';
import React, { FC, useMemo, useState } from 'react'
import { IProduct } from '../../interfaces/products';

interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({product}) => {

    const [isHovered, setIsHovered] = useState(false)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
  
    const productImage = useMemo(() => {
        return isHovered 
        ? `${product.images[1]}`
        : `${product.images[0]}`
    }, [isHovered, product.images])

  return (
    <Grid 
        item 
        xs={6} 
        sm={4}
        onMouseEnter={()=>setIsHovered(true)}
        onMouseLeave={()=>setIsHovered(false)}
    >
        <Card>
             <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
                <Link>
                    
                    <CardActionArea>
                        {
                            product.inStock === 0 && (
                            <Chip 
                            color='primary'
                            label= "No hay disponibles"
                            sx={{
                                position:'absolute',
                                zIndex: 99,
                                top: 5,
                                left: 5,
                                height:20
                            }}
                        />)
                        }
                        
                        <CardMedia 
                            component={'img'}
                            image={productImage}
                            alt={product.title}
                            className='fadeIn'
                            onLoad={() => setIsImageLoaded(true)}
                            />
                    </CardActionArea>
                </Link>
            </NextLink>
        </Card>
        <Box sx={{mt:1, display: isImageLoaded ? 'block' : 'none'}} className='fadeIn'>
            <Typography fontWeight={700}>{product.title}</Typography>
            <Typography fontWeight={500}>${product.price}</Typography>
        </Box>
     
    </Grid>
  )
}
