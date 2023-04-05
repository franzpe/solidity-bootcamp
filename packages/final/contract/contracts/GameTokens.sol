// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GameTokens is ERC1155, AccessControl {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant GOLD = 0; // NOTE: all other IDs are for NFTs - do not change this as on Game contract's onERC1155Received function emits an NFTReceived event for Ids>0
    uint256 public _maxNftId;

    constructor(uint maxNftId_, string memory uri_) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _setMaxNftId(maxNftId_);
        _setURI(uri_);

        _mint(msg.sender, GOLD, 10**18, "");
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function setMaxNftId(uint maxNftId_) public onlyRole(URI_SETTER_ROLE) {
        _setMaxNftId(maxNftId_);
    }

    function _setMaxNftId(uint maxNftId_) internal {
        _maxNftId = maxNftId_;
    }

    function getMaxNftId(uint maxNftId_) public view returns (uint) {
        return _maxNftId;
    }

    // NOTE: for minting given id should correspond to id for a given attribute specified in "../scripts/NFTStorage/JSONs/NftStorageMetadataDir.json"
    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        require(id <= _maxNftId, "GameTokens: nftId cannot be larger than maxNftId");
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        require(ids.length == amounts.length, "GameTokens: ids and amounts lengths must be equal");
        for (uint256 i = 0; i < ids.length; ++i) {
            mint(to, ids[i], amounts[i], data);
        }

        emit TransferBatch(msg.sender, address(0), to, ids, amounts);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}