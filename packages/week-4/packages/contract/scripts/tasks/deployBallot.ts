import * as dotenv from 'dotenv';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { task } from 'hardhat/config';
import { Ballot__factory } from '../../typechain-types';

dotenv.config();

const convertStringArrayToBytes32 = (hre: HardhatRuntimeEnvironment, array: string[]) => {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(hre.ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
};

const deployTask = task(
  'deploy-ballot',
  'Deploy Ballot contract to goerli testnet',
  async (taskArgs: { tokenaddress: string; proposals: string[]; blocknumber?: number }, hre) => {
    const { proposals, tokenaddress, blocknumber } = taskArgs;

    if (proposals.length <= 0) throw new Error('Missing parameters: proposals');

    const provider = new hre.ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0) throw new Error('Missing environment: private key');

    const wallet = new hre.ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet.address}`);

    const signer = wallet.connect(provider);

    const balance = await signer.getBalance();
    console.log(`Wallet balance: ${balance} Wei`);

    console.log('Deploying Tokenized Ballot contract');
    console.log('Proposals: ');
    proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    const ballotContractFactory = new Ballot__factory(signer);

    console.log('Deploying contract ...');

    const blockNumber = blocknumber || (await provider.getBlockNumber());
    const ballotContract = await ballotContractFactory.deploy(
      convertStringArrayToBytes32(hre, proposals),
      tokenaddress,
      blockNumber,
    );
    const deployTxReceipt = await ballotContract.deployTransaction.wait();

    console.log(
      `The Ballot contract was deployed at the address ${ballotContract.address} for block number ${blockNumber}`,
    );
    console.log({ deployTxReceipt });
  },
);

/**
 * Sets unnamed variable length parameters, must be included at the end of the command
 */
deployTask.addParam<string>('tokenaddress').addOptionalParam<number>('blocknumber');
deployTask.addVariadicPositionalParam<string[]>('proposals', 'Proposals names');

export default deployTask;
