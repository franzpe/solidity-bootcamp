// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Game.
contract Game is AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _battleId;
    Counters.Counter private _seasonId;
    bytes32 public constant GAME_CONTROLLER_ROLE = keccak256("GAME_CONTROLLER_ROLE");

    struct User {
        // string nick;
        uint256 joinedTime;
        // uint256[] battles_pariticipated; // dynamic size, might wanna limit it for better storage management
        // uint256[] battles_won; // dynamic size, might wanna limit it for better storage management
    }

    struct Prize {
        uint256 goldAmount;
        uint256 nftId;
    }

    struct Battle {
        Prize prize;
        uint256 startTime;  // UTC format timestamp
        uint256 endTime;    // UTC format timestamp
        address[2] players; // Note: setting 2 players for a battle
        address winner;
    }

    struct Season {
        uint256 firstBattle;    // first Battle of a season
        uint256 lastBattle;     // last Battle of a season
        uint256 startTime;      // UTC format timestamp
        uint256 endTime;        // UTC format timestamp
    }

    mapping(address => User) public users;
    mapping(uint256 => Battle) battles;
    mapping(uint256 => Season) seasons;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GAME_CONTROLLER_ROLE, msg.sender);
    }

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

    function getBattleId() public view onlyRole(GAME_CONTROLLER_ROLE) returns (uint) {
        return uint(_battleId.current());
    }

    function addBattle(uint goldAmount, uint nftId, uint startTime, uint endTime) public onlyRole(GAME_CONTROLLER_ROLE) returns (uint) {
        require(startTime < endTime, "Game: startTime must be smaller than endTime");
        require(endTime > block.timestamp, "Game: endTime must be larger than current timestamp");

        Prize memory prize = Prize(goldAmount, nftId);
        uint battleId = _battleId.current();
        battles[battleId] = Battle(prize, startTime, endTime, [address(0), address(0)], address(0));
        _battleId.increment();

        return battleId;
    }

    modifier onlyIfBattleIdExist(uint battleId_) {
        require(_battleId.current() > 0, "Game: battles have not been added yet");
        require(battleId_ < _battleId.current(), "Game: requested battleId does not exist");
        _;
    }

    function getBattle(uint battleId_) public view onlyIfBattleIdExist(battleId_) returns(Battle memory _battle) {
        _battle = battles[battleId_];
    }

    function joinBattle(uint battleId_) public onlyIfBattleIdExist(battleId_) {
        require(_checkNotJoined(msg.sender) == false, "Game: only existing users can join the battle");
        require(battles[battleId_].players[0] != msg.sender && battles[battleId_].players[1] != msg.sender, "Game: you have already joined the battle");
        require(battles[battleId_].players[0] == address(0) || battles[battleId_].players[1] == address(0), "Game: the battle already has 2 users assigned to play");

        if (battles[battleId_].players[0] == address(0)) {
            battles[battleId_].players[0] = msg.sender;
        } else {
            battles[battleId_].players[1] = msg.sender;
        }
    }

}