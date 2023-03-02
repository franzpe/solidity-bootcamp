// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IMyToken {
  function mint(address to, uint256 amount) external;
}

contract TokenSale {
  uint256 public ratio;
  IMyToken public tokenAddress;

  constructor(uint256 _ratio, address _tokenAddress) {
    ratio = _ratio;
    tokenAddress = IMyToken(_tokenAddress);
  }

  function buyTokens() external payable {
    uint256 amountToBeMinted = msg.value * ratio;
    tokenAddress.mint(msg.sender, amountToBeMinted);
  }
}
