import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import ConnectWalletBtn from './components/ConnectWalletBtn';
import useMetamask from './hooks/useMetamask';

import './App.css';

function App() {
  const [{ status, address, balance, tokenBalance }, { handleConnect, getTokenBalance }] = useMetamask();
  const [requestedTokens, setRequestedTokens] = useState<number>(2);

  const { isLoading, isSuccess, isError, mutateAsync } = useMutation(
    (body: { amount: number; address: string }) => {
      return axios.post('http://localhost:3001/token/request-tokens', body);
    },
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutateAsync({ address, amount: requestedTokens }).then(() => getTokenBalance(address));
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
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
