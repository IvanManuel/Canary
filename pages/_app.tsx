import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';

import { lightTheme } from '@/themes';
import { AuthProvider, CartProvider, UiProvider } from '../context';


export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  return (
    <SessionProvider session={session}>
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPALL_CLIENT_ID || '', currency: "EUR", }}>
      <SWRConfig
        value={{
          //        refreshInterval: 3000,
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
      >
        <AuthProvider isLoggedIn={false}>

          <CartProvider isLoaded={false} cart={[]} numberOfItems={0} subTotal={0} tax={0} total={0}>

            <UiProvider isMenuOpen={false}>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <Component {...pageProps} />
              </ThemeProvider>
            </UiProvider>

          </CartProvider>

        </AuthProvider>
      </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}
