import { ethers } from "hardhat";
import * as NFTMetadata from "../../../scripts/NFTStorage/JSONs/NftStorageMetadataDir.json";

const URI_: string = NFTMetadata.CID + "/metadata/{id}.json";

async function main() {
    const [deployer, otherUser] = await ethers.getSigners();
    console.log(`deployer is ${deployer.address}`);
    console.log(`otherUser is ${otherUser.address}`);

    // deploy
    const gameTokensContractFactory = await ethers.getContractFactory("GameTokens");
    let gameTokensContract = await gameTokensContractFactory.deploy(URI_);
    await gameTokensContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
    console.log(`contract deployed to ${gameTokensContract.address} by ${deployer.address}`);
    console.log(`contract URI is ${await gameTokensContract.uri(0)}`);

    // mintBatch
    let id1OldBalance = await gameTokensContract.balanceOf(otherUser.address, 1);
    let id2OldBalance = await gameTokensContract.balanceOf(otherUser.address, 2);
    await gameTokensContract.mintBatch(otherUser.address, [1, 2], [1, 1], "0x");
    let id1NewBalance = await gameTokensContract.balanceOf(otherUser.address, 1);
    let id2NewBalance = await gameTokensContract.balanceOf(otherUser.address, 2);
    console.log(`${otherUser.address}'s tokenId 1 balance changed from ${id1OldBalance} to ${id1NewBalance}`);
    console.log(`${otherUser.address}'s tokenId 2 balance changed from ${id2OldBalance} to ${id2NewBalance}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});