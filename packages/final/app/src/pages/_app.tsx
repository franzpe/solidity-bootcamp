import MainLayout from '@/layout/MainLayout';
import { chains, wagmiClient } from '@/libs/wagmi';
import '@/styles/globals.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { WagmiConfig } from 'wagmi';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        modalSize="compact"
        initialChain={process.env.NEXT_PUBLIC_DEFAULT_CHAIN as any}
        chains={chains}
        theme={darkTheme()}
      >
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
