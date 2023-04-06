import { ethers } from "hardhat";
import * as NFTMetadata from "../../../scripts/NFTStorage/JSONs/NftStorageMetadataDir.json";

const URI_: string = NFTMetadata.CID + "/metadata/{id}.json";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`deployer is ${deployer.address}`);

    // deploy
    const gameTokensContractFactory = await ethers.getContractFactory("GameTokens");
    let gameTokensContract = await gameTokensContractFactory.deploy(URI_);
    await gameTokensContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
    console.log(`contract deployed to ${gameTokensContract.address}`);
    console.log(`contract URI is ${await gameTokensContract.uri(0)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});