import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const INFURA_API_KEY: any = process.env.INFURA_API_KEY;
const PRIVATE_KEY: any = process.env.PRIVATE_KEY;
const PRIVATE_KEY2: any = process.env.PRIVATE_KEY2;

task("accounts", "Prints the list", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
    console.log(account.getBalance());
  }
})

const config: HardhatUserConfig = {
  paths: { tests: "tests"},
  solidity: "0.8.17",
  networks: {
    hardhat: {
      gas: 30000000
    },
    GOERLI: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY, PRIVATE_KEY2],
    },
  },
};

export default config;
