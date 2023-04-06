# Description
The suite of smart contracts is prepared for on-chain "Game" control of users, battles, and seasons.
The following is the list of implemented smart contracts:
- Game.sol: stores and controls users, battles, and seasons as well as ensures winner receives prize that is secretely specified during creation of a battle
- GameTokens.sol: ERC1155 openzeppelin contract for "Gold" (ERC20-like) and "NFT" (ERC721-like) tokens
- GameProxy.sol: a proxy contract that allows upgradeability of implementation/logic contracts (Game.sol and GameTokens.sol, which requires the contracts to be initializable and inheritting Upgradeable openzeppeling contracts)
- GameUpgradeTest.sol: is an instance of *Game* contract that has implements new state variable and functions and used for testing Upgradeability by changing *implementation/logic* address within *GameProxy* from *Game.sol* to *GameUpgradeTest* instance

# Contracts
## Game contract description
The main highlights of the contract are that it:
- uses ***Commit-reveal*** option of ***Psuedo Random Number Generator*** to assign NFT id in a secret way while adding a battle
- is ***Upgradeable*** and implements necessary steps required for *logic/implementation* contracts within *GameProxy* contract
- is ***ERC1155 compatible** and is able to receive and transfer ERC1155 tokens, emitting events
- and uses *AccessControll* for a better control to access contract's functions

### Inheritance
Game contract inherits from openzeppelin's *AccessControlUpgradeable* and *ERC1155HolderUpgradeable* contracts. The former for ease of controlling access to the contract, and the latter required for contracts holding ERC1155 tokens.

### Storage
- *address public _gameTokensAddress* is an address to GameTokens Proxy contract, required in IGameTokens interface for cross-contract calls
- *uint256 private _joinBattleCost* is used as a minimum payable amount required to join a battle (by default it is set to 0)
- *CountersUpgradeable.Counter private _battleId* and *_seasonId* are counters of battle and season ids added to the Game
- *address _activeBattleController* is an address of an active battle controller, used to make sure that there can be one controller at a time who can add battles and assign a winner (also needed to avoid nft ids collision when adding battles)
- *CountersUpgradeable.Counter private _numActiveBattles* is a number of currently active battles (i.e., the battles for which a winner has been assigned yet)
- *CountersUpgradeable.Counter private _numOfNFTsAvailable* is a number of nft ids available in Game contract, which is incremented or decremented whenever an nft id is transferred to or from the Game contract, respectively
- *mapping(address => mapping(bytes4 => bool)) private nftIdCommittedBytesRegistry* is a mapping of active battle controller addresses mapping initial 4 bytes of *msg("nftID")*'s ***signature*** committed by a controller while adding a new battle, which is set to *true* when *nftId* has been committed thereby making it possible to check that *nftId* has not been yet used by a controller to add a new battle
- *mapping(address => User) public users* is a mapping of all the users addresses to *struct User {uint joinedTime}*, where the *joinedTime* used to check if a user has been already added.
- *mapping(uint256 => Battle) _battles* is a mapping of all battle ids to a *Battle struct {Prize prize; uint startTime; uint endTime; addresses[2] players; address winner; address controller}, where prize is *Prize struct {uint goldAmount; uint nftIdRevealed, bytes4 nftIdCommittedBytes} with *nftIdCommittedBytes* being a 4 bytes of *msg("nftID")*'s ***signature*** committed by a controller while adding a new battle and keeping it *nftId* secrete until winner is assigned and *nftIdRevealed* revealed upon verification of a ***signature***
- *mapping(uint256 => Season) _seasons* is a mapping of all season ids to a *struct Season {uint firstBattle, uint lastBattle, uint startTime, uint endTime}*

***NOTE that the storage is at the proxy contract as it delegates calldata to Game contract. Thus the calldata operates in context of proxy storage***


### Events
The following events are emitted whenever ERC1155 tokens are received to or transfered from *Game* contract: *NFTReceived*, *NFTTransfered*, *GoldReceived*, *GoldTransfered*.

### Main functions
The following are the main functions of *Game* contract (for all other functiosn refer to "contracts/Game.sol"):
* Users, battles, and season control methods:
    - *function addUser(address addr) public onlyRole(GAME_CONTROLLER_ROLE)* is used to add a new user setting *User.joinedTime*, and it is accessable only by *GAME_CONTROLLER_ROLE* holders
    - *function addBattle(uint goldAmount_, uint startTime_, uint endTime_, bytes memory nftIdHashSignature_) external onlyRole(GAME_CONTROLLER_ROLE) onlyCorrectTimeRange(startTime_, endTime_)* is used to add a new battle setting battle's *Prize(goldAmount_, uint(0), nftIdHashSignature_[0:4])* and specifying battle's *startTime*, *endTime*, and *controller* with *players[2]* and *winner* set to *address(0)*.
    - *function joinBattle(uint battleId_) public payable onlyIfBattleIdExist(battleId_)* is payable function and is used by existing users (others are rejected) to join a battle, making sure user is not one of the players for a battle Id
    - *function addSeason(uint firstBattle_, uint lastBattle_, uint startTime_, uint endTime_) external onlyRole(GAME_CONTROLLER_ROLE) onlyCorrectTimeRange(startTime_, endTime_)* is used to add a new season
    - *function assignWinner(uint battleId_, address winner, uint nftId_, bytes memory signature_) public onlyRole(GAME_CONTROLLER_ROLE)* is a function that can only be used by a battle controller to assign a winner, checking winner is one of the players, ***revealing nftId and verifying that the corresponding signature corresponds to the one committed and is signed by the controller***, and transferring prize (i.e., Gold and NFT id) to the winner
* ERC1155 methods
    - *function onERC1155Received(address operator, address from, uint256 id, uint256 amount, bytes memory data) public override(ERC1155HolderUpgradeable) returns (bytes4)* is envoked whenever ERC1155 token is received by a *Game* contract, it is overriden to emit *NFTReceived* and *GoldReceived* events as well as to increment *_numOfNFTsAvailable*.
    - *function _transferERC1155(address to, uint256 id, uint256 amount, bytes memory data) internal* is used to transfer ERC1155 tokens to a winner, it emits *NFTTransfered* and *GoldTransfered* events as well as decrements *_numOfNFTsAvailable*
* Verification methods:
    - *Verification* library's: *function _verifyMsg(bytes32 msg_, bytes memory signature_) internal view returns (address)* is a method used to verify that msg.sender sent a msg with correct signature

## GameTokens contract description
The main highlights of the contract are that it:
- is ***Upgradeable*** and implements necessary steps required for *logic/implementation* contracts within *GameProxy* contract
- and uses *AccessControll* for a better control to access contract's functions

### Inheritance
Game contract inherits from openzeppelin's *AccessControlUpgradeable* and *ERC1155Upgradeable* contracts. The former for ease of controlling access to the contract, and the latter for ERC1155 tokens implementation in a gas efficient way.

### Storage
- *uint256 public _maxNftId* is a maximum nft id that can be minted as an extra control of not exceeding available ids 

### Main functions
The implementation is so that only *id=0* is reserved for Gold (ERC20-like) token, while *id>0* are meant for NFTs (ERC721-like) tokens.
This is done by overriding *mint* and *mintBatch* functions to mint only a single token for *id>0*.
However, we are aware that at the moment there is no guarantee that NFTid is not minted again and therefore more controls might be needed.


## GameProxy contract
The contract is quite simple and iherits from openzeppelin's *TransparentUpgradeableProxy* contract.
While deploing the contract it is necessary to include *logic* contract's address (i.e., *Game* and *GameTokens* addresses) and pass calldata to the corresponding data which triggers *initialize* methods.


# Commands
## Testing
To run the tests:
`yarn hardhat test tests/Game.ts`

## To deploy
`yarn run ts-node scripts/contracts/deploy.ts`
## To deploy, addBattle, joinBattle, and assignWinner
`yarn run ts-node scripts/contracts/deploy_addBattle_joinBattle_assignWinner.ts`
add ` --network GOERLI` option to deploy on Goerli testnet

# NFTs
Attributes (head, chest, legs, and weapon) NFTs are autogenerated, uploaded and pinned using NFT.storage API.
Run the following:
`yarn run ts-node scripts/NFTStorage/NFTstorage.ts`
Note: this requires NFT_STORAGE_KEY definition in .env.
The script does the following:
- envokes `scripts/NFTStorage/PrintOnImage.ts` which auto generates files for each attribute, using specifed range (currently set to 10 items per attribute) with an NFT number and Disclaimer printed on each attribute's base.jpg (stored as scripts/NFTStorage/images/attribute_name/base.jpg). Note: that the image files (and metadata files) are not saved but instead are kept in Buffer to avoid memory space usage.
- a set of all image files is then sent to NFT.Storage as a "directory" (not actual directory, but files kept in buffer), which generates a CID for the directory followed by a file number + ".jpg" (i.e., `ipfs://CID/iamge_file_id.jpg`)
- then metadata files (json files) are generated for each image file and kept in buffer, with the following as metadata format:
`{
    "name": "NFT - " + attrName,
    "description": attrName + " is a part of " + attr + " NFT collection with randomly generate strength parameter",
    "image": "ipfs://"+CIDdir+"/"+String(counter)+".jpg",
    "strength": String(Math.ceil(Math.random() * 10)),
}`
"image" field can be used to get access to stored file using IPFS
- a set of all metadata files is then sent to NFT.Storage as a "directory" (not actual directory, but files kept in buffer), which generates a CID for the directory followed by a file name (i.e., `ipfs://CID/json_file_id_in_the_range_from_1_to_10`)

## Printing Disclaimer on downloaded images, also helps to get unique CID (in case an image has been already been used on IPFS)
`yarn run ts-node scripts/NFTStorage/PrintOnImages.ts`