import { Container } from '@nextui-org/react';
import './App.css';
import AccountInfo from './components/AccountInfo';
import { Layout } from './components/Layout';
import Lottery from './components/Lottery';
import { useMetamaskContext } from './hooks/MetamaskContext';
import useLottery from './hooks/useLottery';

function App() {
  const { status } = useMetamaskContext();
  const { tokenContract, lotteryContract } = useLottery();

  return (
    <Layout>
      <Container>
        <AccountInfo tokenContract={tokenContract} />
        {status === 'connected' && lotteryContract && <Lottery lotteryContract={lotteryContract} />}
      </Container>
    </Layout>
  );
}

export default App;
