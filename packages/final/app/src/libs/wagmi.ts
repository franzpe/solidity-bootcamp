import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createClient } from 'wagmi';
import {
  arbitrum,
  arbitrumGoerli,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, provider } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, optimism, optimismGoerli, arbitrum, arbitrumGoerli],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY || '' }), publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'Rogue mansion',
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
