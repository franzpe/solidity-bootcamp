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

### Deployment

```
Deploying the contract with address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Contract HelloWorld deployed to adress: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Report from RPC server:

```
Contract deployment: HelloWorld
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x9b5754fca4fe8777e83132493fe763cdf9405c8a242ab2469c324466c5deebd7
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            600295 of 600295
  Block #1:            0x0490e3a9d9ce9b7d9e464f20c612e7ebd95b83d6e6439fc3ae7396208cae42dd
```

### Tests report from RPC server

```
eth_accounts
eth_chainId
eth_accounts
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_getBlockByNumber
eth_feeHistory
eth_sendTransaction
  Contract deployment: HelloWorld
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x9b5754fca4fe8777e83132493fe763cdf9405c8a242ab2469c324466c5deebd7
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            600295 of 600295
  Block #1:            0x0490e3a9d9ce9b7d9e464f20c612e7ebd95b83d6e6439fc3ae7396208cae42dd

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
web3_clientVersion
evm_snapshot
eth_chainId
eth_call
  Contract call:       HelloWorld#owner
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

evm_revert
evm_snapshot
eth_chainId (2)
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract call:       HelloWorld#transferOwnership
  Transaction:         0x405ee18157dfd3e7f4bf2304d83706b9835a4342dbf23c0c28c47dfae80bbde7
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            27168 of 27168
  Block #2:            0xe1c01b266bb0a02e978667ef25372ca3b383f22b1da4cdff1b5582d88511c993

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_call
  Contract call:       HelloWorld#owner
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

evm_revert
evm_snapshot
eth_chainId (2)
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
  Contract call:       HelloWorld#transferOwnership
  From:                0x70997970c51812dc3a010c7d01b50e0d17dc79c8
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH

  Error: VM Exception while processing transaction: reverted with reason string 'Caller is not the owner'
      at HelloWorld.onlyOwner (src/contracts/HelloWorld.sol:32)
      at HelloWorld.transferOwnership (src/contracts/HelloWorld.sol:27)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at async EthModule._estimateGasAction (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:429:7)
      at async HardhatNetworkProvider._sendWithLogging (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:144:22)
      at async HardhatNetworkProvider.request (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:121:18)
      at async JsonRpcHandler._handleRequest (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:191:20)
      at async JsonRpcHandler._handleSingleRequest (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:152:17)
      at async Server.JsonRpcHandler.handleHttp (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:52:21)

evm_revert
evm_snapshot
eth_chainId (2)
eth_call
  Contract call:       HelloWorld#helloWorld
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

evm_revert
evm_snapshot
eth_chainId (2)
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract call:       HelloWorld#setText
  Transaction:         0x194bb4723afc3054e408fd4b62c89efb34e3bbab58ebf40717b814ebbcd94e2b
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            29884 of 29884
  Block #2:            0xcb46a786220ac5505b6752f6cd884fa758c7013ba3d01f8476ae473b9756b67c

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_call
  Contract call:       HelloWorld#helloWorld
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

evm_revert
evm_snapshot
eth_chainId (2)
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
  Contract call:       HelloWorld#setText
  From:                0x70997970c51812dc3a010c7d01b50e0d17dc79c8
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH

  Error: VM Exception while processing transaction: reverted with reason string 'Caller is not the owner'
      at HelloWorld.onlyOwner (src/contracts/HelloWorld.sol:32)
      at HelloWorld.setText (src/contracts/HelloWorld.sol:23)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at async EthModule._estimateGasAction (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:429:7)
      at async HardhatNetworkProvider._sendWithLogging (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:144:22)
      at async HardhatNetworkProvider.request (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:121:18)
      at async JsonRpcHandler._handleRequest (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:191:20)
      at async JsonRpcHandler._handleSingleRequest (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:152:17)
      at async Server.JsonRpcHandler.handleHttp (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:52:21)

eth_blockNumber (6)
```
