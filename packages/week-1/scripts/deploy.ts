import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying the contract with address: ${deployer.address}`);

  const HelloWorldFactory = await ethers.getContractFactory('HelloWorld');
  const helloWorld = await HelloWorldFactory.deploy();

  await helloWorld.deployed();

  console.log(`Contract HelloWorld deployed to adress: ${helloWorld.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
