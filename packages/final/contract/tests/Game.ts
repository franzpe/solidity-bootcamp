import { expect } from "chai";
import { ethers } from "hardhat";
import { GameProxy, Game, GameTokens, GameUpgradeTest } from "../typechain-types";
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
    let gameTokensContract: GameTokens;
    let gameTokensContractUsingProxy: GameTokens;
    let gameTokensProxyContract: GameProxy;
    let gameContract: Game;
    let gameContractUsingProxy: Game;
    let gameProxyContract: GameProxy;
    let gameUpgradeTestContract: GameUpgradeTest;
    let gameUpgradeTestContractUsingProxy: GameUpgradeTest;
    let proxiesAdmin: ethers.Signer;
    let deployer: ethers.Signer;
    let otherUser: ethers.Signer;
    let anotherUser: ethers.Signer;
    let gtInitData: any;
    let gInitData: any;
    let msg: any;
    let msgHash: string;
    let msgHashBytes: any;
    let deployerMsgHashSignature: any;
    let deployerMsgHash2Signature: any;

    beforeEach(async function () {

        [deployer, otherUser, anotherUser, proxiesAdmin] = await ethers.getSigners();
        msg = nftIdBytes;
        msgHash = ethers.utils.keccak256(nftIdBytes);
        msgHashBytes = ethers.utils.arrayify(msgHash);
        deployerMsgHashSignature = await deployer.signMessage(msgHashBytes);
        deployerMsgHash2Signature = await deployer.signMessage(ethers.utils.arrayify(ethers.utils.keccak256(nftId2Bytes)));

        // GameTokens contract deployment
        const gameTokensContractFactory = await ethers.getContractFactory("GameTokens");
        gameTokensContract = await gameTokensContractFactory.deploy();
        await gameTokensContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
        // await gameTokensContract.initialize(maxNftId, URI_);

        // Game contract deployment
        const gameContractFactory = await ethers.getContractFactory("Game");
        gameContract = await gameContractFactory.deploy();
        await gameContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
        // await gameContract.initialize(gameTokensContract.address);

        // GameToken Proxy contract deployment
        const gameTokensProxyContractFactory = await ethers.getContractFactory("GameProxy");
        let gtInitABI = ["function initialize(uint256 maxNftId_, string memory uri_)"];
        let gtInitIface = new ethers.utils.Interface(gtInitABI);
        gtInitData = gtInitIface.encodeFunctionData("initialize", [ maxNftId, URI_ ]);
        // console.log("gtInitData", gtInitData);
        gameTokensProxyContract = await gameTokensProxyContractFactory.deploy(gameTokensContract.address, proxiesAdmin.address, gtInitData);
        // gameTokensProxyContract = await gameTokensProxyContractFactory.deploy(gameTokensContract.address, proxiesAdmin.address, "0x");
        await gameTokensProxyContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
        gameTokensContractUsingProxy = await ethers.getContractAt("GameTokens", gameTokensProxyContract.address);

        // Game Proxy contract deployment
        const gameProxyContractFactory = await ethers.getContractFactory("GameProxy");
        let gInitABI = ["function initialize(address gameTokensAddr_)"];
        let gInitIface = new ethers.utils.Interface(gInitABI);
        gInitData = gInitIface.encodeFunctionData("initialize", [ gameTokensProxyContract.address ]);
        // console.log("gInitData", gInitData);
        gameProxyContract = await gameProxyContractFactory.deploy(gameContract.address, proxiesAdmin.address, gInitData);
        gameContractUsingProxy = await ethers.getContractAt("Game", gameProxyContract.address);

        // Game Upgrad Test contract deployment
        const gameUpgradeTestContractFactory = await ethers.getContractFactory("GameUpgradeTest");
        gameUpgradeTestContract = await gameUpgradeTestContractFactory.deploy();
        await gameUpgradeTestContract.deployTransaction.wait(); // instead of using .deployed(), also helps to get tx data
        gameUpgradeTestContractUsingProxy = await ethers.getContractAt("GameUpgradeTest", gameProxyContract.address);
    });

    describe("checking ACCESS_CONTROL", function () {

        it("deployer has admin role", async function () {
            let admin_role = ethers.utils.hexlify(ethers.utils.hexZeroPad("0x", 32));
            expect(await gameContractUsingProxy.hasRole(admin_role, deployer.address)).to.eq(true);
        });

        it("deployer has game controller role", async function () {
            let game_controller_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_CONTROLLER_ROLE"));
            expect(await gameContractUsingProxy.hasRole(game_controller_role, deployer.address)).to.eq(true);
        });

        it("deployer can grant game controller role", async function () {
            let game_controller_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_CONTROLLER_ROLE"));
            await gameContractUsingProxy.grantRole(game_controller_role, otherUser.address);
            expect(await gameContractUsingProxy.hasRole(game_controller_role, otherUser.address)).to.eq(true);
        });
    })

    describe("checking Proxy functionalities", function () {
        it("proxiesAdmin has admin role, and can assign admin role to another address", async function () {
            // gameTokens
            expect((await gameTokensProxyContract.connect(proxiesAdmin).implementation()).value).to.be.eq(0);
            await expect(gameTokensProxyContract.connect(proxiesAdmin).changeAdmin(deployer.address))
                .to.emit(gameTokensProxyContract, "AdminChanged")
                .withArgs(proxiesAdmin.address, deployer.address);
            await expect(gameTokensProxyContract.connect(deployer).changeAdmin(proxiesAdmin.address))
                .to.emit(gameTokensProxyContract, "AdminChanged")
                .withArgs(deployer.address, proxiesAdmin.address);
            // game
            expect((await gameProxyContract.connect(proxiesAdmin).implementation()).value).to.be.eq(0);
            await expect(gameProxyContract.connect(proxiesAdmin).changeAdmin(deployer.address))
                .to.emit(gameProxyContract, "AdminChanged")
                .withArgs(proxiesAdmin.address, deployer.address);
            await expect(gameProxyContract.connect(deployer).changeAdmin(proxiesAdmin.address))
                .to.emit(gameProxyContract, "AdminChanged")
                .withArgs(deployer.address, proxiesAdmin.address);
        });

        it("can upgrade to new contract implementation, and use new function to get new variable", async function () {
            let NewStateVariable = 1;
            let gNewVarInitABI = ["function setNewStateVariable(uint256 newStateVariable_)"];
            let gNewVarInitIface = new ethers.utils.Interface(gNewVarInitABI);
            let gNewInitInitData = gNewVarInitIface.encodeFunctionData("setNewStateVariable", [ NewStateVariable ]);
    
            await gameProxyContract.connect(proxiesAdmin).upgradeToAndCall(gameUpgradeTestContract.address, gNewInitInitData);
            let statevar = await gameUpgradeTestContractUsingProxy.getNewStateVariable();
            expect(statevar).to.be.eq(NewStateVariable);

        });
    })

    describe("Game: checking user functionalities", function () {

        it("game controller can add a user", async function () {
            expect(await gameContractUsingProxy.checkNotJoined(otherUser.address)).to.eq(true);
            await gameContractUsingProxy.addUser(otherUser.address);
            expect(await gameContractUsingProxy.checkNotJoined(otherUser.address)).to.eq(false);
        });

        it("game controller cannot add already existing user, reverting with expected err message", async function () {
            await gameContractUsingProxy.addUser(otherUser.address);
            await expect(gameContractUsingProxy.addUser(otherUser.address)).to.be.revertedWith("Game: user already exists");
        });
    })

    describe("Game: checking battle functionalities", function () {

        it("getBattle reverts when no battles have been added", async function () {
            await expect(gameContractUsingProxy.getBattle(0)).to.be.revertedWith("Game: battles have not been added yet");
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
            let recovered = await gameContractUsingProxy.verifyMsg(messageHash, flatSig);
            // console.log("recovered", recovered);
            // console.log("deployer", deployer.address);
            expect(recovered).to.be.eq(deployer.address);

        });

        it("verify NftId using Signature", async function () {
            // Sign the binary data
            let flatSig = await deployer.signMessage(msgHashBytes);

            // Call the verifyHash function
            let recovered = await gameContractUsingProxy.verifyId(nftIdBytes, flatSig);
            expect(recovered).to.be.eq(deployer.address);

        });

        it("game controller can add a battle, and it is not possible to get non-existing battle", async function () {
            await gameContractUsingProxy.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
            expect((await gameContractUsingProxy.getBattleId()).toNumber()).to.be.eq(1);
            await expect(gameContractUsingProxy.addBattle(GOLD, endTS, stTS, deployerMsgHashSignature)).to.be.revertedWith("Game: startTime must be smaller than endTime");
            await expect(gameContractUsingProxy.addBattle(GOLD, 0, 1, deployerMsgHashSignature)).to.be.revertedWith("Game: endTime must be larger than block.timestamp");

            const battle = await gameContractUsingProxy.getBattle((await gameContractUsingProxy.getBattleId()).toNumber()-1);
            expect(battle.prize.goldAmount).to.eq(GOLD);
            // console.log(`battle.prize.nftIdCommittedBytes: ${battle.prize.nftIdCommittedBytes}`, typeof battle.prize.nftIdCommittedBytes);
            // console.log(`deployerMsgHashSignature: ${deployerMsgHashSignature}`, typeof deployerMsgHashSignature);
            expect(battle.prize.nftIdCommittedBytes).to.eq(deployerMsgHashSignature.slice(0,10));
            expect(battle.startTime).to.eq(stTS);
            expect(battle.endTime).to.eq(endTS);
            expect(battle.controller).to.eq(deployer.address);

            await expect(gameContractUsingProxy.getBattle(1)).to.be.revertedWith("Game: requested battleId does not exist");
        });

        it("only a single game controller can add battles to prevent potential nftIds collisions by different game controllers", async function () {
            // deployer as a game controller, assigning 1st battle
            await gameContractUsingProxy.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
            // deployer as a game controller, assigning 2nd battle (with same Signature)
            await expect(gameContractUsingProxy.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature)).to.be.revertedWith("Game: you have already assigned nftId to another battle");
            // deployer as a game controller, assigning 2nd battle (with new Signature)
            await gameContractUsingProxy.addBattle(GOLD, stTS, endTS, deployerMsgHash2Signature);

            const battle = await gameContractUsingProxy.getBattle((await gameContractUsingProxy.getBattleId()).toNumber()-1);
            expect(battle.prize.nftIdCommittedBytes).to.eq(deployerMsgHash2Signature.slice(0,10));
        });

        it("only existing users can join a battle, limitted to 2 players", async function () {
            await gameContractUsingProxy.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
            let battleId = (await gameContractUsingProxy.getBattleId()).toNumber()-1;

            await gameContractUsingProxy.addUser(deployer.address);
            await gameContractUsingProxy.joinBattle(battleId);
            await expect(gameContractUsingProxy.joinBattle(battleId)).to.be.revertedWith("Game: you have already joined the battle");

            await expect(gameContractUsingProxy.connect(otherUser).joinBattle(battleId)).to.be.revertedWith("Game: only existing users can join the battle");
            await gameContractUsingProxy.addUser(otherUser.address);
            await gameContractUsingProxy.connect(otherUser).joinBattle(battleId);
            await expect(gameContractUsingProxy.connect(otherUser).joinBattle(battleId)).to.be.revertedWith("Game: you have already joined the battle");

            const battle = await gameContractUsingProxy.getBattle(battleId);
            expect(battle.players[0]).to.eq(deployer.address);
            expect(battle.players[1]).to.eq(otherUser.address);

            await gameContractUsingProxy.addUser(anotherUser.address);
            await expect(gameContractUsingProxy.connect(anotherUser).joinBattle(battleId)).to.be.revertedWith("Game: the battle already has 2 users assigned to play");
        });

        it("set joinBattleCost>0 and check joining reverts when the value=0", async function () {
            await gameContractUsingProxy.addBattle(GOLD, stTS, endTS, deployerMsgHashSignature);
            let battleId = (await gameContractUsingProxy.getBattleId()).toNumber()-1;

            await gameContractUsingProxy.addUser(deployer.address);
            await gameContractUsingProxy.setJoinBattleCost(1);
            await expect(gameContractUsingProxy.joinBattle(battleId)).to.be.revertedWith("Game: user must pay value>=joinBattleCost, use getJoinBattleCost to check the cost");

            await gameContractUsingProxy.setJoinBattleCost(0);
            await gameContractUsingProxy.joinBattle(battleId);

            const battle = await gameContractUsingProxy.getBattle(battleId);
            expect(battle.players[0]).to.eq(deployer.address);
        });
    })

    describe("Game: checking season functionalities", function () {
        it("game controller can add a season, and it is not possible to get non-existing season", async function () {
            let curSeasonId = await gameContractUsingProxy.getSeasonId();
            // console.log(`current SeasonId is ${curSeasonId}`);

            let seasonId = await gameContractUsingProxy.addSeason(0, 9, stTS, endTS);
            expect(seasonId.value).to.be.eq(curSeasonId);
            await expect(gameContractUsingProxy.addSeason(0, 9, endTS, stTS)).to.be.revertedWith("Game: startTime must be smaller than endTime");
            await expect(gameContractUsingProxy.addSeason(0, 9, 0, 1)).to.be.revertedWith("Game: endTime must be larger than block.timestamp");

            let newSeasonId = await gameContractUsingProxy.getSeasonId();
            // console.log(`new weasonId is ${newSeasonId}`);

            const season = await gameContractUsingProxy.getSeason(seasonId.value);
            // console.log(`season: ${season}`);
            expect(season.firstBattle).to.eq(0);
            expect(season.lastBattle).to.eq(9);
            expect(season.startTime).to.eq(stTS);
            expect(season.endTime).to.eq(endTS);

            await expect(gameContractUsingProxy.getSeason(1)).to.be.revertedWith("Game: requested seasonId does not exist");
        });
    })

    describe("GameTokens assignments to Game contarct address", function () {
        it("GameTokens deployer can mint Gold to Game contract address and emit GameTokens and Game events", async function () {
            const GoldAmountToMint: ethers.BigNumber = ethers.BigNumber.from(10**10);

            let oldBalanceOfGameContract = await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, GoldId);
            expect(oldBalanceOfGameContract).to.eq(0);

            await expect(gameTokensContractUsingProxy.mint(gameProxyContract.address, GoldId, GoldAmountToMint, "0x"))
                .to.emit(gameTokensContractUsingProxy, "TransferSingle")
                .withArgs(deployer.address, zeroAddr, gameProxyContract.address, GoldId, GoldAmountToMint);
            expect(
                Object.entries(gameContract.interface.events).some(
                    ([k, v]: any) => v.name === "GoldReceived"
                )
            ).to.be.equal(true);

            let newBalanceOfGameContract = await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, GoldId);
            expect(newBalanceOfGameContract).to.eq(GoldAmountToMint);
        });

        it("GameTokens deployer can mint NFTs to Game contract address and emit GameTokens and Game events", async function () {
            let NFTid1 = 1;
            let NFTid2 = 2;

            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTid1)).to.eq(0);
            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTid2)).to.eq(0);

            await expect(gameTokensContractUsingProxy.mint(gameProxyContract.address, NFTid1, 1, "0x"))
                .to.emit(gameTokensContractUsingProxy, "TransferSingle")
                .withArgs(deployer.address, zeroAddr, gameProxyContract.address, NFTid1, 1);
            expect(
                Object.entries(gameContract.interface.events).some(
                    ([k, v]: any) => v.name === "NFTReceived"
                )
            ).to.be.equal(true);
    
            await expect(gameTokensContractUsingProxy.mint(gameProxyContract.address, NFTid2, 1, "0x"))
                .to.emit(gameTokensContractUsingProxy, "TransferSingle")
                .withArgs(deployer.address, zeroAddr, gameProxyContract.address, NFTid2, 1);

            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTid1)).to.eq(1);
            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTid2)).to.eq(1);
        });

        it("GameTokens deployer can mintBatch NFTs and emit GameTokens and Game events", async function () {
            let NFTids = [1, 2];
            let NFTamounts = [1, 1];

            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTids[0])).to.eq(0);
            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTids[1])).to.eq(0);

            await expect(gameTokensContractUsingProxy.mintBatch(gameProxyContract.address, NFTids, NFTamounts, "0x"))
                .to.emit(gameTokensContractUsingProxy, "TransferBatch")
                .withArgs(deployer.address, zeroAddr, gameProxyContract.address, NFTids, NFTamounts);
            expect(
                Object.entries(gameContract.interface.events).some(
                    ([k, v]: any) => v.name === "NFTReceived"
                )
            ).to.be.equal(true);
    
            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTids[0])).to.eq(1);
            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTids[1])).to.eq(1);
        });

        it("GameTokens deployer cannot mint/mintBatch NFTs with nftId>maxNftId", async function () {
            const NFTids: number[] = generateRange(1, maxNftId+1);
            const NFTamounts: number[] = onesArray(maxNftId+1);

            await expect(gameTokensContractUsingProxy.mint(gameProxyContract.address, maxNftId+1, 1, "0x")).to.be.revertedWith("GameTokens: nftId cannot be larger than maxNftId");
            await expect(gameTokensContractUsingProxy.mintBatch(gameProxyContract.address, NFTids, NFTamounts, "0x")).to.be.revertedWith("GameTokens: nftId cannot be larger than maxNftId");
            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTids[0])).to.eq(0);
        });
    })

    describe("Game winner revelation and transfer of Prize (GameTokens Gold and NFT)", function () {
        it("GameTokens deployer can mintBatch NFTs to Game contract address", async function () {
            // Mint Gold to gameProxyContract.address
            const GoldAmountToMint: ethers.BigNumber = ethers.BigNumber.from(10**10);
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
            // - try to assign winner using different controller from the one who actuall created the battel
            let game_controller_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_CONTROLLER_ROLE"));
            await gameContractUsingProxy.grantRole(game_controller_role, otherUser.address);
            await expect(gameContractUsingProxy.connect(otherUser).assignWinner(battleId, anotherUser.address, NFTid, deployerMsgHashSignature)).to.be.revertedWith("Game: assigning NFT to a winner can be done only by controller who added the battle");
            // - try to assign winner who is not one of the players
            await expect(gameContractUsingProxy.assignWinner(battleId, deployer.address, NFTid, deployerMsgHashSignature)).to.be.revertedWith("Game: winner must be one of the players assigned for the battle");
            // - try passing wrong signature
            await expect(gameContractUsingProxy.assignWinner(battleId, anotherUser.address, NFTid, deployerMsgHash2Signature)).to.be.revertedWith("Game: initial signature bytes are different from committed ones");
            // - try passing wrong id
            await expect(gameContractUsingProxy.assignWinner(battleId, anotherUser.address, NFTid+1, deployerMsgHashSignature)).to.be.revertedWith("Game: nftId could not be verified against signature");
            // - pass correctly
            await gameContractUsingProxy.assignWinner(battleId, anotherUser.address, NFTid, deployerMsgHashSignature);
            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, GoldId)).to.eq(initGameContractGoldBalance-GOLD);
            expect(await gameTokensContractUsingProxy.balanceOf(gameProxyContract.address, NFTid)).to.eq(0);
            expect(await gameTokensContractUsingProxy.balanceOf(anotherUser.address, GoldId)).to.eq(GOLD);
            expect(await gameTokensContractUsingProxy.balanceOf(anotherUser.address, NFTid)).to.eq(1);
        });
    })

})
