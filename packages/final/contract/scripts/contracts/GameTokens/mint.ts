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

    // mint
    let oldBalance = await gameTokensContract.balanceOf(otherUser.address, 1);
    await gameTokensContract.mint(otherUser.address, 1, 1, "0x");
    let newBalance = await gameTokensContract.balanceOf(otherUser.address, 1);
    console.log(`${otherUser.address}'s balance changed from ${oldBalance} to ${newBalance}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});