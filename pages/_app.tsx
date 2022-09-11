import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '../themes'
import { SWRConfig,  } from 'swr';
import { UiProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  return ( 
    <SWRConfig
      value={{
        refreshInterval: 0,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <UiProvider>
        <Component {...pageProps} />
      </UiProvider>
    </ThemeProvider>
    </SWRConfig>
    
  )
}

export default MyApp
