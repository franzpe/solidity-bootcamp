import { expect } from "chai";
import { ethers } from "hardhat"
import { Ballot } from "../typechain-types"

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToByte32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

describe("Ballot", function () {
    let ballotContract: Ballot;
    beforeEach(async function () {
        const ballotContractFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotContractFactory.deploy(
            convertStringArrayToByte32(PROPOSALS)
        );
        await ballotContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
    });
    describe("when the contract is deployed", function () {
        it("has the provided proposals", async function () {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposals = await ballotContract.proposals(index);
                expect(ethers.utils.parseBytes32String(proposals.name)).to.eq(
                    PROPOSALS[index]
                );
            }
        });
        it("sets the deployer address as chairperson",async function () {
            const signers = await ethers.getSigners();
            const deployer = signers[0].address;
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.eq(deployer);
        });

        it("has zero proposals", async function () {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposals = await ballotContract.proposals(index);
                expect(proposals.voteCount).to.eq(0);
            }
        });

        // it("has zero proposals", async function () {
        //     for (let index = 0; index < PROPOSALS.length; index++) {
        //         const proposals = await ballotContract.proposals(index);
        //         expect(proposals.voteCount).to.eq(0);
        //     }
        // });
    })
})
