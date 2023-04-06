require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

const { ALCHEMY_URL, GAME_MANAGER_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: '0.7.3',
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: ALCHEMY_URL,
      accounts: [`${GAME_MANAGER_PRIVATE_KEY}`],
    },
  },
};
