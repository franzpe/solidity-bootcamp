import { ethers } from 'hardhat';
import { Ballot__factory } from '../typechain-types';

const main = async () => {
  const [tokenAddress] = process.argv.slice(2);

  if (!tokenAddress) throw new Error('Missing parameters: tokenAddress');

  const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');

  const wallet = new ethers.Wallet(privateKey);

  const signer = wallet.connect(provider);

  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = ballotFactory.attach(tokenAddress);

  const winnerIdx = await ballotContract.winningProposal();
  const winner = await ballotContract.proposals(winnerIdx);
  console.log(
    `Winning proposal is ${ethers.utils.parseBytes32String(winner.name)} with ${ethers.utils.formatEther(
      winner.voteCount,
    )} votes.`,
  );

  // Once proposals (array) legth getter is present in contract, this can be removed
  const numOfProposals = 4;

  console.log(`All proposals overview:`);
  for (let i = 0; i < numOfProposals; i++) {
    const proposal = await ballotContract.proposals(i);
    console.log(
      `Proposal ${i + 1}: ${ethers.utils.parseBytes32String(proposal.name)} ended with ${ethers.utils.formatEther(
        proposal.voteCount,
      )} votes.`,
    );
  }
};

main().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
