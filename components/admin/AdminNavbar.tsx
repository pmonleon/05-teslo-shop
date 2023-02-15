import { AppBar, Box, Toolbar, Typography, Link, Button } from '@mui/material'
import { useRouter } from 'next/router'
import React, { FC, useContext } from 'react'
import NextLink from 'next/link';
import { UiContext } from '../../context';


export const AdminNavbar:FC = () => {
    const { asPath, push } =  useRouter()
    const { toggleSideMenu } = useContext(UiContext)

  
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
  
        
  
          {/* En desktop */}
         
         
  
         {/* En pantallas pequeñas */}

  
          <Button onClick={ ()=> toggleSideMenu(true) }>Menú</Button>
  
        </Toolbar>
      </AppBar>
  )
}


