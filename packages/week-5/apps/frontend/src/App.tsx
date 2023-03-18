import { Container } from '@nextui-org/react';
import './App.css';
import AccountInfo from './components/AccountInfo';
import { Layout } from './components/Layout';
import useLottery from './hooks/useLottery';

function App() {
  const { tokenContract } = useLottery();

  return (
    <Layout>
      <Container>
        <AccountInfo tokenContract={tokenContract} />
      </Container>
    </Layout>
  );
}

export default App;
