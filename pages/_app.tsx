import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '../themes'
import { SWRConfig,  } from 'swr';
import { AuthProvider, CartProvider, UiProvider } from '../context';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return ( 
    <SessionProvider session={session}>
       <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>          
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
      </PayPalScriptProvider>
    </SessionProvider>
    
  )
}

export default MyApp
