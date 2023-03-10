import { ethers } from 'ethers';
import { Ballot__factory } from '../typechain-types';
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const args = process.argv;

  const [ballotAddress, proposalNum] = args.slice(2);

  if (!ballotAddress || !proposalNum) throw new Error('Missing parameters: ballotAddress or proposal number');

  const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');
  
  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  const ballotContractFactory = new Ballot__factory(signer);
  const ballot = ballotContractFactory.attach(ballotAddress);

  const txRecepit = await (await ballot.vote(proposalNum, { gasLimit: 500000 })).wait();

  console.log(`Cast vote for proposal num: ${proposalNum}`);
  console.log(txRecepit);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
