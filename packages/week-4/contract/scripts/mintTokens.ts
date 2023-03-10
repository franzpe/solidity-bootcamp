import { ethers } from 'hardhat';
import { MyToken__factory } from '../typechain-types';

const main = async () => {
  const [tokenAddress, to, amount] = process.argv.slice(2);

  if (!tokenAddress || !to || !amount)
    throw new Error('Missing parameters: tokenAddress or destinationAddress or amount');

  const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');

  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  const myTokenFactory = new MyToken__factory(signer);
  const myTokenContract = myTokenFactory.attach(tokenAddress);

  const parsedAmount = ethers.utils.parseEther(amount);

  const txReceipt = await (await myTokenContract.mint(to, parsedAmount)).wait();

  console.log(`${parsedAmount} tokens have been minted for address ${to}`);
  console.log(txReceipt);
};

main().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
