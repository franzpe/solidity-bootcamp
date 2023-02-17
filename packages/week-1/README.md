# Week 1

First week project of solidity bootcamp, focusing on the interacton with "HelloWorld" contract, it's deployment, string and ownership mainpualtion.

## How to use

```shell
// See all hardhat functions
npx hardhat help

// Run tests
npx hardhat test

REPORT_GAS=true npx hardhat test

// Run local node of rpc server
npx hardhat node

// Deploy HelloWorld contract on your local node
npx hardhat run scripts/deploy.ts
```

## Report

### Tests

Tests written in ./test/HelloWorld.ts

```
Hello World contract
	✔ Should deploy contract with the right owner (718ms)
	Ownership manipulation
		✔ Should transfer ownership
		✔ Should fail transfer ownership by other account to itself
	Text manipulation
		✔ Should return Hello World String
		✔ Should set text to - Hi from team 8
		✔ Should fail setting text by other account than owner
```

### Contract deployed on local network

```
Deploying the contract with address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Contract HelloWorld deployed to adress: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Report from RPC server:

```
Contract deployment: HelloWorld
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0xcb322bbfcecc3ff2b53f00b12c03d9d231156448bfaad9541d5c65d42c0b5f55
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            600295 of 600295
  Block #1:            0x190afb5d9137db248a0e9f7bd95501189ac46fcd7b0af783da2c828db34e2031
```
