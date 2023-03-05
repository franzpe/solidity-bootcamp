import { ethers } from 'hardhat';
import { Ballot__factory } from '../typechain-types';

const main = async () => {
  let [tokenAddress, proposalNum, amount] = process.argv.slice(2);

  console.log(tokenAddress);

  if (!tokenAddress || !proposalNum || !amount)
    throw new Error('Missing parameters: tokenAddress or propsalNum or amount');

  const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY2;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');

  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = ballotFactory.attach(tokenAddress);

  const txReceipt = await (await ballotContract.vote(proposalNum, ethers.utils.parseEther(amount))).wait();
  const votingPowerLeft = await ballotContract.votingPower(signer.address);

  console.log(
    `Account ${
      signer.address
    } has voted for proposal num: ${proposalNum} with amount of ${amount} and has ${ethers.utils.formatEther(
      votingPowerLeft,
    )} of voting power left.`,
  );
  console.log(txReceipt);
};

main().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
