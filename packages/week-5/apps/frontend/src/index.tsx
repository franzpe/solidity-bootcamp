import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { MetamaskProvider } from './hooks/MetamaskContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient({ defaultOptions: {} });

const darkTheme = createTheme({
  type: 'dark',
  theme: {}
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider theme={darkTheme}>
        <NextUIProvider>
          <MetamaskProvider>
            <App />
          </MetamaskProvider>
        </NextUIProvider>
      </NextUIProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
