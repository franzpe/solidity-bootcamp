import configureAxios from '@/libs/configureAxios';
import { chains, wagmiClient } from '@/libs/wagmi';
import '@/styles/globals.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import '@rainbow-me/rainbowkit/styles.css';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { WagmiConfig } from 'wagmi';

configureAxios();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={session} refetchInterval={0}>
        <RainbowKitSiweNextAuthProvider>
          <RainbowKitProvider
            initialChain={process.env.NEXT_PUBLIC_DEFAULT_CHAIN as any}
            chains={chains}
            theme={darkTheme()}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
