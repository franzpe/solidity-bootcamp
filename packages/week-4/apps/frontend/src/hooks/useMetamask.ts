import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { WalletConnectionStatus } from '../components/ConnectWalletBtn';

const ethereum: any | undefined = (window as any).ethereum;

const useMetamask = () => {
  const [status, setStatus] = useState<WalletConnectionStatus>('disconnected');
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | undefined>();

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
          const address = Web3.utils.toChecksumAddress(res[0]);

          setAddress(address);
          getBalance(address);
          setStatus('connected');
        }

        break;
      }
      case 'connected': {
        setAddress('');
        setBalance(undefined);
        setStatus('disconnected');
        break;
      }
      default: {
        break;
      }
    }
  };

  const getBalance = async (accAddress: string) => {
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [accAddress, 'latest'],
    });

    setBalance(Number(ethers.utils.formatEther(balance)));
  };

  const handleAccountsChanged = async (newAddress: object) => {
    getBalance(newAddress.toString());
    setAddress(newAddress.toString());
  };

  const handleChainChanged = () => {
    setAddress('');
    setStatus('disconnected');
  };

  return [{ status, address, balance }, handleConnect] as const;
};

export default useMetamask;
