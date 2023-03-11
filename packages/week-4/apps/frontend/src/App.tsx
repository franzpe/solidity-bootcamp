import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import ConnectWalletBtn from './components/ConnectWalletBtn';
import useMetamask from './hooks/useMetamask';

import './App.css';

function App() {
  const [
    { status, address, balance, tokenBalance, tokenContract, provider, votingPower },
    { handleConnect, getTokenBalance, getVotingPower },
  ] = useMetamask();
  const [requestedTokens, setRequestedTokens] = useState<number>(2);
  const [delegateTo, setDelegateTo] = useState<string>('');
  const [isDelegating, setIsDelegating] = useState<boolean>(false);

  const { isLoading, isSuccess, isError, mutateAsync } = useMutation(
    (body: { amount: number; address: string }) => {
      return axios.post('http://localhost:3001/token/request-tokens', body);
    },
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutateAsync({ address, amount: requestedTokens }).then(() => {
      getTokenBalance(address);
      getVotingPower(address);
    });
  };

  const handleDelegateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsDelegating(true);
    const tx = await tokenContract?.connect(provider!.getSigner()).delegate(delegateTo);
    const txReceipt = await tx.wait();
    console.log(txReceipt);
    getVotingPower(address);
    setDelegateTo('');
    setIsDelegating(false);
  };

  return (
    <div className="App">
      <header>
        <ConnectWalletBtn onClick={handleConnect} status={status} />
      </header>
      <main>
        {status === 'connected' && (
          <div>
            <p>Connected to address: {address}</p>
            <p>Balance: {balance} ETH</p>
            <p>Balance: {tokenBalance} MTK</p>
            <p>Voting power: {votingPower}</p>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                min={2}
                value={requestedTokens}
                onChange={e => setRequestedTokens(Number(e.currentTarget.value))}
              />
              <button disabled={isLoading}>{!isLoading ? 'Request tokens' : 'Processing request'}</button>
              {isSuccess && <p>Tokens have been minted successfully</p>}
              {isError && <p>Error occured! yaiks :(</p>}
            </form>
            <form onSubmit={handleDelegateSubmit}>
              <p>Delegate votes to:</p>
              <input
                type="string"
                placeholder="address"
                value={delegateTo}
                onChange={e => setDelegateTo(e.currentTarget.value)}
              />
              <button disabled={isDelegating}>{!isDelegating ? 'Delegate' : 'Delegating...'} </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
