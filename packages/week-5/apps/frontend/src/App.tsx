import { Container } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
      />
      <Container>
        <AccountInfo tokenContract={tokenContract} lotteryContract={lotteryContract} />
        {status === 'connected' && lotteryContract && <Lottery lotteryContract={lotteryContract} />}
      </Container>
    </Layout>
  );
}

export default App;
