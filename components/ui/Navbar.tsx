import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { AppBar, Button, Link, Toolbar, Typography, Box, IconButton, Badge, Input, InputAdornment } from '@mui/material';
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import { ROUTES } from '../../constants/routes';
import { UiContext } from '../../context';
import { CartContext } from '../../context/cart/CartContext';


export const Navbar = () => {
  const { asPath, push } =  useRouter()
  const { toggleSideMenu } = useContext(UiContext)
  const { numberOfItems } = useContext(CartContext)

  const [searchTerm, setsearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return
        push(`/search/${searchTerm}`)
    }


  return (
    <AppBar>
      <Toolbar>
        <NextLink href={'/'} passHref>
          <Link display={'flex'} alignItems={"center"}> 
            <Typography variant='h6'>Teslo |</Typography>
            <Typography sx={{ml:'0.5px'}}>Shop</Typography>
          </Link>
        </NextLink>
      
        <Box flex={1}/>

        <Box className='fadeIn' sx={{
          display: isSearchVisible ? 'none' : {
            xs: 'none',
            sm: 'block'
          }
        }}>
          <NextLink href={'/category/men'} passHref>
                <Link>
                  <Button color={ asPath.includes(ROUTES.category.men)? 'primary' : 'info'}>Hombres</Button>
                </Link>
          </NextLink>
          <NextLink href={'/category/women'} passHref>
                <Link>
                  <Button color={ asPath.includes(ROUTES.category.women)? 'primary' : 'info'}>Mujeres</Button>
                </Link>
          </NextLink>
          <NextLink href={'/category/kid'} passHref>
                <Link>
                  <Button color={ asPath.includes(ROUTES.category.kid)? 'primary' : 'info'}>Niños</Button>
                </Link>
          </NextLink>   
        </Box>
  
       <Box flex={1}/>

        {/* En desktop */}
       {
         isSearchVisible
         ? (
          <Input
          className='fadeIn'
          type='text'
          placeholder="Buscar..."
          autoFocus
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? onSearchTerm() : null}
          sx={{
            display:{
              xs: 'none',
              sm: 'flex'
            }
          }}
          endAdornment={
                <InputAdornment position="end">
                    <IconButton
                      onClick={() => { 
                        setIsSearchVisible(false)
                        setsearchTerm('')
                      }}
                    >
                          <ClearOutlined />
                      </IconButton>
                </InputAdornment>
              }
            />
         )
         : (
          <IconButton 
            className='fadeIn' 
            onClick={() => setIsSearchVisible(true) }
            sx={{
              display:{xs: 'none', sm: 'flex'}
             }}  
          >
              <SearchOutlined />
           </IconButton>
         )
       }
       

       {/* En pantallas pequeñas */}
       <IconButton onClick={()=> toggleSideMenu((true))} sx={{
        display:{xs: 'flex', sm: 'none'}
       }}>
         <SearchOutlined />
       </IconButton>

       <NextLink href={'/cart'} passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems } color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={ ()=> toggleSideMenu(true) }>Menú</Button>

      </Toolbar>
    </AppBar>
  )
}
