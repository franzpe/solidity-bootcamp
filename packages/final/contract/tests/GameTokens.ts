import { expect } from "chai";
import { ethers } from "hardhat";
import { GameTokens } from "../typechain-types";
import NFTMetadata from "../scripts/NFTStorage/JSONs/NftStorageMetadataDir";

const URI_: string = NFTMetadata.CID + "/metadata/{id}.json";
console.log("URI_:", URI_);

describe("When GameTokens is deployed", function () {
    let gameTokensContract: GameTokens;
    let deployer: ethers.Signer;
    let otherUser: ethers.Signer;
    beforeEach(async function () {
        [deployer, otherUser] = await ethers.getSigners();
        const gameTokensContractFactory = await ethers.getContractFactory("GameTokens");
        gameTokensContract = await gameTokensContractFactory.deploy(URI_);
        await gameTokensContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
        // console.log(`contract deployed to ${gameTokensContract.address} by ${deployer.address}`);
    });

    describe("checking ACCESS_CONTROL", function () {
        it("deployer has admin role", async function () {
            let admin_role = ethers.utils.hexlify(ethers.utils.hexZeroPad("0x", 32));
            expect(await gameTokensContract.hasRole(admin_role, deployer.address)).to.eq(true);
        });

        it("deployer has uri setter role", async function () {
            let uri_setter_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("URI_SETTER_ROLE"));
            expect(await gameTokensContract.hasRole(uri_setter_role, deployer.address)).to.eq(true);
        });

        it("deployer has minter role", async function () {
            let minter_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
            expect(await gameTokensContract.hasRole(minter_role, deployer.address)).to.eq(true);
        });

        it("deployer can grant uri setter role", async function () {
            let uri_setter_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("URI_SETTER_ROLE"));
            await gameTokensContract.grantRole(uri_setter_role, otherUser.address);
            expect(await gameTokensContract.hasRole(uri_setter_role, otherUser.address)).to.eq(true);
        });

        it("deployer can grant minter role", async function () {
            let minter_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
            await gameTokensContract.grantRole(minter_role, otherUser.address);
            expect(await gameTokensContract.hasRole(minter_role, otherUser.address)).to.eq(true);
        });
    })

    describe("checking ERC1155", function () {
        it("has provided URI_", async function () {
            expect(await gameTokensContract.uri(0)).to.eq(URI_);
            console.log(`URI is ${URI_}`);
        });

        it("URI_SETTER_ROLE grantee can change URI", async function () {
            let NEW_URI = "NEW URI";
            await gameTokensContract.setURI(NEW_URI);
            expect(await gameTokensContract.uri(0)).to.eq(NEW_URI);
        });

        it("MINTER_ROLE grantee can mint to an address", async function () {
            let oldBalanceOfOtherUser = await gameTokensContract.balanceOf(otherUser.address, 1)
            expect(oldBalanceOfOtherUser).to.eq(0);
            await gameTokensContract.mint(otherUser.address, 1, 1, "0x");
            let newBalanceOfOtherUser = await gameTokensContract.balanceOf(otherUser.address, 1)
            expect(newBalanceOfOtherUser).to.eq(1);
            // console.log(`balance of other user changed from ${oldBalanceOfOtherUser} to ${newBalanceOfOtherUser}`);
        });

        it("MINTER_ROLE grantee can mint batch to an address", async function () {
            let oldId1BalanceOfOtherUser = await gameTokensContract.balanceOf(otherUser.address, 1)
            let oldId2BalanceOfOtherUser = await gameTokensContract.balanceOf(otherUser.address, 2)
            expect(oldId1BalanceOfOtherUser).to.eq(0);
            expect(oldId2BalanceOfOtherUser).to.eq(0);
            await gameTokensContract.mintBatch(otherUser.address, [1, 2], [1, 1], "0x");
            let newId1BalanceOfOtherUser = await gameTokensContract.balanceOf(otherUser.address, 1);
            let newId2BalanceOfOtherUser = await gameTokensContract.balanceOf(otherUser.address, 2);
            expect(newId1BalanceOfOtherUser).to.eq(1);
            expect(newId2BalanceOfOtherUser).to.eq(1);
            // console.log(`balance of other user changed from ${oldId1BalanceOfOtherUser} to ${newId1BalanceOfOtherUser}`);
        });
    })
})
