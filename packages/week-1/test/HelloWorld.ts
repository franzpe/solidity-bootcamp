import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe('Hello World contract', function () {
  async function deployContract() {
    const [deployer, otherAccount] = await ethers.getSigners();

    const HelloWorldFactory = await ethers.getContractFactory('HelloWorld');
    const helloWorld = await HelloWorldFactory.deploy();

    await helloWorld.deployed();

    return { helloWorld, deployer, otherAccount };
  }

  describe('Deployment', async function () {
    it('Should deploy contract with the right owner', async function () {
      const { helloWorld, deployer } = await loadFixture(deployContract);

      expect(await helloWorld.owner()).to.equal(deployer.address);
    });
  });

  describe('Ownership manipulation', async function () {
    it('Should transfer ownership', async function () {
      const { helloWorld, deployer, otherAccount } = await loadFixture(deployContract);

      await helloWorld.connect(deployer).transferOwnership(otherAccount.address);

      expect(await helloWorld.owner()).to.equal(otherAccount.address);
    });

    it('Should fail transfer ownership by other account to itself', async function () {
      const { helloWorld, deployer, otherAccount } = await loadFixture(deployContract);

      await expect(helloWorld.connect(otherAccount).transferOwnership(otherAccount.address)).to.rejectedWith(
        'Caller is not the owner',
      );
    });
  });

  describe('Text manipulation', async function () {
    it('Should return Hello World String', async function () {
      const { helloWorld } = await loadFixture(deployContract);

      expect(await helloWorld.helloWorld()).to.equal('Hello World');
    });

    it('Should set text to - Hi from team 8', async function () {
      const { helloWorld, deployer } = await loadFixture(deployContract);

      await helloWorld.connect(deployer).setText('Hi from team 8');

      expect(await helloWorld.helloWorld()).to.equal('Hi from team 8');
    });

    it('Should fail setting text by other account than owner', async function () {
      const { helloWorld, otherAccount } = await loadFixture(deployContract);

      await expect(helloWorld.connect(otherAccount).setText('Hi from team 8')).to.rejectedWith(
        'Caller is not the owner',
      );
    });
  });
});
