import axios from 'axios';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { WalletConnectionStatus } from '../components/ConnectWalletBtn';

const ethereum: any | undefined = (window as any).ethereum;

const useMetamask = () => {
  const [status, setStatus] = useState<WalletConnectionStatus>('disconnected');
  const [address, setAddress] = useState<string>('');
  const [votingPower, setVotingPower] = useState<string>('');
  const [balance, setBalance] = useState<string | undefined>('');
  const [tokenBalance, setTokenBalance] = useState<number | undefined>();
  const [tokenContract, setTokenContract] = useState<ethers.Contract | undefined>();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();

  const { data: tokenAddress } = useQuery('token-contract-address', () =>
    axios.get('http://localhost:3001/token/contract-address').then(res => res.data),
  );

  useEffect(() => {
    if (tokenAddress) {
      import('contract/artifacts/contracts/ERC20Votes.sol/MyToken.json').then(tokenJson => {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const contract = new ethers.Contract(tokenAddress, tokenJson.abi, provider);

        setProvider(provider);
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

          updateProps(address);
          setStatus('connected');
        }

        break;
      }
      case 'connected': {
        clearProps();
        setStatus('disconnected');
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleAccountsChanged = async (newAddress: object) => {
    updateProps(newAddress.toString());
  };

  const handleChainChanged = () => {
    clearProps();
    setStatus('disconnected');
  };

  const updateProps = (address: string) => {
    getBalance(address);
    getTokenBalance(address);
    getVotingPower(address);
    setAddress(address);
  };

  const clearProps = () => {
    setAddress('');
    setBalance(undefined);
    setVotingPower('');
    setTokenBalance(undefined);
  };

  const delegateVotes = async (toAddress: string) => {
    if (provider && tokenContract) {
      const signer = provider.getSigner();
      const tx = await tokenContract.connect(signer).delegateVotes(toAddress);
      const txReceipt = tx.wait();
      console.log(txReceipt);
    }
  };

  const getBalance = async (accAddress: string) => {
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [accAddress, 'latest'],
    });

    setBalance(ethers.utils.formatEther(balance));
  };

  const getTokenBalance = async (accAddress: string) => {
    if (tokenContract) {
      const tokenBalanceBN = await tokenContract.balanceOf(accAddress);
      setTokenBalance(Number(ethers.utils.formatEther(tokenBalanceBN)));
    }
  };

  const getVotingPower = async (address: string) => {
    if (tokenContract) {
      const votingPower = ethers.utils.formatEther(await tokenContract.getVotes(address));
      setVotingPower(votingPower);
    }
  };

  return [
    { status, address, tokenAddress, tokenContract, balance, tokenBalance, provider, votingPower },
    { handleConnect, getTokenBalance, getVotingPower },
  ] as const;
};

export default useMetamask;
