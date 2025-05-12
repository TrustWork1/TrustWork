import EventListeners from '@/components/EventListener/EventListener';
import { checkWindow } from '@/lib/functions/_helpers.lib';
import MuiThemeProvider from '@/mui-theme/MuiThemeProvider';
import { persistor, store } from '@/redux-toolkit/store/store';
import '@/styles/global.scss';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

/**
 * It suppresses the useLayoutEffect warning when running in SSR mode
 */
function fixSSRLayout() {
  // suppress useLayoutEffect (and its warnings) when not running in a browser
  // hence when running in SSR mode
  if (!checkWindow()) {
    React.useLayoutEffect = () => {
      // console.log("layout effect")
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 0,
    },
  },
});

export interface CustomAppProps extends AppProps {
  pageProps: object;
}

export default function CustomApp(props: CustomAppProps) {
  const { Component, pageProps } = props;
  fixSSRLayout();

  return (
    <AppCacheProvider {...props}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <MuiThemeProvider>
              <Toaster
                position='top-center'
                reverseOrder={false}
                gutter={8}
                containerClassName=''
                containerStyle={{}}
                toastOptions={{
                  duration: 2000,
                }}
              />

              <EventListeners />
              <Component {...pageProps} />
            </MuiThemeProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </AppCacheProvider>
  );
}
