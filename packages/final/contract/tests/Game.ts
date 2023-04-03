import { expect } from "chai";
import { ethers } from "hardhat";
import { Game, GameTokens } from "../typechain-types";
import NFTMetadata from "../scripts/NFTStorage/JSONs/NftStorageMetadataDir";

const URI_: string = NFTMetadata.CID + "/metadata/{id}.json";
console.log("URI_:", URI_);

const GOLD: number = 10;
const NFTid: number = 1;
const currentTS = Math.floor(Date.now() / 1000);
const days: number = 1;
const stTS = currentTS;
const endTS = currentTS + days*24*60*60;

describe("Test Game contract", function () {
    let gameContract: Game;
    let deployer: ethers.Signer;
    let otherUser: ethers.Signer;
    let anotherUser: ethers.Signer;
    beforeEach(async function () {
        [deployer, otherUser, anotherUser] = await ethers.getSigners();
        const gameContractFactory = await ethers.getContractFactory("Game");
        gameContract = await gameContractFactory.deploy();
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

        it("game controller can add a battle, and it is not possible to get non-existing battle", async function () {
            let curBattleId = await gameContract.getBattleId();
            // console.log(`current battleId is ${curBattleId}`);

            let battleId = await gameContract.addBattle(GOLD, NFTid, stTS, endTS);
            expect(battleId.value).to.be.eq(curBattleId);
            await expect(gameContract.addBattle(GOLD, NFTid, endTS, stTS)).to.be.revertedWith("Game: startTime must be smaller than endTime");
            await expect(gameContract.addBattle(GOLD, NFTid, 0, 1)).to.be.revertedWith("Game: endTime must be larger than block.timestamp");

            let newBattleId = await gameContract.getBattleId();
            // console.log(`new battleId is ${newBattleId}`);

            const battle = await gameContract.getBattle(0);
            expect(battle.prize.goldAmount).to.eq(GOLD);
            expect(battle.prize.nftId).to.eq(NFTid);
            expect(battle.startTime).to.eq(stTS);
            expect(battle.endTime).to.eq(endTS);

            await expect(gameContract.getBattle(1)).to.be.revertedWith("Game: requested battleId does not exist");
        });

        it("only existing users can join a battle, limitted to 2 players", async function () {
            let battleId = await gameContract.addBattle(GOLD, NFTid, stTS, endTS);

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
            let battleId = await gameContract.addBattle(GOLD, NFTid, stTS, endTS);

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
