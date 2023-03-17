import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(`Address: ${account.address}, balance: ${await account.getBalance()}`);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
  networks: { hardhat: { hardfork: 'merge' } },
  paths: { tests: 'tests' },
};

export default config;
