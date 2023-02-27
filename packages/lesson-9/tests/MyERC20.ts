// import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { MyERC20 } from '../typechain-types';

describe('basic', async () => {
  let myTokenContract: MyERC20;
  let signers: SignerWithAddress[];

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const myTokenContractFactory = await ethers.getContractFactory('MyERC20');
    myTokenContract = await myTokenContractFactory.deploy();
    await myTokenContract.deployTransaction.wait();
    await (await myTokenContract.mint(signers[0].address, 1000)).wait();
  });

  it('should have zero total supply at deployment', async () => {
    const totalSypply = await myTokenContract.totalSupply();
    expect(totalSypply).to.eq(0);
  });
});
