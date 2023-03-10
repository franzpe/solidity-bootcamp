import * as dotenv from 'dotenv';

import { task } from 'hardhat/config';
import { MyToken__factory } from '../../typechain-types';

dotenv.config();

const deployTask = task('deploy-token', 'Deploy MyToken contract to goerli testnet', async (taskArgs, hre) => {
  const provider = new hre.ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');

  const wallet = new hre.ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  const balance = await signer.getBalance();
  console.log(`Wallet balance: ${balance} Wei`);

  console.log('Deploying MyToken contract');
  console.log('Proposals: ');

  const myTokenContract = new MyToken__factory(signer);

  console.log('Deploying contract ...');
  const ballotContract = await myTokenContract.deploy();
  const deployTxReceipt = await ballotContract.deployTransaction.wait();

  console.log(`The token contract was deployed at the address ${ballotContract.address}`);
  console.log({ deployTxReceipt });
});

export default deployTask;
