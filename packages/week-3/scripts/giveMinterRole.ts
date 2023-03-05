import { ethers } from 'hardhat';
import { MyToken__factory } from '../typechain-types';

const main = async () => {
  const [tokenAddress, to] = process.argv.slice(2);

  if (!tokenAddress || !to) throw new Error('Missing parameters: tokenAddress or destinationAddress');

  const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');

  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  const myTokenFactory = new MyToken__factory(signer);
  const myTokenContract = myTokenFactory.attach(tokenAddress);

  const txReceipt = await (await myTokenContract.grantRole(await myTokenContract.MINTER_ROLE(), to)).wait();

  console.log(`Minter role has been given to account ${to}`);
  console.log(txReceipt);
};

main().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
