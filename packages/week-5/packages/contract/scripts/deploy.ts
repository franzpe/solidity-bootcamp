import { ethers } from 'hardhat';

const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1;

async function main() {
  const contractFactory = await ethers.getContractFactory('Lottery');
  const contract = await contractFactory.deploy(
    'LotteryToken',
    'LT0',
    TOKEN_RATIO,
    ethers.utils.parseEther(BET_PRICE.toFixed(18)),
    ethers.utils.parseEther(BET_FEE.toFixed(18)),
  );
  await contract.deployed();
  const dt = await contract.deployTransaction.wait();

  console.log('Gas used: ', dt.gasUsed);
  console.log(`Contract has been deployed at address: ${contract.address}`);
}

main().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
