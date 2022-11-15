import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '../themes'
import { SWRConfig,  } from 'swr';
import { AuthProvider, CartProvider, UiProvider } from '../context';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return ( 
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          refreshInterval: 0,
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
      >
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
          <AuthProvider>
            <UiProvider>
              <CartProvider>
                <Component {...pageProps} />
              </CartProvider>
            </UiProvider>
          </AuthProvider>
      </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
    
  )
}

export default MyApp
