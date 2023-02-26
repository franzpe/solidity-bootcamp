import { ethers } from 'ethers';
import { Ballot__factory } from '../typechain-types';
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const args = process.argv;

  const [ballotAddress, delegateAddress] = args.slice(2);

  if (!ballotAddress || !delegateAddress) throw new Error('Missing parameters: ballotAddress or delegate address');

  const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');
  
  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  const ballotContractFactory = new Ballot__factory(signer);
  const ballot = ballotContractFactory.attach(ballotAddress);

  const txRecepit = await (await ballot.delegate(delegateAddress, { gasLimit: 500000 })).wait();

  console.log(`Delegated vote to: ${delegateAddress}`);
  console.log(txRecepit);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
