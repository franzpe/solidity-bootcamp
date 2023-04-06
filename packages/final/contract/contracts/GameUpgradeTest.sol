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
contract GameUpgradeTest is AccessControlUpgradeable, ERC1155HolderUpgradeable {
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
        // string nick;
        uint256 joinedTime;
        // uint256[] battles_pariticipated; // dynamic size, might wanna limit it for better storage management
        // uint256[] battles_won; // dynamic size, might wanna limit it for better storage management
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

    uint256 public _newStateVariable;

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

    function setNewStateVariable(uint256 newStateVariable_) public {
        _newStateVariable = newStateVariable_;
    }

    function getNewStateVariable() public view returns (uint256) {
        return _newStateVariable;
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