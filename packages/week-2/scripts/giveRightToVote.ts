import { ethers } from 'hardhat';
import { Ballot__factory } from '../typechain-types';

const main = async () => {
  const args = process.argv;

  const [ballotAddress, voter] = args.slice(2);

  if (!ballotAddress || !voter) throw new Error('Missing parameters: ballotAddress or voter');

  const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');

  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  const ballotContractFactory = new Ballot__factory(signer);
  const ballot = ballotContractFactory.attach(ballotAddress);

  const txRecepit = await (await ballot.giveRightToVote(voter, { gasLimit: 500000 })).wait();

  console.log(`Right to vote was granted for ${voter}`);
  console.log(txRecepit);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
