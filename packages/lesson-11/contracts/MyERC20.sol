// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { AccessControl } from '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';

contract MyToken is ERC20, ERC20Burnable, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

  constructor() ERC20('My Token', 'MTK') {
    _grantRole(MINTER_ROLE, msg.sender);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }
}
