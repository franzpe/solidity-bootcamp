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
    if (ballotContract && status === 'connected') {
      getProposals();
      getBallotVotingPower();
    }
  }, [status]);

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
    <div className="App">
      <header>
        <ConnectWalletBtn onClick={handleConnect} status={status} />
      </header>
      {status === 'connected' && (
        <main>
          <section>
            <h4>Wallet</h4>
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
          </section>
          <section>
            <h4>Ballot </h4>
            <p>Address: {ballotAddress}</p>
            <ul>
              {proposals.map((p, idx) => (
                <li key={p.name}>
                  {idx} - {p.name}
                </li>
              ))}
            </ul>
            <form onSubmit={handleVoteSubmit}>
              <p>You have {ballotVotingPower} voting power left for this current ballot</p>
              <p>Vote:</p>
              <input
                type="number"
                placeholder="Proposal number"
                min={0}
                max={proposals.length}
                step={1}
                value={vote.proposal}
                onChange={e => setVote(v => ({ ...v, proposal: Number(e.target.value) }))}
              />
              <input
                type="number"
                min={2}
                step={1}
                max={Number(votingPower)}
                placeholder="Number of votes"
                value={vote.amount}
                onChange={e => setVote(v => ({ ...v, amount: e.target.value }))}
              />
              <button disabled={isVoting}>{!isVoting ? 'Vote' : 'Voting...'}</button>
            </form>
            <button onClick={queryResults}>Results</button>
            {showResults && (
              <ul>
                {proposals.map((p, idx) => (
                  <li key={p.name} style={idx === winningProposal ? { fontWeight: 700 } : {}}>
                    {p.name} - {p.voteCount} votes
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
