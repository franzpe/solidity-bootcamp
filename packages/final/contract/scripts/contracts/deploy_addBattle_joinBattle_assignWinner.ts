import { ethers } from "hardhat";
import * as NFTMetadata from "../../scripts/NFTStorage/JSONs/NftStorageMetadataDir.json";

const URI_: string = NFTMetadata.CID + "/metadata/{id}.json";
const maxNftId: number = 40;

const zeroAddr = ethers.utils.hexlify(ethers.utils.hexZeroPad("0x", 20))
const GOLD: number = 10;
const GoldId: number = 0;
const NFTid: number = 1;
const NFTid2: number = 2;
const nftIdBytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(NFTid), 32);
const nftId2Bytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(NFTid2), 32);
const currentTS = Math.floor(Date.now() / 1000);
const days: number = 1;
const stTS = currentTS;
const endTS = currentTS + days*24*60*60;

function generateRange(start: number, end: number): number[] {
    const range: number[] = [];
  
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  
    return range;
}

function onesArray(length: number): number[] {
    var onesArray: number[] = [];
    for (let i = 0; i < length; i++) {
      onesArray.push(1);
    }
    return onesArray;
}

async function main() {
    const [deployer, otherUser, anotherUser, proxiesAdmin] = await ethers.getSigners();
    console.log(`\nGame and GameTokens contracts deployer is ${deployer.address}`);
    console.log(`GameProxy and GameTokensProxy contracts admin is ${proxiesAdmin.address}`);
    console.log(`player 1 is ${otherUser.address}`);
    console.log(`player 2 is ${anotherUser.address}\n`);

    // GameTokens contract deployment
    const gameTokensContractFactory = await ethers.getContractFactory("GameTokens");
    const gameTokensContract = await gameTokensContractFactory.deploy();
    await gameTokensContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data

    // Game contract deployment
    const gameContractFactory = await ethers.getContractFactory("Game");
    const gameContract = await gameContractFactory.deploy();
    await gameContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data

    // GameToken Proxy contract deployment
    const gameTokensProxyContractFactory = await ethers.getContractFactory("GameProxy");
    let gtInitABI = ["function initialize(uint256 maxNftId_, string memory uri_)"];
    let gtInitIface = new ethers.utils.Interface(gtInitABI);
    const gtInitData = gtInitIface.encodeFunctionData("initialize", [ maxNftId, URI_ ]);
    const gameTokensProxyContract = await gameTokensProxyContractFactory.deploy(gameTokensContract.address, proxiesAdmin.address, gtInitData);
    await gameTokensProxyContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
    console.log(`GameTokens Proxy is deployed at ${gameTokensProxyContract.address} with deployed and initialized implementation contract at ${gameTokensContract.address}\n`);
    // To interact with the proxy using GameTokens ABI
    const gameTokensContractUsingProxy = await ethers.getContractAt("GameTokens", gameTokensProxyContract.address);

    // Game Proxy contract deployment
    const gameProxyContractFactory = await ethers.getContractFactory("GameProxy");
    let gInitABI = ["function initialize(address gameTokensAddr_)"];
    let gInitIface = new ethers.utils.Interface(gInitABI);
    const gInitData = gInitIface.encodeFunctionData("initialize", [ gameTokensProxyContract.address ]);
    const gameProxyContract = await gameProxyContractFactory.deploy(gameContract.address, proxiesAdmin.address, gInitData);
    console.log(`Game Proxy is deployed at ${gameProxyContract.address} with deployed and initialized implementation contract at ${gameContract.address}\n`);
    // To interact with the proxy using Game ABI
    const gameContractUsingProxy = await ethers.getContractAt("Game", gameProxyContract.address);

    // BATTLE
    const msgHash = ethers.utils.keccak256(nftIdBytes);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    const deployerMsgHashSignature = await deployer.signMessage(msgHashBytes);
    const deployerMsgHash2Signature = await deployer.signMessage(ethers.utils.arrayify(ethers.utils.keccak256(nftId2Bytes)));

    // Mint Gold to gameProxyContract.address
    // const GoldAmountToMint: ethers.BigNumber = ethers.BigNumber.from(10**10);
    const GoldAmountToMint = ethers.BigNumber.from(10**10);
    gameTokensContractUsingProxy.mint(gameProxyContract.address, GoldId, GoldAmountToMint, "0x");
    const initGameContractGoldBalance = await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, GoldId);

    // Mint all NFTids to gameProxyContract.address
    const NFTids: number[] = generateRange(1, maxNftId);
    const NFTamounts: number[] = onesArray(maxNftId);
    gameTokensContractUsingProxy.mintBatch(gameProxyContract.address, NFTids, NFTamounts, "0x")

    // Add battle
    await gameContractUsingProxy.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
    let battleId = (await gameContractUsingProxy.getBattleId()).toNumber()-1;

    // Users added and joinng the battle
    await gameContractUsingProxy.addUser(otherUser.address);
    await gameContractUsingProxy.connect(otherUser).joinBattle(battleId);
    await gameContractUsingProxy.addUser(anotherUser.address);
    await gameContractUsingProxy.connect(anotherUser).joinBattle(battleId);
    
    // winner is assigned and prize is transferred
    await gameContractUsingProxy.assignWinner(battleId, anotherUser.address, NFTid, deployerMsgHashSignature);
    console.log(`${anotherUser.address} is a winner and has ${await gameTokensContractUsingProxy.balanceOf(anotherUser.address, GoldId)} of Gold`);
    console.log(`${anotherUser.address} is a winner and has ${await gameTokensContractUsingProxy.balanceOf(anotherUser.address, NFTid)} of nftId=${NFTid}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});