import { Badge, Button, Card, Container, Grid, Input, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';
import { ethers } from 'ethers';
import { FormEvent, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import './App.css';
import ConnectWalletBtn from './components/ConnectWalletBtn';
import useMetamask from './hooks/useMetamask';

type Proposal = {
  name: string;
  voteCount: number;
};

function App() {
  const [
    {
      status,
      address,
      balance,
      tokenBalance,
      tokenContract,
      provider,
      votingPower,
      ballotAddress,
      ballotContract,
    },
    { handleConnect, getTokenBalance, getVotingPower },
  ] = useMetamask();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [requestedTokens, setRequestedTokens] = useState<number>(2);
  const [delegateTo, setDelegateTo] = useState<string>('');
  const [isDelegating, setIsDelegating] = useState<boolean>(false);

  const [vote, setVote] = useState<{ proposal: number; amount: string }>({ proposal: 0, amount: '2' });
  const [isVoting, setIsVoting] = useState(false);
  const [winningProposal, setWinningProposal] = useState<number | undefined>();
  const [showResults, setShowResults] = useState(false);
  const [ballotVotingPower, setBallotVotingPower] = useState<string>('');

  const { isLoading, isSuccess, isError, mutateAsync } = useMutation(
    (body: { amount: number; address: string }) => {
      return axios.post('http://localhost:3001/token/request-tokens', body);
    },
  );

  useEffect(() => {
    if (ballotContract) {
      getProposals();

      if (status === 'connected') {
        getBallotVotingPower();
      }
    }
  }, [status, ballotContract]);

  const getProposals = async () => {
    const proposalsLength = await ballotContract!.proposalsLength();
    const proposalsTemp: Proposal[] = [];

    for (let i = 0; i < proposalsLength; i++) {
      const proposal = await ballotContract!.proposals(i);
      proposalsTemp.push({
        name: ethers.utils.parseBytes32String(proposal.name),
        voteCount: Number(ethers.utils.formatEther(proposal.voteCount)),
      });
    }

    setProposals(proposalsTemp);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('called');

    mutateAsync({ address, amount: requestedTokens }).then(() => {
      getTokenBalance(address);
      getVotingPower(address);
    });
  };

  const getBallotVotingPower = async () => {
    const ballotVotingPower = await ballotContract!.votingPower(address);
    setBallotVotingPower(ethers.utils.formatEther(ballotVotingPower));
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

  const handleVoteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsVoting(true);
    const signer = provider!.getSigner();
    const tx = await ballotContract!.connect(signer).vote(vote.proposal, ethers.utils.parseEther(vote.amount));
    const txReceipt = await tx.wait();
    setIsVoting(false);

    getBallotVotingPower();

    console.log(txReceipt);
  };

  const queryResults = async () => {
    getProposals();

    const winner = await ballotContract?.winningProposal();
    setWinningProposal(Number(winner));
    setShowResults(true);
  };

  return (
    <Container display="flex" justify="center" alignItems="center">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Text h1>Counter-Strike Ballot</Text>
        <Text size="$xl">Vote for best Counter-Strike edition of all times</Text>
        <Spacer y={2} />
        <Grid.Container gap={2}>
          <Grid>
            <Card css={{ mw: '500px' }}>
              <Card.Header>
                <Text b>Ballot Information</Text>
              </Card.Header>
              <Card.Divider />

              <Card.Body>
                <Text size="$md" css={{ marginBottom: '12px' }}>
                  Address: <Text i>{ballotAddress}</Text>
                </Text>
                <Text>You can vote for:</Text>
                {proposals.map((p, idx) => (
                  <Text i key={p.name}>
                    {p.name} ({idx})
                  </Text>
                ))}
              </Card.Body>
            </Card>
          </Grid>
          <Grid>
            <Card css={{ mw: '500px' }}>
              <Card.Header css={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text b>Wallet&nbsp;</Text>
                {status === 'connected' && (
                  <Text b color="success">
                    {' '}
                    connected
                  </Text>
                )}
              </Card.Header>
              <Card.Divider />
              {status === 'connected' && (
                <>
                  <Card.Body>
                    <Text>
                      Connected to address: <Text i>{address}</Text>
                    </Text>
                    <Text>
                      Balance: <Text i>{balance} ETH</Text>
                    </Text>
                    <Text>
                      Balance: <Text i>{tokenBalance} MTK</Text>
                    </Text>
                    <Text>
                      Voting power: <Text i>{ballotVotingPower}</Text>
                    </Text>
                  </Card.Body>
                  <Card.Divider />
                </>
              )}
              <Card.Footer>
                <ConnectWalletBtn onClick={handleConnect} status={status} />
              </Card.Footer>
            </Card>
          </Grid>
        </Grid.Container>
        <Spacer y={1} />
        {status === 'connected' && (
          <Card>
            <Card.Header>
              <Text b>Actions</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <Grid.Container gap={2}>
                  <Grid>
                    <Input
                      type="number"
                      labelRight="MTK"
                      min={2}
                      label="Request Tokens"
                      value={requestedTokens}
                      color={isSuccess ? 'success' : isError ? 'error' : ''}
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        setRequestedTokens(Number(e.currentTarget.value))
                      }
                      helperText={
                        isSuccess
                          ? 'Tokens have been minted successfully'
                          : isError
                          ? 'Error occured! yaiks :('
                          : ''
                      }
                    />
                  </Grid>
                  <Grid css={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button size="md" disabled={isLoading} type="submit">
                      {!isLoading ? 'Request tokens' : 'Processing request...'}
                    </Button>
                  </Grid>
                </Grid.Container>
              </form>
              <form onSubmit={handleDelegateSubmit}>
                <Grid.Container gap={2}>
                  <Grid>
                    <Input
                      type="string"
                      labelLeft="address"
                      min={2}
                      label="Delegate votes to:"
                      onChange={(e: React.FormEvent<HTMLInputElement>) => setDelegateTo(e.currentTarget.value)}
                      helperText={
                        isSuccess
                          ? 'Tokens have been minted successfully'
                          : isError
                          ? 'Error occured! yaiks :('
                          : ''
                      }
                      value={delegateTo}
                    />
                  </Grid>
                  <Grid css={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button type="submit" disabled={isDelegating}>
                      {!isDelegating ? 'Delegate' : 'Delegating...'}
                    </Button>
                  </Grid>
                </Grid.Container>
              </form>

              <form onSubmit={handleVoteSubmit}>
                <Grid.Container gap={2}>
                  <Grid>
                    <Input
                      type="number"
                      label="vote"
                      placeholder="Proposal number"
                      min={0}
                      fullWidth
                      labelLeft="Proposal"
                      max={proposals.length}
                      step={1}
                      value={vote.proposal}
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        setVote(v => ({ ...v, proposal: Number(e.currentTarget.value) }))
                      }
                    />
                  </Grid>
                  <Grid css={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Input
                      type="number"
                      min={2}
                      step={1}
                      max={Number(votingPower)}
                      labelLeft="Amount"
                      placeholder="Number of votes"
                      value={vote.amount}
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        setVote(v => ({ ...v, amount: e.currentTarget.value }))
                      }
                    />
                  </Grid>
                  <Grid css={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button type="submit" disabled={isVoting}>
                      {!isVoting ? 'Vote' : 'Voting...'}
                    </Button>
                  </Grid>
                  <Grid css={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button bordered color="gradient" onClick={queryResults} shadow>
                      Results
                    </Button>
                  </Grid>
                </Grid.Container>
              </form>
            </Card.Body>
            {showResults && (
              <>
                <Card.Divider />
                <Card.Footer>
                  <Grid.Container gap={1}>
                    {proposals.map((p, idx) => (
                      <Grid key={p.name}>
                        <Badge
                          size="md"
                          color={idx === winningProposal ? 'success' : undefined}
                          css={{ paddingleft: '16px', paddingRight: '16px' }}
                        >
                          {p.name} - {p.voteCount} votes
                        </Badge>
                      </Grid>
                    ))}
                  </Grid.Container>
                </Card.Footer>
              </>
            )}
          </Card>
        )}
      </div>
    </Container>
  );
}

export default App;
