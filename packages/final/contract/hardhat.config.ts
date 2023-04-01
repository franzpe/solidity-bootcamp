import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

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
};

export default config;
