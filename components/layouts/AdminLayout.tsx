import { Box, Typography } from '@mui/material';
import Head from 'next/head'
import React, { FC, ReactNode } from 'react'
import { AdminNavbar } from '../admin';
import { SideMenu } from '../ui';

interface Props {
    title: string;
    subtitle:string;
    icon?: JSX.Element;
    children: ReactNode
}


export const AdminLayout:FC<Props> = ({title, subtitle, icon, children}) => {
  return (
    <>
    <Head>
        <title>{title}</title>
    </Head>

    <nav>
        {/* Todo Navbar */}
        <AdminNavbar />
    </nav>

    {/* todo Sidebar */}  
    <aside>
        <SideMenu />
    </aside>

    <main style={{
        margin: '80px auto',
        maxWidth: '1440px',
        padding: '0 30px'
    }}>
        <Box display={'flex'} flexDirection={'column'}>
            <Typography variant='h1' component={'h1'}>
                {icon} 
                {title}
            </Typography>
            <Typography variant='h2' component={'h2'} sx={{mb:1}}>
                {subtitle}
            </Typography>
        </Box>
        <Box className='fadeIn'>
            {children}
        </Box>
    </main>

    <footer>
        {/* todo  Footer */}
    </footer>

</>
  )
}
