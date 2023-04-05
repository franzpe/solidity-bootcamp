import { expect } from "chai";
import { ethers } from "hardhat";
import { Game, GameTokens } from "../typechain-types";
import NFTMetadata from "../scripts/NFTStorage/JSONs/NftStorageMetadataDir";

const URI_: string = NFTMetadata.CID + "/metadata/{id}.json";
const maxNftId: number = 40;
console.log("URI_:", URI_);

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

describe("Test Game and GameToken contracts", function () {
    let gameContract: Game;
    let gameTokensContract: GameTokens;
    let deployer: ethers.Signer;
    let otherUser: ethers.Signer;
    let anotherUser: ethers.Signer;
    let msg: any;
    let msgHash: string;
    let msgHashBytes: any;
    let deployerMsgHashSignature: any;
    let deployerMsgHash2Signature: any;
    beforeEach(async function () {
        [deployer, otherUser, anotherUser] = await ethers.getSigners();
        msg = nftIdBytes;
        msgHash = ethers.utils.keccak256(nftIdBytes);
        msgHashBytes = ethers.utils.arrayify(msgHash);
        deployerMsgHashSignature = await deployer.signMessage(msgHashBytes);
        deployerMsgHash2Signature = await deployer.signMessage(ethers.utils.arrayify(ethers.utils.keccak256(nftId2Bytes)));

        const gameTokensContractFactory = await ethers.getContractFactory("GameTokens");
        gameTokensContract = await gameTokensContractFactory.deploy(maxNftId, URI_);
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

    // describe("Game: checking user functionalities", function () {
    //     it("game controller can add a user", async function () {
    //         expect(await gameContract.checkNotJoined(otherUser.address)).to.eq(true);
    //         await gameContract.addUser(otherUser.address);
    //         expect(await gameContract.checkNotJoined(otherUser.address)).to.eq(false);
    //     });

    //     it("game controller cannot add already existing user, reverting with expected err message", async function () {
    //         await gameContract.addUser(otherUser.address);
    //         await expect(gameContract.addUser(otherUser.address)).to.be.revertedWith("Game: user already exists");
    //     });
    // })

    // describe("Game: checking battle functionalities", function () {
    //     it("getBattle reverts when no battles have been added", async function () {
    //         await expect(gameContract.getBattle(0)).to.be.revertedWith("Game: battles have not been added yet");
    //     });

    //     it("verify message hash using Signature", async function () {
    //         // The hash we wish to sign and verify
    //         let messageHash = ethers.utils.id("1");

    //         // Note: messageHash is a string, that is 66-bytes long, to sign the
    //         //       binary value, we must convert it to the 32 byte Array that
    //         //       the string represents
    //         let messageHashBytes = ethers.utils.arrayify(messageHash);

    //         // Sign the binary data
    //         let flatSig = await deployer.signMessage(messageHashBytes);

    //         // Call the verifyHash function
    //         let recovered = await gameContract.verifyMsg(messageHash, flatSig);
    //         // console.log("recovered", recovered);
    //         // console.log("deployer", deployer.address);
    //         expect(recovered).to.be.eq(deployer.address);

    //     });

    //     it("verify NftId using Signature", async function () {
    //         // console.log(`nftIdBytes: ${nftIdBytes}`);
    //         // console.log(`msg: ${msg}`);
    //         // console.log(`msgHash: ${msgHash}`);
    //         // console.log(`msgHashBytes: ${msgHashBytes}`);
    //         // console.log(`deployerMsgHashSignature: ${deployerMsgHashSignature}`);

    //         // Sign the binary data
    //         let flatSig = await deployer.signMessage(msgHashBytes);

    //         // Call the verifyHash function
    //         let recovered = await gameContract.verifyId(nftIdBytes, flatSig);
    //         expect(recovered).to.be.eq(deployer.address);

    //     });

    //     it("game controller can add a battle, and it is not possible to get non-existing battle", async function () {
    //         // console.log(`nftIdBytes: ${nftIdBytes}`);
    //         // console.log(`msg: ${msg}`);
    //         // console.log(`msgHash: ${msgHash}`);
    //         // console.log(`msgHashBytes: ${msgHashBytes}`);
    //         // console.log(`deployerMsgHashSignature: ${deployerMsgHashSignature}`);

    //         await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
    //         expect((await gameContract.getBattleId()).toNumber()).to.be.eq(1);
    //         await expect(gameContract.addBattle(GOLD, endTS, stTS, deployerMsgHashSignature)).to.be.revertedWith("Game: startTime must be smaller than endTime");
    //         await expect(gameContract.addBattle(GOLD, 0, 1, deployerMsgHashSignature)).to.be.revertedWith("Game: endTime must be larger than block.timestamp");

    //         const battle = await gameContract.getBattle((await gameContract.getBattleId()).toNumber()-1);
    //         expect(battle.prize.goldAmount).to.eq(GOLD);
    //         // console.log(`battle.prize.nftIdCommittedBytes: ${battle.prize.nftIdCommittedBytes}`, typeof battle.prize.nftIdCommittedBytes);
    //         // console.log(`deployerMsgHashSignature: ${deployerMsgHashSignature}`, typeof deployerMsgHashSignature);
    //         expect(battle.prize.nftIdCommittedBytes).to.eq(deployerMsgHashSignature.slice(0,10));
    //         expect(battle.startTime).to.eq(stTS);
    //         expect(battle.endTime).to.eq(endTS);
    //         expect(battle.controller).to.eq(deployer.address);

    //         await expect(gameContract.getBattle(1)).to.be.revertedWith("Game: requested battleId does not exist");
    //     });

    //     it("only a single game controller can add battles to prevent potential nftIds collisions by different game controllers", async function () {
    //         // deployer as a game controller, assigning 1st battle
    //         await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
    //         // deployer as a game controller, assigning 2nd battle (with same Signature)
    //         await expect(gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature)).to.be.revertedWith("Game: you have already assigned nftId to another battle");
    //         // deployer as a game controller, assigning 2nd battle (with new Signature)
    //         await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHash2Signature);

    //         const battle = await gameContract.getBattle((await gameContract.getBattleId()).toNumber()-1);
    //         expect(battle.prize.nftIdCommittedBytes).to.eq(deployerMsgHash2Signature.slice(0,10));
    //     });

    //     it("only existing users can join a battle, limitted to 2 players", async function () {
    //         await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
    //         let battleId = (await gameContract.getBattleId()).toNumber()-1;

    //         await gameContract.addUser(deployer.address);
    //         await gameContract.joinBattle(battleId);
    //         await expect(gameContract.joinBattle(battleId)).to.be.revertedWith("Game: you have already joined the battle");

    //         await expect(gameContract.connect(otherUser).joinBattle(battleId)).to.be.revertedWith("Game: only existing users can join the battle");
    //         await gameContract.addUser(otherUser.address);
    //         await gameContract.connect(otherUser).joinBattle(battleId);
    //         await expect(gameContract.connect(otherUser).joinBattle(battleId)).to.be.revertedWith("Game: you have already joined the battle");

    //         const battle = await gameContract.getBattle(battleId);
    //         expect(battle.players[0]).to.eq(deployer.address);
    //         expect(battle.players[1]).to.eq(otherUser.address);

    //         await gameContract.addUser(anotherUser.address);
    //         await expect(gameContract.connect(anotherUser).joinBattle(battleId)).to.be.revertedWith("Game: the battle already has 2 users assigned to play");
    //     });

    //     it("set joinBattleCost>0 and check joining reverts when the value=0", async function () {
    //         await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
    //         let battleId = (await gameContract.getBattleId()).toNumber()-1;

    //         await gameContract.addUser(deployer.address);
    //         await gameContract.setJoinBattleCost(1);
    //         await expect(gameContract.joinBattle(battleId)).to.be.revertedWith("Game: user must pay value>=joinBattleCost, use getJoinBattleCost to check the cost");

    //         await gameContract.setJoinBattleCost(0);
    //         await gameContract.joinBattle(battleId);

    //         const battle = await gameContract.getBattle(battleId);
    //         expect(battle.players[0]).to.eq(deployer.address);
    //     });
    // })

    // describe("Game: checking season functionalities", function () {
    //     it("game controller can add a season, and it is not possible to get non-existing season", async function () {
    //         let curSeasonId = await gameContract.getSeasonId();
    //         // console.log(`current SeasonId is ${curSeasonId}`);

    //         let seasonId = await gameContract.addSeason(0, 9, stTS, endTS);
    //         expect(seasonId.value).to.be.eq(curSeasonId);
    //         await expect(gameContract.addSeason(0, 9, endTS, stTS)).to.be.revertedWith("Game: startTime must be smaller than endTime");
    //         await expect(gameContract.addSeason(0, 9, 0, 1)).to.be.revertedWith("Game: endTime must be larger than block.timestamp");

    //         let newSeasonId = await gameContract.getSeasonId();
    //         // console.log(`new weasonId is ${newSeasonId}`);

    //         const season = await gameContract.getSeason(seasonId.value);
    //         // console.log(`season: ${season}`);
    //         expect(season.firstBattle).to.eq(0);
    //         expect(season.lastBattle).to.eq(9);
    //         expect(season.startTime).to.eq(stTS);
    //         expect(season.endTime).to.eq(endTS);

    //         await expect(gameContract.getSeason(1)).to.be.revertedWith("Game: requested seasonId does not exist");
    //     });
    // })

    describe("GameTokens assignments to Game contarct address", function () {
        it("GameTokens deployer can mint Gold to Game contract address and emit GameTokens and Game events", async function () {
            const GoldAmountToMint: ethers.BigNumber = ethers.BigNumber.from(10**10);

            let oldBalanceOfGameContract = await gameTokensContract.balanceOf(gameContract.address, GoldId);
            expect(oldBalanceOfGameContract).to.eq(0);

            await expect(gameTokensContract.mint(gameContract.address, GoldId, GoldAmountToMint, "0x"))
                .to.emit(gameTokensContract, "TransferSingle")
                .withArgs(deployer.address, zeroAddr, gameContract.address, GoldId, GoldAmountToMint);
            expect(
                Object.entries(gameContract.interface.events).some(
                    ([k, v]: any) => v.name === "GoldReceived"
                )
            ).to.be.equal(true);

            let newBalanceOfGameContract = await gameTokensContract.balanceOf(gameContract.address, GoldId);
            expect(newBalanceOfGameContract).to.eq(GoldAmountToMint);
        });

        it("GameTokens deployer can mint NFTs to Game contract address and emit GameTokens and Game events", async function () {
            let NFTid1 = 1;
            let NFTid2 = 2;

            expect(await gameTokensContract.balanceOf(gameContract.address, NFTid1)).to.eq(0);
            expect(await gameTokensContract.balanceOf(gameContract.address, NFTid2)).to.eq(0);

            await expect(gameTokensContract.mint(gameContract.address, NFTid1, 1, "0x"))
                .to.emit(gameTokensContract, "TransferSingle")
                .withArgs(deployer.address, zeroAddr, gameContract.address, NFTid1, 1);
            expect(
                Object.entries(gameContract.interface.events).some(
                    ([k, v]: any) => v.name === "NFTReceived"
                )
            ).to.be.equal(true);
    
            await expect(gameTokensContract.mint(gameContract.address, NFTid2, 1, "0x"))
                .to.emit(gameTokensContract, "TransferSingle")
                .withArgs(deployer.address, zeroAddr, gameContract.address, NFTid2, 1);

            expect(await gameTokensContract.balanceOf(gameContract.address, NFTid1)).to.eq(1);
            expect(await gameTokensContract.balanceOf(gameContract.address, NFTid2)).to.eq(1);
        });

        it("GameTokens deployer can mintBatch NFTs and emit GameTokens and Game events", async function () {
            let NFTids = [1, 2];
            let NFTamounts = [1, 1];

            expect(await gameTokensContract.balanceOf(gameContract.address, NFTids[0])).to.eq(0);
            expect(await gameTokensContract.balanceOf(gameContract.address, NFTids[1])).to.eq(0);

            await expect(gameTokensContract.mintBatch(gameContract.address, NFTids, NFTamounts, "0x"))
                .to.emit(gameTokensContract, "TransferBatch")
                .withArgs(deployer.address, zeroAddr, gameContract.address, NFTids, NFTamounts);
            expect(
                Object.entries(gameContract.interface.events).some(
                    ([k, v]: any) => v.name === "NFTReceived"
                )
            ).to.be.equal(true);
    
            expect(await gameTokensContract.balanceOf(gameContract.address, NFTids[0])).to.eq(1);
            expect(await gameTokensContract.balanceOf(gameContract.address, NFTids[1])).to.eq(1);
        });

        it("GameTokens deployer cannot mint/mintBatch NFTs with nftId>maxNftId", async function () {
            const NFTids: number[] = generateRange(1, maxNftId+1);
            const NFTamounts: number[] = onesArray(maxNftId+1);

            await expect(gameTokensContract.mint(gameContract.address, maxNftId+1, 1, "0x")).to.be.revertedWith("GameTokens: nftId cannot be larger than maxNftId");
            await expect(gameTokensContract.mintBatch(gameContract.address, NFTids, NFTamounts, "0x")).to.be.revertedWith("GameTokens: nftId cannot be larger than maxNftId");
            expect(await gameTokensContract.balanceOf(gameContract.address, NFTids[0])).to.eq(0);
        });
    })

    describe("Game winner revelation and transfer of Prize (GameTokens Gold and NFT)", function () {
        it("GameTokens deployer can mintBatch NFTs to Game contract address", async function () {
            // Mint Gold to gameContract.address
            const GoldAmountToMint: ethers.BigNumber = ethers.BigNumber.from(10**10);
            gameTokensContract.mint(gameContract.address, GoldId, GoldAmountToMint, "0x");
            const initGameContractGoldBalance = await gameTokensContract.balanceOf(gameContract.address, GoldId);

            // Mint all NFTids to gameContract.address
            const NFTids: number[] = generateRange(1, maxNftId);
            const NFTamounts: number[] = onesArray(maxNftId);
            gameTokensContract.mintBatch(gameContract.address, NFTids, NFTamounts, "0x")

            // Add battle
            await gameContract.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
            let battleId = (await gameContract.getBattleId()).toNumber()-1;

            // Users added and joinng the battle
            await gameContract.addUser(otherUser.address);
            await gameContract.connect(otherUser).joinBattle(battleId);
            await gameContract.addUser(anotherUser.address);
            await gameContract.connect(anotherUser).joinBattle(battleId);
            
            // winner is assigned and prize is transferred
            // - try to assign winner using different controller from the one who actuall created the battel
            let game_controller_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_CONTROLLER_ROLE"));
            await gameContract.grantRole(game_controller_role, otherUser.address);
            await expect(gameContract.connect(otherUser).assignWinner(battleId, anotherUser.address, NFTid, deployerMsgHashSignature)).to.be.revertedWith("Game: assigning NFT to a winner can be done only by controller who added the battle");
            // - try to assign winner who is not one of the players
            await expect(gameContract.assignWinner(battleId, deployer.address, NFTid, deployerMsgHashSignature)).to.be.revertedWith("Game: winner must be one of the players assigned for the battle");
            // - try passing wrong signature
            await expect(gameContract.assignWinner(battleId, anotherUser.address, NFTid, deployerMsgHash2Signature)).to.be.revertedWith("Game: initial signature bytes are different from committed ones");
            // - try passing wrong id
            await expect(gameContract.assignWinner(battleId, anotherUser.address, NFTid+1, deployerMsgHashSignature)).to.be.revertedWith("Game: nftId could not be verified against signature");
            // - pass correctly
            await gameContract.assignWinner(battleId, anotherUser.address, NFTid, deployerMsgHashSignature);
            expect(await gameTokensContract.balanceOf(gameContract.address, GoldId)).to.eq(initGameContractGoldBalance-GOLD);
            expect(await gameTokensContract.balanceOf(gameContract.address, NFTid)).to.eq(0);
            expect(await gameTokensContract.balanceOf(anotherUser.address, GoldId)).to.eq(GOLD);
            expect(await gameTokensContract.balanceOf(anotherUser.address, NFTid)).to.eq(1);
        });
    })

})
