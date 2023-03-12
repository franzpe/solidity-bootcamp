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
  const [ballotContract, setBallotContract] = useState<ethers.Contract | undefined>();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();

  const { data: tokenAddress } = useQuery('token-contract-address', () =>
    axios.get('http://localhost:3001/token/contract-address').then(res => res.data),
  );

  const { data: ballotAddress } = useQuery('ballot-contract-address', () =>
    axios.get('http://localhost:3001/ballot/contract-address').then(res => res.data),
  );

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(ethereum, 'any');
    setProvider(provider);
  }, []);

  useEffect(() => {
    if (!tokenContract && tokenAddress && provider) {
      import('contract/artifacts/contracts/ERC20Votes.sol/MyToken.json').then(tokenJson => {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const contract = new ethers.Contract(tokenAddress, tokenJson.abi, provider);
        setTokenContract(contract);
      });
    }
  }, [provider, tokenAddress]);

  useEffect(() => {
    if (!ballotContract && ballotAddress && provider) {
      import('contract/artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json').then(ballotJson => {
        const contract = new ethers.Contract(ballotAddress, ballotJson.abi, provider);
        setBallotContract(contract);
      });
    }
  }, [provider, ballotAddress]);

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
    {
      status,
      address,
      tokenAddress,
      tokenContract,
      ballotContract,
      balance,
      tokenBalance,
      provider,
      votingPower,
      ballotAddress,
    },
    { handleConnect, getTokenBalance, getVotingPower },
  ] as const;
};

export default useMetamask;
