# Tokenized Ballot

[Curicullum link](https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-12)

## Challenge explanation

- Form groups of 3 to 5 students
- Complete the contracts together
- Develop and run scripts for “TokenizedBallot.sol” within your group to give **voting tokens, delegating voting power, casting votes, checking vote power and querying results**
- **Write a report** with each function execution and the transaction hash, if successful, or the revert reason, if failed
- Share your code in a github repo in the submission form

### Requirements

- Develop and run scripts for “TokenizedBallot.sol” within your group to
  - give voting tokens
  - delegating voting power
  - casting votes
  - checking vote power and querying results
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed

## Report

### MyToken deployment

```
Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
Wallet balance: 254939886337124924 Wei
Deploying MyToken contract
Proposals:
Deploying contract ...
The token contract was deployed at the address 0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5
{
  deployTxReceipt: {
    to: null,
    from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
    contractAddress: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
    transactionIndex: 32,
    gasUsed: BigNumber { value: "3987278" },
    logsBloom: '0x00000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000020000000000000000100000000000000000000000000000000000000000000000000000000020000000000000000000800000000000000000000000000001001000000000000000000008080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000001000000000000100000000000020000000000000000000000000000000000000000010000000000000000000000000',
    blockHash: '0xc9f35819afc3bad84d5855bcff6c0a5cbc8ade63665c1670b7306b1b445ff54d',
    transactionHash: '0x0ba04ea6da12000bfdb43453db75f13ea43fb32a2a79505696b6ffca49c05d13',
    logs: [ [Object], [Object] ],
    blockNumber: 8600483,
    confirmations: 1,
    cumulativeGasUsed: BigNumber { value: "19762136" },
    effectiveGasPrice: BigNumber { value: "1500821172" },
    status: 1,
    type: 2,
    byzantium: true,
    events: [ [Object], [Object] ]
  }
}
```

### Mint MyTokens

For address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC mint 10 tokens:

```
script run: "mint-tokens": "npx ts-node --files ./scripts/mintTokens.ts 0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC 10",

Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
10000000000000000000 tokens have been minted for address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
{
  to: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 54,
  gasUsed: BigNumber { value: "73354" },
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000002000000000000000010000000800000000000000000000000000000000000000
0000000000020000000000000000000800000000000000000000000010000001000000000000000000008080000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000
0000000000000000000000000000000000000000000000002000000000000000000000000000000000000000001000000000000
0000000000000',
  blockHash: '0x7feaa668640f3a7407f5db7ea594473d0b8aea656b4a4f034311f9f5b1b53980',
  transactionHash: '0x00b789aba5dd3a0ac9e04ee8e47dfa12eaa90437b80835769914278d4ddaff83',
  logs: [
    {
      transactionIndex: 54,
      blockNumber: 8601139,
      transactionHash: '0x00b789aba5dd3a0ac9e04ee8e47dfa12eaa90437b80835769914278d4ddaff83',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 149,
      blockHash: '0x7feaa668640f3a7407f5db7ea594473d0b8aea656b4a4f034311f9f5b1b53980'
    }
  ],
  blockNumber: 8601139,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "8666160" },
  effectiveGasPrice: BigNumber { value: "30599781367" },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 54,
      blockNumber: 8601139,
      transactionHash: '0x00b789aba5dd3a0ac9e04ee8e47dfa12eaa90437b80835769914278d4ddaff83',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 149,
      blockHash: '0x7feaa668640f3a7407f5db7ea594473d0b8aea656b4a4f034311f9f5b1b53980',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'Transfer',
      eventSignature: 'Transfer(address,address,uint256)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}
```

For address 0x7ee2d338B038120a5b43a9755402A580fE06bFB9 mint 10 tokens:

```
script run: mint-tokens": "npx ts-node --files ./scripts/mintTokens.ts 0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5 0x7ee2d338B038120a5b43a9755402A580fE06bFB9 10",

Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
10000000000000000000 tokens have been minted for address 0x7ee2d338B038120a5b43a9755402A580fE06bFB9
{
  to: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 26,
  gasUsed: BigNumber { value: "90466" },
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000040000000000000000000000000000
0000000000000000000000000000000000000002000000000000000010000000800000008000000000000000000000000000000
0000000000020000000000000000000800000000000000000000000010000000000000000000000000008000000000000000000
0000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000020000
0000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000
0000000000000',
  blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467',
  transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
  logs: [
    {
      transactionIndex: 26,
      blockNumber: 8601164,
      transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 60,
      blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467'
    }
  ],
  blockNumber: 8601164,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "4564972" },
  effectiveGasPrice: BigNumber { value: "25798361056" },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 26,
      blockNumber: 8601164,
      transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 60,
      blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'Transfer',
      eventSignature: 'Transfer(address,address,uint256)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}

Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
10000000000000000000 tokens have been minted for address 0x7ee2d338B038120a5b43a9755402A580fE06bFB9
{
  to: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 26,
  gasUsed: BigNumber { value: "90466" },
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000040000000000000000000000000000
0000000000000000000000000000000000000002000000000000000010000000800000008000000000000000000000000000000
0000000000020000000000000000000800000000000000000000000010000000000000000000000000008000000000000000000
0000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000020000
0000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000
0000000000000',
  blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467',
  transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
  logs: [
    {
      transactionIndex: 26,
      blockNumber: 8601164,
      transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 60,
      blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467'
    }
  ],
  blockNumber: 8601164,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "4564972" },
  effectiveGasPrice: BigNumber { value: "25798361056" },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 26,
      blockNumber: 8601164,
      transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 60,
      blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'Transfer',
      eventSignature: 'Transfer(address,address,uint256)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}

Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
10000000000000000000 tokens have been minted for address 0x7ee2d338B038120a5b43a9755402A580fE06bFB9
{
  to: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 26,
  gasUsed: BigNumber { value: "90466" },
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000040000000000000000000000000000
0000000000000000000000000000000000000002000000000000000010000000800000008000000000000000000000000000000
0000000000020000000000000000000800000000000000000000000010000000000000000000000000008000000000000000000
0000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000020000
0000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000
0000000000000',
  blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467',
  transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
  logs: [
    {
      transactionIndex: 26,
      blockNumber: 8601164,
      transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 60,
      blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467'
    }
  ],
  blockNumber: 8601164,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "4564972" },
  effectiveGasPrice: BigNumber { value: "25798361056" },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 26,
      blockNumber: 8601164,
      transactionHash: '0xe1fb92130d7e17f869f7499950f741c56f07275778ead1a8a745ee3c3661299a',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 60,
      blockHash: '0x055670521b35411e8ce17558404c2e95f598f444f28e61905c1ca9ac5c0fc467',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'Transfer',
      eventSignature: 'Transfer(address,address,uint256)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}
```

### Grant Minter Role

```
╭─    ~/Doc/P/solidity-bootcamp/p/week-3    main !2 ?2 ────── ✔  16s     12:34:08 PM  ─╮
╰─ npm run give-minter-role                                                                         ─╯

> week-3@1.0.0 give-minter-role
> npx ts-node --files ./scripts/giveMinterRole.ts 0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5 0xA59b230b
8f43C888F554F6b9207462fb8b9B2dE7 10

Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
Minter role has been given to account 0xA59b230b8f43C888F554F6b9207462fb8b9B2dE7
{
  to: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 38,
  gasUsed: BigNumber { value: "52095" },
  logsBloom: '0x010000040000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000400000000000000000000000000000002000000000000000010000000000000000000000000000000000000000000000
0000000001000000000000000000000000000000000000000000000000001001000000000000000000008080000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000
0000000000000000000000100000001000010000000000000000000000000000000000000000000000000000001000000000000
0000000000000',
  blockHash: '0xfba51614876a23c7ac2149d5787fe455d55183990820e66ce53d4c19dd4ffc1f',
  transactionHash: '0x426852c7af7b3b0fd8a4b6d1230452d95bd93b8e5ac229a20f3a6837ea4b2f62',
  logs: [
    {
      transactionIndex: 38,
      blockNumber: 8602063,
      transactionHash: '0x426852c7af7b3b0fd8a4b6d1230452d95bd93b8e5ac229a20f3a6837ea4b2f62',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x',
      logIndex: 99,
      blockHash: '0xfba51614876a23c7ac2149d5787fe455d55183990820e66ce53d4c19dd4ffc1f'
    }
  ],
  blockNumber: 8602063,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "6035364" },
  effectiveGasPrice: BigNumber { value: "54495117705" },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 38,
      blockNumber: 8602063,
      transactionHash: '0x426852c7af7b3b0fd8a4b6d1230452d95bd93b8e5ac229a20f3a6837ea4b2f62',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x',
      logIndex: 99,
      blockHash: '0xfba51614876a23c7ac2149d5787fe455d55183990820e66ce53d4c19dd4ffc1f',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'RoleGranted',
      eventSignature: 'RoleGranted(bytes32,address,address)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}
```

```
╭─    ~/Doc/P/solidity-bootcamp/p/week-3    main !1 ?2 ────── ✔  15s     04:16:29 PM  ─╮
╰─ npm run give-minter-role                                                                         ─╯

> week-3@1.0.0 give-minter-role
> npx ts-node --files ./scripts/giveMinterRole.ts 0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5 0xA59b230b
8f43C888F554F6b9207462fb8b9B2dE7 10

Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
Minter role has been given to account 0xA59b230b8f43C888F554F6b9207462fb8b9B2dE7
{
  to: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 24,
  gasUsed: BigNumber { value: "29797" },
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000',
  blockHash: '0xab8e9b4c8c624a47aabbc6c67cb99184fe5730c6789c015b97563fdd8a3a4c03',
  transactionHash: '0xbbb511e572c278a31ea7aff0446892c91089ce1a02f8e80eef5b86d7c34e34fd',
  logs: [],
  blockNumber: 8602071,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "5088436" },
  effectiveGasPrice: BigNumber { value: "63144902894" },
  status: 1,
  type: 2,
  byzantium: true,
  events: []
}
```
