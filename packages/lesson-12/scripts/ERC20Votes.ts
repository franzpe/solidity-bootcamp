import { ethers } from 'hardhat';
import { MyToken__factory } from '../typechain-types';

const MINT_VALUE = ethers.utils.parseEther('10');

const main = async () => {
  // Deploy contract
  const [deployer, account1, account2] = await ethers.getSigners();
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployTransactionReceipt = await contract.deployTransaction.wait();
  console.log(`The tokenized votes contract was deployed at the block ${deployTransactionReceipt.blockNumber}`);

  // Mint some tokens
  const mintTx = await contract.mint(account1.address, MINT_VALUE);
  const mintTxRecepit = await mintTx.wait();
  console.log(`Tokens minted for ${account1.address} at block ${mintTxRecepit.blockNumber}`);

  const tokenBalanceAccount1 = await contract.balanceOf(account1.address);
  console.log(`Account1 has a balance of ${ethers.utils.formatEther(tokenBalanceAccount1)} Vote tokens`);

  // Check the voting power
  let votePowerAccount1 = await contract.getVotes(account1.address);
  console.log(`Account1 has a vote power of ${ethers.utils.formatEther(votePowerAccount1)} units`);

  // Self delegate
  const delegateTx = await contract.connect(account1).delegate(account1.address);
  const delegateTxRecepit = await delegateTx.wait();
  console.log(
    `Tokens delegated from ${account1.address} for ${account1.address} at block ${
      delegateTxRecepit.blockNumber
    }, for a cost of ${
      delegateTxRecepit.gasUsed
    } gas units, totalling a tx cost of ${delegateTxRecepit.gasUsed.mul(
      delegateTxRecepit.effectiveGasPrice,
    )} Wei (${ethers.utils.formatEther(delegateTxRecepit.gasUsed.mul(delegateTxRecepit.effectiveGasPrice))} ETH)`,
  );

  // Check the voting power
  votePowerAccount1 = await contract.getVotes(account1.address);
  console.log(`Account1 has now a vote power of ${ethers.utils.formatEther(votePowerAccount1)} units`);

  // Mint some more tokens
  const mintTx2 = await contract.mint(account2.address, MINT_VALUE);
  const mintTxRecepit2 = await mintTx2.wait();
  console.log(`Tokens minted for account2 ${account2.address} at block ${mintTxRecepit2.blockNumber}`);

  // What block I am at?
  const currentBlock = await ethers.provider.getBlock('latest');
  console.log(`The current block number is ${currentBlock.number}`);

  // Check the historic voting power
  votePowerAccount1 = await contract.getPastVotes(account1.address, currentBlock.number - 1);
  console.log(
    `Account1 had a vote power of ${ethers.utils.formatEther(votePowerAccount1)} units, at block ${
      currentBlock.number - 1
    }`,
  );
  votePowerAccount1 = await contract.getPastVotes(account1.address, currentBlock.number - 2);
  console.log(
    `Account1 had a vote power of ${ethers.utils.formatEther(votePowerAccount1)} units, at block ${
      currentBlock.number - 2
    }`,
  );
};

main().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
