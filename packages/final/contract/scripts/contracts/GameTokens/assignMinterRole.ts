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

    // assign minter role
    let minter_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    await gameTokensContract.grantRole(minter_role, otherUser.address);
    console.log(`${otherUser.address} has MINTER_ROLE? ${await gameTokensContract.hasRole(minter_role, otherUser.address)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});