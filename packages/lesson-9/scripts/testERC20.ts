import { ethers } from 'hardhat';

const main = async () => {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  const myTokenContractFactory = await ethers.getContractFactory('MyERC20');
  const myTokenContract = await myTokenContractFactory.deploy();
  const deployTxRecepit = await myTokenContract.deployTransaction.wait();

  console.log(
    `The Token Contract was deployed at the address ${myTokenContract.address} at block ${deployTxRecepit.blockNumber}`,
  );

  const contractName = await myTokenContract.name();
  const contractSymbol = await myTokenContract.symbol();
  let totalSypply = await myTokenContract.totalSupply();

  console.log([contractName, contractSymbol, totalSypply].join(', '));

  const mintTx = await myTokenContract.mint(signer.address, 10);
  const mintTxReceipt = await mintTx.wait();
  totalSypply = await myTokenContract.totalSupply();

  console.log([contractName, contractSymbol, totalSypply].join(', '));
};

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
