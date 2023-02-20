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
  Deployment
    ✔ Should deploy contract with the right owner (341ms)
  Ownership manipulation
    ✔ Should transfer ownership (71ms)
    ✔ Should fail transfer ownership by other account to itself
  Text manipulation
    ✔ Should return Hello World String
    ✔ Should set text to - Hi from team 8 (75ms)
    ✔ Should fail setting text by other account than owner
  Cross-contract call (using interface from SideHelloWorld to HelloWorld)
    ✔ Should make a helloWorld cross-contract call and return text (56ms)
    ✔ Should transferOnwership to SideHelloWorld (80ms)
    ✔ Should transferOnwership to SideHelloWorld and make setText cross-contract call (131ms)
    ✔ Should transferOnwership to SideHelloWorld and make setText cross-contract call (128ms)
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
  Transaction:         0x792fb8eb5ceb64d4f794f2325486ea7fce56b094d54d69899fdac0081c0cf7b7
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            691596 of 691596
  Block #1:            0x0c878f43c2f5a7c0d921c256e887ac317135e60c7a00d0f4313d69bbc6e51ca1

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
  Transaction:         0x128083c65a5a10cff0b3561193cdba1cb7c4eaed29e1f22366fad919d9b20271
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            27168 of 27168
  Block #2:            0x4e731e25adfdc1cf0c3814203fba320279e68da8505780d1e2c40ec031023a68

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
      at HelloWorld.onlyOwner (src/contracts/HelloWorld.sol:34)
      at HelloWorld.transferOwnership (src/contracts/HelloWorld.sol:29)
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
  Transaction:         0xb4fb5ca5360249918d02c21e0d1bcf8931f6222a744eb4230d0f09023ed6a8e7
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            29884 of 29884
  Block #2:            0x546a27edf4cd9e48ddd1d6500a9f32926596f561eab428eacafdd1f610561490

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
      at HelloWorld.onlyOwner (src/contracts/HelloWorld.sol:34)
      at HelloWorld.setText (src/contracts/HelloWorld.sol:25)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at async EthModule._estimateGasAction (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:429:7)
      at async HardhatNetworkProvider._sendWithLogging (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:144:22)
      at async HardhatNetworkProvider.request (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:121:18)
      at async JsonRpcHandler._handleRequest (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:191:20)
      at async JsonRpcHandler._handleSingleRequest (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:152:17)
      at async Server.JsonRpcHandler.handleHttp (/Users/frantisek/Documents/Projects/solidity-bootcamp/node_modules/hardhat/src/internal/hardhat-network/jsonrpc/handler.ts:52:21)

evm_revert
evm_snapshot
eth_accounts
eth_chainId
eth_accounts
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract deployment: SideHelloWorld
  Contract address:    0x663f3ad617193148711d28f5334ee4ed07016602
  Transaction:         0xeb8f3211f47f8a8f1d38914704e62dd00149e4408ee1172c26a9d3b198760464
  From:                0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
  Value:               0 ETH
  Gas used:            572039 of 572039
  Block #2:            0xf79fd8073f608fbdd3cc2f66c1b88f39bf01ed8b28a5af2084d9511314f77899

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
evm_snapshot
eth_chainId
eth_call
  Contract call:       SideHelloWorld#callHelloWorld
  From:                0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
  To:                  0x663f3ad617193148711d28f5334ee4ed07016602

evm_revert
evm_snapshot
eth_accounts
eth_chainId
eth_accounts
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract deployment: SideHelloWorld
  Contract address:    0x663f3ad617193148711d28f5334ee4ed07016602
  Transaction:         0xeb8f3211f47f8a8f1d38914704e62dd00149e4408ee1172c26a9d3b198760464
  From:                0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
  Value:               0 ETH
  Gas used:            572039 of 572039
  Block #2:            0xf79fd8073f608fbdd3cc2f66c1b88f39bf01ed8b28a5af2084d9511314f77899

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
evm_snapshot
eth_chainId
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract call:       HelloWorld#transferOwnership
  Transaction:         0xe954da2b86cdf4f21b509729c4ec1ff23291b00de852617f2ec8bcc5377edc8b
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            27168 of 27168
  Block #3:            0x737e6b612c0611f7f40f5a7464812a9737d3b3c710ef1fddc16be4a45448173a

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_call
  Contract call:       HelloWorld#owner
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

evm_revert
evm_snapshot
eth_chainId
eth_accounts (2)
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract deployment: SideHelloWorld
  Contract address:    0x663f3ad617193148711d28f5334ee4ed07016602
  Transaction:         0xeb8f3211f47f8a8f1d38914704e62dd00149e4408ee1172c26a9d3b198760464
  From:                0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
  Value:               0 ETH
  Gas used:            572039 of 572039
  Block #2:            0xf79fd8073f608fbdd3cc2f66c1b88f39bf01ed8b28a5af2084d9511314f77899

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
evm_snapshot
eth_chainId
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract call:       HelloWorld#transferOwnership
  Transaction:         0xe954da2b86cdf4f21b509729c4ec1ff23291b00de852617f2ec8bcc5377edc8b
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            27168 of 27168
  Block #3:            0x737e6b612c0611f7f40f5a7464812a9737d3b3c710ef1fddc16be4a45448173a

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract call:       SideHelloWorld#callSetText
  Transaction:         0x162e4bdedfb5bcb9e08fee08d94fb176f9a2d93d46a80f6785f3c9848cce2c15
  From:                0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
  To:                  0x663f3ad617193148711d28f5334ee4ed07016602
  Value:               0 ETH
  Gas used:            36292 of 36575
  Block #4:            0x52b8a31dde2cbf2dffb910b990de19b4c03f688a7e2a881250f662ffccb30267

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_call
  Contract call:       HelloWorld#helloWorld
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

evm_revert
evm_snapshot
eth_accounts
eth_chainId
eth_accounts
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract deployment: SideHelloWorld
  Contract address:    0x663f3ad617193148711d28f5334ee4ed07016602
  Transaction:         0xeb8f3211f47f8a8f1d38914704e62dd00149e4408ee1172c26a9d3b198760464
  From:                0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
  Value:               0 ETH
  Gas used:            572039 of 572039
  Block #2:            0xf79fd8073f608fbdd3cc2f66c1b88f39bf01ed8b28a5af2084d9511314f77899

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
evm_snapshot
eth_chainId
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract call:       HelloWorld#transferOwnership
  Transaction:         0xe954da2b86cdf4f21b509729c4ec1ff23291b00de852617f2ec8bcc5377edc8b
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            27168 of 27168
  Block #3:            0x737e6b612c0611f7f40f5a7464812a9737d3b3c710ef1fddc16be4a45448173a

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract call:       SideHelloWorld#callSetText
  Transaction:         0x162e4bdedfb5bcb9e08fee08d94fb176f9a2d93d46a80f6785f3c9848cce2c15
  From:                0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
  To:                  0x663f3ad617193148711d28f5334ee4ed07016602
  Value:               0 ETH
  Gas used:            36292 of 36575
  Block #4:            0x52b8a31dde2cbf2dffb910b990de19b4c03f688a7e2a881250f662ffccb30267

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_call
  Contract call:       HelloWorld#helloWorld
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
```
