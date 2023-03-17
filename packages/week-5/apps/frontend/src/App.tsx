import { Container, Grid, Spacer, Text } from '@nextui-org/react';
import './App.css';
import { Layout } from './components/Layout';

function App() {
  return (
    <Layout>
      <Container display="flex" justify="center" alignItems="center">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Text h1>Lottery of the year</Text>
          <Spacer y={2} />
          <Grid.Container gap={2}>
            {
              // {            <Grid>
              //               <Card css={{ mw: '500px' }}>
              //                 <Card.Header css={{ display: 'flex', justifyContent: 'space-between' }}>
              //                   <Text b>Wallet&nbsp;</Text>
              //                   {status === 'connected' && (
              //                     <Text b color="success">
              //                       {' '}
              //                       connected
              //                     </Text>
              //                   )}
              //                 </Card.Header>
              //                 <Card.Divider />
              //                 {status === 'connected' && (
              //                   <>
              //                     <Card.Body>
              //                       Connected to address: <Text i>{address}</Text>
              //                     </Card.Body>
              //                     <Card.Divider />
              //                   </>
              //                 )}
              //                 <Card.Footer>
              //                   <ConnectWalletBtn onClick={connect} status={status} />
              //                 </Card.Footer>
              //               </Card>
              //             </Grid>
            }
          </Grid.Container>
          <Spacer y={1} />
        </div>
      </Container>
    </Layout>
  );
}

export default App;
