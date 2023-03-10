import ConnectWalletBtn from './components/ConnectWalletBtn';
import useMetamask from './hooks/useMetamask';

import './App.css';

function App() {
  const [status, address, handleConnect] = useMetamask();

  return (
    <div className="App">
      <p>Connected to address: {address}</p>
      <ConnectWalletBtn onClick={handleConnect} status={status}>
        Connect Wallet
      </ConnectWalletBtn>
    </div>
  );
}

export default App;
