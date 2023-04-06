// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";

interface IGameTokens {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
}

library Verification {
    function _verifyMsg(bytes32 msg_, bytes memory signature_) internal view returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(signature_);
        bytes32 msgDigest_ = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msg_));

        return ecrecover(msgDigest_, v, r, s);
    }

    function _splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
    }

}

/// @title Game.
contract Game is AccessControlUpgradeable, ERC1155HolderUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // AccessControl Roles
    bytes32 public constant COST_SETTER_ROLE = keccak256("COST_SETTER_ROLE");
    bytes32 public constant GAME_CONTROLLER_ROLE = keccak256("GAME_CONTROLLER_ROLE");
    bytes32 public constant GAME_TOKENS_ADDR_SETTER_ROLE = keccak256("GAME_TOKENS_ADDR_SETTER_ROLE");

    // addres of GameTokens contract used for Gold (ERC20-like) and NFTs (ERC721-like)
    address public _gameTokensAddress;

    // battle cost required to be included in a transaction by a user willing to join a battle
    uint private _joinBattleCost;

    // tracks battleId that can be used to add a battle
    CountersUpgradeable.Counter private _battleId;
    // tracks seasonId that can be used to add a season
    CountersUpgradeable.Counter private _seasonId;
    // address of active battle controller, only a single battler controller is allowed at a time, = address(0) when no battler controller is active thus allowing new battle controller
    address _activeBattleController;
    // tracks number of active battles
    CountersUpgradeable.Counter private _numActiveBattles;
    // tracks number of available NFTs
    CountersUpgradeable.Counter private _numOfNFTsAvailable;

    // to prevent committed nftId collisions when GAME_CONTROLLER adds a new battle
    mapping(address => mapping(bytes4 => bool)) private nftIdCommittedBytesRegistry;

    // User struct to be used for users mapping
    struct User {
        uint256 joinedTime;
    }

    // Prize struct to be used for Battle struct prize field
    struct Prize {
        uint256 goldAmount;
        uint256 nftIdRevealed;
        bytes4 nftIdCommittedBytes; // committed of controller's signature of message(keccak256(nftIdBytes)) where nftId is to be revealed and 
    }

    // Battle struct to be used for battles mapping
    struct Battle {
        Prize prize;
        uint256 startTime;  // UTC format timestamp
        uint256 endTime;    // UTC format timestamp
        address[2] players; // Note: setting 2 players for a battle
        address winner;     // winner is selected in the Game Frontend and assigned by battle controller on-chain
        address controller; // battle controller (commits NftId, and reveals upon assigning NFT to a winner)
    }

    // Season struct to be used for seasons mapping
    struct Season {
        uint256 firstBattle;    // first Battle of a season
        uint256 lastBattle;     // last Battle of a season
        uint256 startTime;      // UTC format timestamp
        uint256 endTime;        // UTC format timestamp
    }

    // users data
    mapping(address => User) public users;
    // battles data
    mapping(uint256 => Battle) _battles;
    // seasons data
    mapping(uint256 => Season) _seasons;

    // Events for NFTs
    event NFTReceived(address indexed from_, uint indexed Id_);
    event NFTTransfered(address indexed to_, uint indexed Id_);

    // Events for Gold
    event GoldReceived(address indexed from_, uint indexed amount_);
    event GoldTransfered(address indexed to_, uint indexed amount_);

    function initialize(address gameTokensAddr_) public initializer {
        _gameTokensAddress = gameTokensAddr_;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COST_SETTER_ROLE, msg.sender);
        _grantRole(GAME_CONTROLLER_ROLE, msg.sender);
        _grantRole(GAME_TOKENS_ADDR_SETTER_ROLE, msg.sender);
    }

    function setGameTokensAddr(address gameTokensAddr_) public onlyRole(GAME_TOKENS_ADDR_SETTER_ROLE) {
        _gameTokensAddress = gameTokensAddr_;
    }

    function setJoinBattleCost(uint cost_) public onlyRole(COST_SETTER_ROLE) {
        _joinBattleCost = cost_;
    }

    function getJoinBattleCost() public view returns (uint) {
        return _joinBattleCost;
    }

    // USERS
    function addUser(address addr) public onlyRole(GAME_CONTROLLER_ROLE) {
        require(_checkNotJoined(addr), "Game: user already exists");
        users[addr] = User(block.timestamp); // NOTE: this should be the timestamp of last block mined
    }

    function checkNotJoined(address addr) public view returns (bool) {
        return _checkNotJoined(addr);
    }

    function _checkNotJoined(address addr) internal view returns (bool) {
        if (users[addr].joinedTime > 0) {
            return false;
        } else {
            return true;
        }
    }

    // BATTLES
    modifier onlyIfBattleIdExist(uint battleId_) {
        require(_battleId.current() > 0, "Game: battles have not been added yet");
        require(battleId_ < _battleId.current(), "Game: requested battleId does not exist");
        _;
    }

    modifier onlyCorrectTimeRange(uint startTime_, uint endTime_) {
        require(startTime_ < endTime_, "Game: startTime must be smaller than endTime");
        require(endTime_ > block.timestamp, "Game: endTime must be larger than block.timestamp");
        _;
    }

    function getBattleId() public view onlyRole(GAME_CONTROLLER_ROLE) returns (uint) {
        return uint(_battleId.current());
    }

    function addBattle(uint goldAmount_, uint startTime_, uint endTime_, bytes memory nftIdHashSignature_) external onlyRole(GAME_CONTROLLER_ROLE) onlyCorrectTimeRange(startTime_, endTime_) {
        // NOTE 1: it's a responsibility of GAME_CONTROLLER assigning a new battle to make sure nftIdHashSignature_ corresponds to nftId that Game contract possesses
        bytes4 signatureInitBytes;
        assembly {
            signatureInitBytes := mload(add(nftIdHashSignature_, 32))
        }

        // NOTE 2: To make sure nftId is not assigned to another battle, at this point it is only _activeBattleController who can assign Battles
        require(_activeBattleController == address(0) || _activeBattleController == msg.sender, "Game: new battle can be assigned only if there are no active battles or _activeBattleController==msg.sender");
        require(nftIdCommittedBytesRegistry[msg.sender][signatureInitBytes] == false, "Game: you have already assigned nftId to another battle");

        _activeBattleController = msg.sender;
        _numActiveBattles.increment();

        Prize memory prize = Prize(goldAmount_, uint(0), signatureInitBytes);
        _battles[_battleId.current()] = Battle(prize, startTime_, endTime_, [address(0), address(0)], address(0), msg.sender);
        _battleId.increment();

        nftIdCommittedBytesRegistry[msg.sender][signatureInitBytes] = true;
    }

    function getBattle(uint battleId_) public view onlyIfBattleIdExist(battleId_) returns(Battle memory _battle) {
        _battle = _battles[battleId_];
    }

    function joinBattle(uint battleId_) public payable onlyIfBattleIdExist(battleId_) {
        require(_checkNotJoined(msg.sender) == false, "Game: only existing users can join the battle");
        require(_battles[battleId_].players[0] != msg.sender && _battles[battleId_].players[1] != msg.sender, "Game: you have already joined the battle");
        require(_battles[battleId_].players[0] == address(0) || _battles[battleId_].players[1] == address(0), "Game: the battle already has 2 users assigned to play");
        require(msg.value >= _joinBattleCost, "Game: user must pay value>=joinBattleCost, use getJoinBattleCost to check the cost");

        if (_battles[battleId_].players[0] == address(0)) {
            _battles[battleId_].players[0] = msg.sender;
        } else {
            _battles[battleId_].players[1] = msg.sender;
        }
    }

    // SEASONS
    modifier onlyIfSeasonIdExist(uint seasonId_) {
        require(_seasonId.current() > 0, "Game: seasons have not been added yet");
        require(seasonId_ < _seasonId.current(), "Game: requested seasonId does not exist");
        _;
    }

    function getSeasonId() public view onlyRole(GAME_CONTROLLER_ROLE) returns (uint) {
        return uint(_seasonId.current());
    }

    function addSeason(uint firstBattle_, uint lastBattle_, uint startTime_, uint endTime_) external onlyRole(GAME_CONTROLLER_ROLE) onlyCorrectTimeRange(startTime_, endTime_) {
        _seasons[_seasonId.current()] = Season(firstBattle_, lastBattle_, startTime_, endTime_);
        _seasonId.increment();
    }

    function getSeason(uint seasonId_) public view onlyIfSeasonIdExist(seasonId_) returns(Season memory _season) {
        _season = _seasons[seasonId_];
    }

    // NFTs
    function onERC1155Received(address operator, address from, uint256 id, uint256 amount, bytes memory data) public override(ERC1155HolderUpgradeable) returns (bytes4) {
        if (id > uint(0)) {
            require(amount == uint(1), "Game: for id>0, amount received must be equal to 1");
            _numOfNFTsAvailable.increment();
            emit NFTReceived(from, id);
        } else {
            emit GoldReceived(from, amount);
        }
        return this.onERC1155Received.selector;
    }

    function getNumOfNFTsAvailable() public view onlyRole(GAME_CONTROLLER_ROLE) returns (uint) {
        return uint(_numOfNFTsAvailable.current());
    }

    function assignWinner(uint battleId_, address winner, uint nftId_, bytes memory signature_) public onlyRole(GAME_CONTROLLER_ROLE) {
        require(_battles[battleId_].controller == msg.sender, "Game: assigning NFT to a winner can be done only by controller who added the battle");
        require(winner == _battles[battleId_].players[0] || winner == _battles[battleId_].players[1], "Game: winner must be one of the players assigned for the battle");

        // verify signature is compatible with battle.prize.nftIdCommittedBytes
        bytes4 signatureInitBytes;
        assembly {
            signatureInitBytes := mload(add(signature_, 32))
        }
        require(signatureInitBytes == _battles[battleId_].prize.nftIdCommittedBytes, "Game: initial signature bytes are different from committed ones");

        // verify nftId
        require(Verification._verifyMsg(keccak256(abi.encodePacked(nftId_)), signature_) == msg.sender, "Game: nftId could not be verified against signature");

        // reveal nftId as a prize for the battleId
        _battles[battleId_].prize.nftIdRevealed = nftId_;

        // verify Gold and nftId balanece of this contract is sufficient
        require(IGameTokens(_gameTokensAddress).balanceOf(address(this), uint(0)) >= _battles[battleId_].prize.goldAmount, "Game: Game contract does not have sufficient Gold for winner");
        require(IGameTokens(_gameTokensAddress).balanceOf(address(this), nftId_) == uint(1), "Game: Game contract does not have nftId for winner");

        // transfer Gold to winner
        _transferERC1155(winner, 0, _battles[battleId_].prize.goldAmount, new bytes(0));
        // transfer nftId to winner
        _transferERC1155(winner, nftId_, uint(1), new bytes(0));

        _numActiveBattles.decrement();
        if (_numActiveBattles.current() < 1) {
            _activeBattleController = address(0);
        }
    }

    function _transferERC1155(address to, uint256 id, uint256 amount, bytes memory data) internal {
        if (id > uint(0)) {
            require(amount == uint(1), "Game: for id>0, amount must be equal to 1");
            IGameTokens(_gameTokensAddress).safeTransferFrom(address(this), to, id, amount, data);
            _numOfNFTsAvailable.decrement();
            emit NFTTransfered(to, id);
        } else {
            IGameTokens(_gameTokensAddress).safeTransferFrom(address(this), to, id, amount, data);
            emit GoldTransfered(to, amount);
        }
    }

    // VERIFICATION METHODS (for testing)
    function verifyMsg(bytes32 msg_, bytes memory signature_) public view onlyRole(GAME_CONTROLLER_ROLE) returns (address) {
        return Verification._verifyMsg(msg_, signature_);
    }

    function verifyId(uint id_, bytes memory signature_) public view onlyRole(GAME_CONTROLLER_ROLE) returns (address) {
        return Verification._verifyMsg(keccak256(abi.encodePacked(id_)), signature_);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155ReceiverUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}