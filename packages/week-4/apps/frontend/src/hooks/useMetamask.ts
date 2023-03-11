import axios from 'axios';
import { ethers, getDefaultProvider } from 'ethers';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { WalletConnectionStatus } from '../components/ConnectWalletBtn';

const ethereum: any | undefined = (window as any).ethereum;

const useMetamask = () => {
  const [status, setStatus] = useState<WalletConnectionStatus>('disconnected');
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | undefined>();
  const [tokenBalance, setTokenBalance] = useState<number | undefined>();
  const [tokenContract, setTokenContract] = useState<ethers.Contract | undefined>();

  const { data: tokenAddress } = useQuery('token-contract-address', () =>
    axios.get('http://localhost:3001/token/contract-address').then(res => res.data),
  );

  useEffect(() => {
    if (tokenAddress) {
      import('contract/artifacts/contracts/ERC20Votes.sol/MyToken.json').then(tokenJson => {
        const contract = new ethers.Contract(
          tokenAddress,
          tokenJson.abi,
          new ethers.providers.AlchemyProvider('goerli', process.env.REACT_APP_ALCHEMY_API_KEY),
        );
        setTokenContract(contract);
      });
    }
  }, [tokenAddress]);

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
          const address = res[0];

          setAddress(address);
          getBalance(address);
          getTokenBalance(address);
          setStatus('connected');
        }

        break;
      }
      case 'connected': {
        setAddress('');
        setBalance(undefined);
        setTokenBalance(undefined);
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

  const getTokenBalance = async (accAddress: string) => {
    if (tokenContract) {
      const tokenBalanceBN = await tokenContract.balanceOf(accAddress);
      setTokenBalance(Number(ethers.utils.formatEther(tokenBalanceBN)));
    }
  };

  const handleAccountsChanged = async (newAddress: object) => {
    getBalance(newAddress.toString());
    getTokenBalance(newAddress.toString());
    setAddress(newAddress.toString());
  };

  const handleChainChanged = () => {
    setAddress('');
    setStatus('disconnected');
  };

  return [{ status, address, tokenAddress, tokenContract, balance, tokenBalance }, handleConnect] as const;
};

export default useMetamask;
