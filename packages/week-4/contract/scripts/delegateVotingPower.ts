import { ethers } from 'hardhat';
import { MyToken__factory } from '../typechain-types';

const main = async () => {
  let [tokenAddress, to] = process.argv.slice(2);

  if (!tokenAddress) throw new Error('Missing parameters: tokenAddress');

  const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');

  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  to = to || signer.address;

  const myTokenFactory = new MyToken__factory(signer);
  const myTokenContract = myTokenFactory.attach(tokenAddress);

  const txReceipt = await (await myTokenContract.delegate(to)).wait();

  console.log(`Voting power has been self delegated to account ${to}`);

  const votingPower = ethers.utils.formatEther(await myTokenContract.getVotes(to));
  console.log(`Account ${to} has ${votingPower}`);

  console.log(txReceipt);
};

main().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
