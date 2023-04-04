import { expect } from "chai";
import { ethers } from "hardhat";
import { Game, GameTokens } from "../typechain-types";
import NFTMetadata from "../scripts/NFTStorage/JSONs/NftStorageMetadataDir";

const URI_: string = NFTMetadata.CID + "/metadata/{id}.json";
console.log("URI_:", URI_);

const GOLD: number = 10;
const NFTid: number = 1;
const nftIdBytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(NFTid), 32)
const currentTS = Math.floor(Date.now() / 1000);
const days: number = 1;
const stTS = currentTS;
const endTS = currentTS + days*24*60*60;

describe("Test Game contract", function () {
    let gameContract: Game;
    let gameTokensContract: GameTokens;
    let deployer: ethers.Signer;
    let otherUser: ethers.Signer;
    let anotherUser: ethers.Signer;
    let deployerPrvKey: any;
    let deployerPrvKeyHash: string;
    let msg: any;
    let msgHash: string;
    let msgHashBytes: any;
    let deployerMsgHashSignature: any;
    beforeEach(async function () {
        [deployer, otherUser, anotherUser] = await ethers.getSigners();
        // deployerPrvKey = await deployer.getPrivateKey();
        // console.log("deployerPrvKey:", deployerPrvKey);
        // deployerPrvKeyHash = ethers.utils.id(String(deployer.privateKey));
        // msg = String(NFTid);
        // msgHash = ethers.utils.id(String(NFTid));
        msg = nftIdBytes;
        msgHash = ethers.utils.keccak256(nftIdBytes);
        msgHashBytes = ethers.utils.arrayify(msgHash);
        deployerMsgHashSignature = await deployer.signMessage(msgHashBytes);

        const gameTokensContractFactory = await ethers.getContractFactory("GameTokens");
        gameTokensContract = await gameTokensContractFactory.deploy(URI_);
        await gameTokensContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data

        const gameContractFactory = await ethers.getContractFactory("Game");
        gameContract = await gameContractFactory.deploy(gameTokensContract.address);
        await gameContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
        // console.log(`contract deployed to ${gameTokensContract.address} by ${deployer.address}`);
    });

    // describe("checking ACCESS_CONTROL", function () {
    //     it("deployer has admin role", async function () {
    //         let admin_role = ethers.utils.hexlify(ethers.utils.hexZeroPad("0x", 32));
    //         expect(await gameContract.hasRole(admin_role, deployer.address)).to.eq(true);
    //     });

    //     it("deployer has game controller role", async function () {
    //         let game_controller_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_CONTROLLER_ROLE"));
    //         expect(await gameContract.hasRole(game_controller_role, deployer.address)).to.eq(true);
    //     });

    //     it("deployer can grant game controller role", async function () {
    //         let game_controller_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_CONTROLLER_ROLE"));
    //         await gameContract.grantRole(game_controller_role, otherUser.address);
    //         expect(await gameContract.hasRole(game_controller_role, otherUser.address)).to.eq(true);
    //     });
    // })

    describe("checking user functionalities", function () {
        it("game controller can add a user", async function () {
            expect(await gameContract.checkNotJoined(otherUser.address)).to.eq(true);
            await gameContract.addUser(otherUser.address);
            expect(await gameContract.checkNotJoined(otherUser.address)).to.eq(false);
        });

        it("game controller cannot add already existing user, reverting with expected err message", async function () {
            await gameContract.addUser(otherUser.address);
            await expect(gameContract.addUser(otherUser.address)).to.be.revertedWith("Game: user already exists");
        });
    })

    describe("checking battle functionalities", function () {
        it("getBattle reverts when no battles have been added", async function () {
            await expect(gameContract.getBattle(0)).to.be.revertedWith("Game: battles have not been added yet");
        });

        it("verify message hash using Signature", async function () {
            // The hash we wish to sign and verify
            let messageHash = ethers.utils.id("1");

            // Note: messageHash is a string, that is 66-bytes long, to sign the
            //       binary value, we must convert it to the 32 byte Array that
            //       the string represents
            let messageHashBytes = ethers.utils.arrayify(messageHash);

            // Sign the binary data
            let flatSig = await deployer.signMessage(messageHashBytes);

            // Call the verifyHash function
            let recovered = await gameContract.verifyHash(messageHash, flatSig);
            // console.log("recovered", recovered);
            // console.log("deployer", deployer.address);
            expect(recovered).to.be.eq(deployer.address);

        });

        it("verify NftId using Signature", async function () {
            // console.log(`nftIdBytes: ${nftIdBytes}`);
            // console.log(`msg: ${msg}`);
            // console.log(`msgHash: ${msgHash}`);
            // console.log(`msgHashBytes: ${msgHashBytes}`);
            // console.log(`deployerMsgHashSignature: ${deployerMsgHashSignature}`);

            // Sign the binary data
            let flatSig = await deployer.signMessage(msgHashBytes);

            // Call the verifyHash function
            let recovered = await gameContract.verifyId(nftIdBytes, flatSig);
            expect(recovered).to.be.eq(deployer.address);

        });

        it("game controller can add a battle, and it is not possible to get non-existing battle", async function () {
            // console.log(`nftIdBytes: ${nftIdBytes}`);
            // console.log(`msg: ${msg}`);
            // console.log(`msgHash: ${msgHash}`);
            // console.log(`msgHashBytes: ${msgHashBytes}`);
            // console.log(`deployerMsgHashSignature: ${deployerMsgHashSignature}`);

            let curBattleId = await gameContract.getBattleId();
            // console.log(`current battleId is ${curBattleId}`);

            let battleId = await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
            expect(battleId.value).to.be.eq(curBattleId);
            await expect(gameContract.addBattle(GOLD, endTS, stTS, deployerMsgHashSignature)).to.be.revertedWith("Game: startTime must be smaller than endTime");
            await expect(gameContract.addBattle(GOLD, 0, 1, deployerMsgHashSignature)).to.be.revertedWith("Game: endTime must be larger than block.timestamp");

            let newBattleId = await gameContract.getBattleId();
            // console.log(`new battleId is ${newBattleId}`);

            const battle = await gameContract.getBattle(0);
            expect(battle.prize.goldAmount).to.eq(GOLD);
            // console.log(`battle.prize.nftIdCommittedBytes: ${battle.prize.nftIdCommittedBytes}`, typeof battle.prize.nftIdCommittedBytes);
            // console.log(`deployerMsgHashSignature: ${deployerMsgHashSignature}`, typeof deployerMsgHashSignature);
            expect(battle.prize.nftIdCommittedBytes).to.eq(deployerMsgHashSignature.slice(0,10));
            expect(battle.startTime).to.eq(stTS);
            expect(battle.endTime).to.eq(endTS);

            await expect(gameContract.getBattle(1)).to.be.revertedWith("Game: requested battleId does not exist");
        });

        it("only existing users can join a battle, limitted to 2 players", async function () {
            let battleId = await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);

            await gameContract.addUser(deployer.address);
            await gameContract.joinBattle(battleId.value);
            await expect(gameContract.joinBattle(battleId.value)).to.be.revertedWith("Game: you have already joined the battle");

            await expect(gameContract.connect(otherUser).joinBattle(battleId.value)).to.be.revertedWith("Game: only existing users can join the battle");
            await gameContract.addUser(otherUser.address);
            await gameContract.connect(otherUser).joinBattle(battleId.value);
            await expect(gameContract.connect(otherUser).joinBattle(battleId.value)).to.be.revertedWith("Game: you have already joined the battle");

            const battle = await gameContract.getBattle(battleId.value);
            expect(battle.players[0]).to.eq(deployer.address);
            expect(battle.players[1]).to.eq(otherUser.address);

            await gameContract.addUser(anotherUser.address);
            await expect(gameContract.connect(anotherUser).joinBattle(battleId.value)).to.be.revertedWith("Game: the battle already has 2 users assigned to play");
        });

        it("set joinBattleCost>0 condition and check joining reverts when the condition is not met", async function () {
            let battleId = await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);

            await gameContract.addUser(deployer.address);
            await gameContract.setJoinBattleCost(1);
            await expect(gameContract.joinBattle(battleId.value)).to.be.revertedWith("Game: user must pay value>=joinBattleCost, use getJoinBattleCost to check the cost");

            await gameContract.setJoinBattleCost(0);
            await gameContract.joinBattle(battleId.value);

            const battle = await gameContract.getBattle(battleId.value);
            expect(battle.players[0]).to.eq(deployer.address);
        });
    })

    describe("checking season functionalities", function () {
        it("game controller can add a season, and it is not possible to get non-existing season", async function () {
            let curSeasonId = await gameContract.getSeasonId();
            // console.log(`current SeasonId is ${curSeasonId}`);

            let seasonId = await gameContract.addSeason(0, 9, stTS, endTS);
            expect(seasonId.value).to.be.eq(curSeasonId);
            await expect(gameContract.addSeason(0, 9, endTS, stTS)).to.be.revertedWith("Game: startTime must be smaller than endTime");
            await expect(gameContract.addSeason(0, 9, 0, 1)).to.be.revertedWith("Game: endTime must be larger than block.timestamp");

            let newSeasonId = await gameContract.getSeasonId();
            // console.log(`new weasonId is ${newSeasonId}`);

            const season = await gameContract.getSeason(seasonId.value);
            // console.log(`season: ${season}`);
            expect(season.firstBattle).to.eq(0);
            expect(season.lastBattle).to.eq(9);
            expect(season.startTime).to.eq(stTS);
            expect(season.endTime).to.eq(endTS);

            await expect(gameContract.getSeason(1)).to.be.revertedWith("Game: requested seasonId does not exist");
        });
    })

})
