// SPDX-License-Identifier: UNLICENSED
// changed by scognaxyzBranch
pragma solidity ^0.8.9;

interface IHelloWorld {
  function helloWorld() external view returns (string memory);

  function setText(string calldata newText) external;

  function transferOwnership(address newOwner) external;
}

contract HelloWorld is IHelloWorld {
  string private text;
  address public owner;

  constructor() {
    text = 'Hello World';
    owner = msg.sender;
  }

  function helloWorld() public view returns (string memory) {
    return text;
  }

  function setText(string calldata newText) public onlyOwner {
    text = newText;
  }

  function transferOwnership(address newOwner) public onlyOwner {
    owner = newOwner;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Caller is not the owner');
    _;
  }

  fallback() external onlyOwner {
    text = "Fallback method triggered";
  }
}

contract SideHelloWorld {
  address public owner;

  constructor(){
    owner = msg.sender;
  }

  function callHelloWorld(address _hello_world_address) public view returns (string memory) {
    return IHelloWorld(_hello_world_address).helloWorld();
  }

  function callSetText(address _hello_world_address, string calldata newText) public onlyOwner {
    IHelloWorld(_hello_world_address).setText(newText);
  }

  function callNotImplementedFunction(address _hello_world_address) public onlyOwner {
    _hello_world_address.call(abi.encodeWithSignature("NotImplementedFunction()"));
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Caller is not the owner');
    _;
  }
}