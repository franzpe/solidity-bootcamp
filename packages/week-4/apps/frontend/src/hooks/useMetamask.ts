import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { WalletConnectionStatus } from '../components/ConnectWalletBtn';

const ethereum: any | undefined = (window as any).ethereum;

const useMetamask = () => {
  const [status, setStatus] = useState<WalletConnectionStatus>('disconnected');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
    }
  }, []);

  const handleConnect = async () => {
    switch (status) {
      case 'disconnected': {
        if (ethereum && ethereum.isMetaMask) {
          const res = await ethereum.request({ method: 'eth_requestAccounts' });

          setAddress(Web3.utils.toChecksumAddress(res[0]));
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

  const handleAccountsChanged = async (newAddress: string) => {
    setAddress(newAddress);
  };

  const handleChainChanged = () => {
    setAddress('');
    setStatus('disconnected');
  };

  return [status, address, handleConnect] as const;
};

export default useMetamask;
