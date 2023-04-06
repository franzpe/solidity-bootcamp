import * as readline from 'readline';
import { ethers } from "hardhat";
import { GameTokens } from "../../typechain-types";
import * as NFTMetadata from "../../scripts/NFTStorage/JSONs/NftStorageMetadataDir.json";

const URI_: string = NFTMetadata.CID + "/metadata/{id}.json";
console.log("URI_:", URI_);

async function deployGameTokens() {
    const [deployer, otherUser] = await ethers.getSigners();
    const gameTokensContractFactory = await ethers.getContractFactory("GameTokens");
    let gameTokensContract = await gameTokensContractFactory.deploy(URI_);
    await gameTokensContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
    console.log(`contract deployed to ${gameTokensContract.address} by ${deployer.address}`);
}

async function main() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      "Select operation: \n Options: \n [1]: Deploy GameTokens contract \n [2]: Deploy GameTokens contract and assign MINTER_ROLE\n [3]: Message signature \n [4]: Random from a sealed seed \n [5]: Random from block hash plus a sealed seed \n [6]: Random from randao \n",
      async (answer) => {
        console.log(`Selected: ${answer}`);
        const option = Number(answer);
        switch (option) {
          case 1:
            // blockHashRandomness();
            console.log("deployment");
            await deployGameTokens();
            break;
        //   case 2:
        //     tossCoin();
        //     break;
        //   case 3:
        //     signature();
        //     break;
        //   case 4:
        //     sealedSeed();
        //     break;
        //   case 5:
        //     randomSealedSeed();
        //     break;
        //   case 6:
        //     randao();
        //     break;
          default:
            console.log("Invalid");
            break;
        }
        rl.close();
      }
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});