import { MonitorWeight } from '@mui/icons-material';
import Head from 'next/head'
import React, { FC, ReactNode } from 'react'
import { Navbar, SideMenu } from '../ui';

interface Props {
    title: string;
    pageDescriptiom:string;
    imageFullUrl?: string;
    children: ReactNode
}

export const ShopLayout:FC<Props> = ({children, title, pageDescriptiom, imageFullUrl}) => {
  return (
    <>
        <Head>
            <title>{title}</title>
            <meta name='description'  content={pageDescriptiom}/>
            <meta name='og:title' content={title} />
            <meta name='og:description' content={pageDescriptiom} />
            {
                imageFullUrl && (
                    <meta name='og:image' content={imageFullUrl} />
                )
            }
        </Head>

        <nav>
            {/* Todo Navbar */}
            <Navbar />
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
            {children}
        </main>

        <footer>
            {/* todo  Footer */}
        </footer>
    
    </>
  )
}
