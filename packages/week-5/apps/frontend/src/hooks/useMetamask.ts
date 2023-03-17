import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { WalletConnectionStatus } from '../components/ConnectWalletBtn';

const ethereum: any | undefined = (window as any).ethereum;

type Options = {
  onAccountsChanged?: (newAddress: string) => void;
  onChainChanged?: () => void;
};

const useMetamask = (options?: Options) => {
  const [status, setStatus] = useState<WalletConnectionStatus>('disconnected');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();
  const [address, setAddress] = useState<string>('');

  /**
   * Set metamask provider
   */
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(ethereum, 'any');

    setProvider(provider);
  }, []);

  /**
   * When user changes account or chain in metamask, invoke callback functions
   */
  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', (newAddress: Object) => {
        if (options?.onAccountsChanged) {
          options.onAccountsChanged(newAddress.toString());
        }
      });

      if (options?.onChainChanged) {
        ethereum.on('chainChanged', options.onChainChanged);
      }
    }
  }, []);

  /**
   * Connect handler
   */
  const connect = async () => {
    switch (status) {
      case 'disconnected': {
        if (ethereum && ethereum.isMetaMask) {
          const res = await ethereum.request({
            method: 'eth_requestAccounts'
          });
          setAddress(res[0]);
          setStatus('connected');
        }

        break;
      }
      case 'connected': {
        setAddress('');
        setStatus('disconnected');
        break;
      }
      default: {
        break;
      }
    }
  };

  return { status, provider, address, connect } as const;
};

export default useMetamask;
