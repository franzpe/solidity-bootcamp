// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

interface IGameTokens {
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
}

/// @title Game.
contract Game is AccessControl, ERC1155Holder {
    address public _gameTokensAddress;
    using Counters for Counters.Counter;
    Counters.Counter private _battleId;
    Counters.Counter private _seasonId;
    bytes32 public constant COST_SETTER_ROLE = keccak256("COST_SETTER_ROLE");
    bytes32 public constant GAME_CONTROLLER_ROLE = keccak256("GAME_CONTROLLER_ROLE");
    bytes32 public constant GAME_TOKENS_ADDR_SETTER_ROLE = keccak256("GAME_TOKENS_ADDR_SETTER_ROLE");
    uint private _joinBattleCost;

    event NFTReceived(address indexed from_, uint indexed Id_);
    event NFTTransfered(address indexed to_, uint indexed Id_);
    Counters.Counter private _numOfNFTsAvailable;

    event GoldReceived(address indexed from_, uint indexed amount_);
    event GoldTransfered(address indexed to_, uint indexed amount_);

    struct User {
        // string nick;
        uint256 joinedTime;
        // uint256[] battles_pariticipated; // dynamic size, might wanna limit it for better storage management
        // uint256[] battles_won; // dynamic size, might wanna limit it for better storage management
    }

    struct Prize {
        uint256 goldAmount;
        uint256 nftIdRevealed;
        bytes4 nftIdCommittedBytes; // committed of controller's signature of message(keccak256(nftIdBytes)) where nftId is to be revealed and 
    }

    struct Battle {
        Prize prize;
        uint256 startTime;  // UTC format timestamp
        uint256 endTime;    // UTC format timestamp
        address[2] players; // Note: setting 2 players for a battle
        address winner;     // winner is selected in the Game Frontend and assigned by battle controller on-chain
        address controller; // battle controller (commits NftId, and reveals upon assigning NFT to a winner)
    }

    struct Season {
        uint256 firstBattle;    // first Battle of a season
        uint256 lastBattle;     // last Battle of a season
        uint256 startTime;      // UTC format timestamp
        uint256 endTime;        // UTC format timestamp
    }

    mapping(address => User) public users;
    mapping(uint256 => Battle) _battles;
    mapping(uint256 => Season) _seasons;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(address gameTokensAddr_) {
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

    function addBattle(uint goldAmount_, uint startTime_, uint endTime_, bytes memory nftIdHashdSignature_) public onlyRole(GAME_CONTROLLER_ROLE) onlyCorrectTimeRange(startTime_, endTime_) returns (uint) {
        // require(verifyHash(nftIdHash_, nftIdHashdSignature_) == msg.sender, "Game: nftIdHash could not be verified");
        bytes4 signatureInitBytes;
        assembly {
            signatureInitBytes := mload(add(nftIdHashdSignature_, 32))
        }
        Prize memory prize = Prize(goldAmount_, uint(0), signatureInitBytes);
        uint battleId = _battleId.current();
        _battles[battleId] = Battle(prize, startTime_, endTime_, [address(0), address(0)], address(0), msg.sender);
        _battleId.increment();

        return battleId;
    }

    function verifyHash(bytes32 hash_, bytes memory signature_) public view onlyRole(GAME_CONTROLLER_ROLE) returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature_);
        bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash_));

        return ecrecover(messageDigest, v, r, s);
    }

    function verifyId(uint id_, bytes memory signature_) public view onlyRole(GAME_CONTROLLER_ROLE) returns (address) {
        return _verifyId(id_, signature_);
    }

    function _verifyId(uint id_, bytes memory signature_) internal view returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature_);
        bytes32 hash_ = keccak256(abi.encodePacked(id_));
        bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash_));

        return ecrecover(messageDigest, v, r, s);
    }

    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
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

    function addSeason(uint firstBattle_, uint lastBattle_, uint startTime_, uint endTime_) public onlyRole(GAME_CONTROLLER_ROLE) onlyCorrectTimeRange(startTime_, endTime_) returns (uint) {
        uint seasonId = _seasonId.current();
        _seasons[seasonId] = Season(firstBattle_, lastBattle_, startTime_, endTime_);
        _seasonId.increment();

        return seasonId;
    }

    function getSeason(uint seasonId_) public view onlyIfSeasonIdExist(seasonId_) returns(Season memory _season) {
        _season = _seasons[seasonId_];
    }

    // NFTs
    function onERC1155Received(address operator, address from, uint256 id, uint256 amount, bytes memory data) public override(ERC1155Holder) returns (bytes4) {
        if (id > uint(0)) {
            require(amount == uint(1), "Game: for id>0, amount received must be equal to 1");
            _numOfNFTsAvailable.increment();
            emit NFTReceived(from, id);
        } else {
            emit GoldReceived(from, amount);
        }
        return this.onERC1155Received.selector;
    }

    function transferERC1155(address to, uint256 id, uint256 amount, bytes calldata data) internal {
        if (id > uint(0)) {
            require(amount == uint(1), "Game: for id>0, amount received must be equal to 1");
            IGameTokens(_gameTokensAddress).safeTransferFrom(address(this), to, id, amount, data);
            _numOfNFTsAvailable.decrement();
            emit NFTTransfered(to, id);
        } else {
            IGameTokens(_gameTokensAddress).safeTransferFrom(address(this), to, id, amount, data);
            emit GoldTransfered(to, amount);
        }
    }

    function getNumOfNFTsAvailable() public view onlyRole(GAME_CONTROLLER_ROLE) returns (uint) {
        return uint(_numOfNFTsAvailable.current());
    }

    function assignNftToWinner(uint battleId_, address winner) public onlyRole(GAME_CONTROLLER_ROLE) {
        require(_battles[battleId_].controller == msg.sender, "Game: assigning NFT to a winner can be done only by controller who added the battle");
        require(_checkNotJoined(winner) == false, "Game: winner must be a user");
        require(winner == _battles[battleId_].players[0] || winner == _battles[battleId_].players[1], "Game: winner must be one of the players assigned for the battle");


    }

    // function getRandomNumber() public view returns (uint256 notQuiteRandomNumber) {
    //     notQuiteRandomNumber = uint256(blockhash(block.number - 1));
    // }

    // function _getRandomNFTId(uint numberOfNFTsAvailable) public view onlyRole(GAME_CONTROLLER_ROLE) returns (uint) {
    //     heads = getRandomNumber() % 2 == 0;
    // }
    

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Receiver, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}