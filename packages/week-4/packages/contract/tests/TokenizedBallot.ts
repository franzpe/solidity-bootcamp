import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { TokenizedBallot__factory, MyToken, MyToken__factory, TokenizedBallot } from '../typechain-types';

// Game voting proposals
const TEST_PROPOSALS = ['Counter-Strike 1.6', 'Counter-Strike: Source', 'Counter-Strike: GO'];
const TEST_MINT_VALUE = ethers.utils.parseEther('100');

describe('Tokenized Ballot', async () => {
  let ballotContract: TokenizedBallot;
  let myTokenContract: MyToken;
  let deployer: SignerWithAddress,
    account1: SignerWithAddress,
    account2: SignerWithAddress,
    account3: SignerWithAddress;
  let targetBlockNumber: BigNumber;

  beforeEach(async () => {
    [deployer, account1, account2, account3] = await ethers.getSigners();

    const myTokenContractFactory = new MyToken__factory(deployer);
    myTokenContract = await myTokenContractFactory.deploy();
    await myTokenContract.deployed();
  });

  describe('when token contract is deployed', async () => {
    it('deployer has correct roles', async () => {
      expect(await myTokenContract.hasRole(myTokenContract.MINTER_ROLE(), deployer.address)).to.be.true;
    });
  });

  describe('when a users purchase an ERC20 token', async () => {
    beforeEach(async () => {
      // Mint tokens for users and delegate voting power
      const mintTx1 = await myTokenContract.mint(account1.address, TEST_MINT_VALUE);
      await mintTx1.wait();
      const delegateTx1 = await myTokenContract.connect(account1).delegate(account1.address);
      await delegateTx1.wait();

      const mintTx2 = await myTokenContract.mint(account2.address, TEST_MINT_VALUE);
      await mintTx2.wait();
      const delegateTx2 = await myTokenContract.connect(account2).delegate(account2.address);
      await delegateTx2.wait();

      // Account3 doesn't delegate his voting power
      const mintTx3 = await myTokenContract.mint(account3.address, TEST_MINT_VALUE);
      await mintTx3.wait();
    });

    it('gives the correct amount of tokens', async () => {
      expect(await myTokenContract.balanceOf(account1.address)).to.be.eq(TEST_MINT_VALUE);
      expect(await myTokenContract.balanceOf(account2.address)).to.be.eq(TEST_MINT_VALUE);
      expect(await myTokenContract.balanceOf(account3.address)).to.be.eq(TEST_MINT_VALUE);
    });

    it('have delegated voting rights', async () => {
      expect(await myTokenContract.getVotes(account1.address)).to.be.eq(TEST_MINT_VALUE);
      expect(await myTokenContract.getVotes(account2.address)).to.be.eq(TEST_MINT_VALUE);
      expect(await myTokenContract.getVotes(account3.address)).to.be.eq(0);
    });

    describe('when ballot is nnounced (deployed)', async () => {
      beforeEach(async () => {
        const ballotContractFactory = new TokenizedBallot__factory(deployer);
        targetBlockNumber = BigNumber.from((await ethers.provider.getBlock('latest')).number);
        ballotContract = await ballotContractFactory.deploy(
          TEST_PROPOSALS.map(prop => ethers.utils.formatBytes32String(prop)),
          myTokenContract.address,
          targetBlockNumber,
        );
      });

      it('has the provided proposals', async () => {
        for (let i = 0; i < TEST_PROPOSALS.length; i++) {
          expect(ethers.utils.parseBytes32String((await ballotContract.proposals(i)).name)).to.be.eq(
            TEST_PROPOSALS[i],
          );
        }
      });

      it('has correct count of proposals', async () => {
        expect(await ballotContract.proposalsLength()).to.be.eq(TEST_PROPOSALS.length);
      });

      it('has zero votes for all proposals', async () => {
        for (let i = 0; i < TEST_PROPOSALS.length; i++) {
          expect((await ballotContract.proposals(i)).voteCount).to.be.eq(0);
        }
      });

      it('uses a valid ERC20 as payment token', async () => {
        const tokenAddress = await ballotContract.tokenContract();
        const tokenFactory = new MyToken__factory(deployer);
        const tokenContractUsedInBallot = tokenFactory.attach(tokenAddress);

        await expect(tokenContractUsedInBallot.totalSupply()).to.not.be.reverted;
        await expect(tokenContractUsedInBallot.balanceOf(account1.address)).to.not.be.reverted;
      });

      it('Users have voting rights', async () => {
        expect(await ballotContract.votingPower(account1.address)).to.be.eq(TEST_MINT_VALUE);
        expect(await ballotContract.votingPower(account2.address)).to.be.eq(TEST_MINT_VALUE);
      });

      it('User 3 have zero voting rights', async () => {
        expect(await ballotContract.votingPower(account3.address)).to.be.eq(0);
      });

      describe('When the voter casts votes', async () => {
        beforeEach(async () => {
          // Account 1 votes
          const voteTx1 = await ballotContract.connect(account1).vote(0, TEST_MINT_VALUE);
          await voteTx1.wait();

          // Account 2 votes
          const voteTx2 = await ballotContract.connect(account2).vote(0, TEST_MINT_VALUE.div(2));
          await voteTx2.wait();
          const voteTx3 = await ballotContract.connect(account2).vote(1, TEST_MINT_VALUE.div(2));
          await voteTx3.wait();
        });

        it('should register votes', async () => {
          const proposal1 = await ballotContract.proposals(0);
          const proposal2 = await ballotContract.proposals(1);

          expect(proposal1.voteCount).to.be.eq(ethers.utils.parseEther('150'));
          expect(proposal2.voteCount).to.be.eq(TEST_MINT_VALUE.div(2));
        });

        it('should revert vote', async () => {
          await expect(ballotContract.connect(account1).vote(0, TEST_MINT_VALUE)).to.be.reverted;
          await expect(ballotContract.connect(account3).vote(0, TEST_MINT_VALUE)).to.be.reverted;
        });

        it('should deduct voting power', async () => {
          const votingPower1 = await ballotContract.votingPower(account1.address);
          const votingPower2 = await ballotContract.votingPower(account2.address);

          expect(votingPower1).to.be.eq(0);
          expect(votingPower2).to.be.eq(0);
        });

        describe('When the result is queried', async () => {
          it('should give correct winner', async () => {
            expect(ethers.utils.parseBytes32String(await ballotContract.winnerName())).to.eq(TEST_PROPOSALS[0]);
          });
        });
      });
    });
  });
});
