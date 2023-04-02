// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract GameItems is ERC1155URIStorage, AccessControl {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public minimumPay;

    uint256 public constant GOLD = 0;

    constructor() public ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _mint(msg.sender, GOLD, 10**18, "");
        _tokenIds.increment();
    }

    function mint(string memory tokenUri) public onlyRole(MINTER_ROLE) returns (uint256) {

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId, 1, "");

        _setURI(newItemId, tokenUri);
        _tokenIds.increment();

        return newItemId;
    }

}