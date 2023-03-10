import ConnectWalletBtn from './components/ConnectWalletBtn';
import useMetamask from './hooks/useMetamask';

import './App.css';

function App() {
  const [{ status, address, balance }, handleConnect] = useMetamask();

  return (
    <div className="App">
      {status === 'connected' && (
        <p>
          Connected to address: {address} with balance {balance} ETH
        </p>
      )}
      <ConnectWalletBtn onClick={handleConnect} status={status}>
        Connect Wallet
      </ConnectWalletBtn>
    </div>
  );
}

export default App;
