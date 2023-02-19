import { ethers } from 'hardhat';

async function main() {
  const [deployer, sideDeployer] = await ethers.getSigners();
  console.log(`Deploying the contract with address: ${deployer.address}`);

  const HelloWorldFactory = await ethers.getContractFactory('HelloWorld');
  const helloWorld = await HelloWorldFactory.deploy();

  await helloWorld.deployed();

  console.log(`Contract HelloWorld deployed to adress: ${helloWorld.address}`);

  console.log(`\nDeploying the side contract with address: ${sideDeployer.address}`);

  const SideHelloWorldFactory = await ethers.getContractFactory('SideHelloWorld');
  const sideHelloWorld = await SideHelloWorldFactory.connect(sideDeployer).deploy();

  await sideHelloWorld.deployed();

  console.log(`Contract SideHelloWorld deployed to adress: ${sideHelloWorld.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
