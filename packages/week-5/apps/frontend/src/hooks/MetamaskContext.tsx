import { ethers } from 'ethers';
import { createContext, PropsWithChildren, useContext } from 'react';
import { WalletConnectionStatus } from '../components/ConnectWalletBtn';
import useMetamask from './useMetamask';

export const MetamaskContext = createContext<{
  status: WalletConnectionStatus;
  address: string | undefined;
  provider: ethers.providers.Web3Provider | undefined;
  connect: (() => {}) | undefined;
}>({ status: 'disconnected', address: undefined, provider: undefined, connect: undefined });

export const MetamaskProvider = ({ children }: PropsWithChildren) => {
  const props = useMetamask();

  return <MetamaskContext.Provider value={props}>{children}</MetamaskContext.Provider>;
};

export const useMetamaskContext = () => useContext(MetamaskContext);
