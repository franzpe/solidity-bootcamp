import { ethers } from 'hardhat';
import { Gas } from '../typechain-types';

const TEST2_VALUE = 1;

async function comparePacing() {
  const gasContractFactory = await ethers.getContractFactory('Gas');
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const testTx1 = await contract.updateNumber(TEST2_VALUE);
  const testTx1Receipt = await testTx1.wait();
  console.log(`Used ${testTx1Receipt.gasUsed} gas units in storage and local reads test function`);
  const testTx2 = await contract.updateNumberOptimized(TEST2_VALUE);
  const testTx2Receipt = await testTx2.wait();
  console.log(`Used ${testTx2Receipt.gasUsed} gas units in optimized state and local reads test function`);
}

comparePacing().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
