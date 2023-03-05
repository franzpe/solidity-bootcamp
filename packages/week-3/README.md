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
  - [x] give voting tokens
  - [x] delegating voting power
  - [x] ballot contract deployment
  - [x] casting votes
  - [] checking vote power and querying results
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed

## Report

Ballot For best counter-strike game version

```
Proposals:
Proposal N. 1: counter-strike: 1.6
Proposal N. 2: counter-strike: Source
Proposal N. 3: counter-strike: Promod
Proposal N. 4: counter-strike: GO
```

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

### Voting power delegation

Self deletagion

```
╭─    ~/Doc/P/solidity-bootcamp/p/week-3    main !2 ?2 ────── ✔  23s     04:37:06 PM  ─╮
╰─ npm run delegate-voting-power                                                                    ─╯

> week-3@1.0.0 delegate-voting-power
> npx ts-node --files ./scripts/delegateVotingPower.ts 0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5 0x044
D8f25B506CE1872008dAd807609B0C21Cb1BC

c7bbf1f217021c0788f7f5bd7cba732554fd9613302ca5676d5c7fb774256f56
Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
Voting power has been self delegated to account 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
Account 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC has 20.00000000000000001
{
  to: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 55,
  gasUsed: BigNumber { value: "28968" },
  logsBloom: '0x000000000000000000000000000000000000200000000000000000000000000000000000000000000000100
0000000000002000000000000000000000000002000000000000000010000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000001000000000000000000008080000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000
0000000000000',
  blockHash: '0x5d32650cf57034258d5e3704b8c07d144a734c82f741ccc8683ba91a46762b43',
  transactionHash: '0x8305665043161e0da46c56861d02ac7b50a88684a7d9521570920f0aa0b8c468',
  logs: [
    {
      transactionIndex: 55,
      blockNumber: 8602173,
      transactionHash: '0x8305665043161e0da46c56861d02ac7b50a88684a7d9521570920f0aa0b8c468',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x',
      logIndex: 95,
      blockHash: '0x5d32650cf57034258d5e3704b8c07d144a734c82f741ccc8683ba91a46762b43'
    }
  ],
  blockNumber: 8602173,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "6307359" },
  effectiveGasPrice: BigNumber { value: "44497483055" },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 55,
      blockNumber: 8602173,
      transactionHash: '0x8305665043161e0da46c56861d02ac7b50a88684a7d9521570920f0aa0b8c468',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x',
      logIndex: 95,
      blockHash: '0x5d32650cf57034258d5e3704b8c07d144a734c82f741ccc8683ba91a46762b43',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'DelegateChanged',
      eventSignature: 'DelegateChanged(address,address,address)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}
```

```
╭─    ~/Doc/P/solidity-bootcamp/p/week-3    main !2 ?2 
╰─ npm run delegate-voting-power                                                    ─╯

> week-3@1.0.0 delegate-voting-power
> npx ts-node --files ./scripts/delegateVotingPower.ts 0x15545Ed1515c1c7Fe216465F61F4d3
Ca2F076AF5

Connected to the wallet address 0x7ee2d338B038120a5b43a9755402A580fE06bFB9
Voting power has been self delegated to account 0x7ee2d338B038120a5b43a9755402A580fE06b
FB9
Account 0x7ee2d338B038120a5b43a9755402A580fE06bFB9 has 10.0
{
  to: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
  from: '0x7ee2d338B038120a5b43a9755402A580fE06bFB9',
  contractAddress: null,
  transactionIndex: 28,
  gasUsed: BigNumber { value: "112623" },
  logsBloom: '0x00000000000000000000000000000000000020000000000000000000004000000000000
000000200000010000000000000020000000000000000000000000020000000000000000100000000000000
080000000000000000000000000000000000000000000000000040000000000000000000000000000000000
000000001000000000000000000008080000000000000000000000000000000000000000000040000000000
000000000040000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000010000000000000000000
000000',
  blockHash: '0x561feedb7d441ca65d5d4ef732a7d3120ea9f57f2abc734ba6fa6fa3175fe80d',
  transactionHash: '0x3c605e3d54579203e88e6e6549c3b140995920b5bbb346d43a595368c8a8774b'
,
  logs: [
    {
      transactionIndex: 28,
      blockNumber: 8602212,
      transactionHash: '0x3c605e3d54579203e88e6e6549c3b140995920b5bbb346d43a595368c8a87
74b',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x',
      logIndex: 64,
      blockHash: '0x561feedb7d441ca65d5d4ef732a7d3120ea9f57f2abc734ba6fa6fa3175fe80d'
    },
    {
      transactionIndex: 28,
      blockNumber: 8602212,
      transactionHash: '0x3c605e3d54579203e88e6e6549c3b140995920b5bbb346d43a595368c8a87
74b',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x000000000000000000000000000000000000000000000001a055690d9db8000a00000000
0000000000000000000000000000000000000001158e460913d0000a',
      logIndex: 65,
      blockHash: '0x561feedb7d441ca65d5d4ef732a7d3120ea9f57f2abc734ba6fa6fa3175fe80d'
    },
    {
      transactionIndex: 28,
      blockNumber: 8602212,
      transactionHash: '0x3c605e3d54579203e88e6e6549c3b140995920b5bbb346d43a595368c8a87
74b',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 66,
      blockHash: '0x561feedb7d441ca65d5d4ef732a7d3120ea9f57f2abc734ba6fa6fa3175fe80d'
    }
  ],
  blockNumber: 8602212,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "4474505" },
  effectiveGasPrice: BigNumber { value: "24025303059" },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 28,
      blockNumber: 8602212,
      transactionHash: '0x3c605e3d54579203e88e6e6549c3b140995920b5bbb346d43a595368c8a87
74b',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x',
      logIndex: 64,
      blockHash: '0x561feedb7d441ca65d5d4ef732a7d3120ea9f57f2abc734ba6fa6fa3175fe80d',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'DelegateChanged',
      eventSignature: 'DelegateChanged(address,address,address)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    },
    {
      transactionIndex: 28,
      blockNumber: 8602212,
      transactionHash: '0x3c605e3d54579203e88e6e6549c3b140995920b5bbb346d43a595368c8a87
74b',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x000000000000000000000000000000000000000000000001a055690d9db8000a00000000
0000000000000000000000000000000000000001158e460913d0000a',
      logIndex: 65,
      blockHash: '0x561feedb7d441ca65d5d4ef732a7d3120ea9f57f2abc734ba6fa6fa3175fe80d',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'DelegateVotesChanged',
      eventSignature: 'DelegateVotesChanged(address,uint256,uint256)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    },
    {
      transactionIndex: 28,
      blockNumber: 8602212,
      transactionHash: '0x3c605e3d54579203e88e6e6549c3b140995920b5bbb346d43a595368c8a87
74b',
      address: '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5',
      topics: [Array],
      data: '0x000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000008ac7230489e80000',
      logIndex: 66,
      blockHash: '0x561feedb7d441ca65d5d4ef732a7d3120ea9f57f2abc734ba6fa6fa3175fe80d',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'DelegateVotesChanged',
      eventSignature: 'DelegateVotesChanged(address,uint256,uint256)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}
```

### Tokenized Ballot Contract deployment

Ballot for best counter-strike game version

```
╭─    ~/Doc/P/solidity-bootcamp/p/week-3    main !3 ?1 
╰─ npm run hardhat:deploy-ballot                                                    ─╯

> week-3@1.0.0 hardhat:deploy-ballot
> npx hardhat deploy-ballot --tokenaddress 0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5 '
counter-strike: 1.6' 'counter-strike: Source' 'counter-strike: Promod' 'counter-strike:
 GO'

Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
Wallet balance: 227125906559581511 Wei
Deploying Tokenized Ballot contract
Proposals:
Proposal N. 1: counter-strike: 1.6
Proposal N. 2: counter-strike: Source
Proposal N. 3: counter-strike: Promod
Proposal N. 4: counter-strike: GO
Deploying contract ...
The Ballot contract was deployed at the address 0x681782241a0664F8221e1C5D531D05D88A8Cc9a3
9a3 for block number 8602393
{
  deployTxReceipt: {
    to: null,
    from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
    contractAddress: '0x681782241a0664F8221e1C5D531D05D88A8Cc9a3',
    transactionIndex: 20,
    gasUsed: BigNumber { value: "688835" },
    logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000',
    blockHash: '0x3ee6a96b6417583399d1cb2bf5755364c7c6c20748de62e5829256b1f40256a4',
    transactionHash: '0xfe568d3ff726ca727b3e86b64687f14535f12f7423bcd6a5e19952b68092eef
8',
    logs: [],
    blockNumber: 8602395,
    confirmations: 1,
    cumulativeGasUsed: BigNumber { value: "5969969" },
    effectiveGasPrice: BigNumber { value: "10022718960" },
    status: 1,
    type: 2,
    byzantium: true,
    events: []
  }
}

```

### Cast votes

```
╭─    ~/Doc/P/solidity-bootcamp/packages/week-3    main !2 ?1 ───── 1 ✘    06:01:03 PM  ─╮
╰─ npm run cast-votes                                                                               ─╯

> week-3@1.0.0 cast-votes
> npx ts-node --files ./scripts/castVotes.ts 0x681782241a0664F8221e1C5D531D05D88A8Cc9a3 1 10

0x681782241a0664F8221e1C5D531D05D88A8Cc9a3
Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
Account 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC has voted for proposal num: 1 with amount of 10 and
has 10000000000000000010 of voting power left.
{
  to: '0x681782241a0664F8221e1C5D531D05D88A8Cc9a3',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 31,
  gasUsed: BigNumber { value: "86554" },
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000',
  blockHash: '0xe85e2cea0b888ba8250e1def7c592752b287a565dbbffe8bf6d2f81c43ac78d5',
  transactionHash: '0x240c6bcd0a5334f63cea055a29208525a7b54f9939162294fa28c4b6c3ed5375',
  logs: [],
  blockNumber: 8602511,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "5742076" },
  effectiveGasPrice: BigNumber { value: "7763063720" },
  status: 1,
  type: 2,
  byzantium: true,
  events: []
}
```

```
╭─    ~/Doc/P/solidity-bootcamp/p/week-3    main !2 ?1 ────── ✔  15s     06:03:42 PM  ─╮
╰─ npm run cast-votes                                                                               ─╯

> week-3@1.0.0 cast-votes
> npx ts-node --files ./scripts/castVotes.ts 0x681782241a0664F8221e1C5D531D05D88A8Cc9a3 0 10

0x681782241a0664F8221e1C5D531D05D88A8Cc9a3
Connected to the wallet address 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC
Account 0x044D8f25B506CE1872008dAd807609B0C21Cb1BC has voted for proposal num: 0 with amount of 10 and
has 0.00000000000000001 of voting power left.
{
  to: '0x681782241a0664F8221e1C5D531D05D88A8Cc9a3',
  from: '0x044D8f25B506CE1872008dAd807609B0C21Cb1BC',
  contractAddress: null,
  transactionIndex: 37,
  gasUsed: BigNumber { value: "69442" },
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000',
  blockHash: '0xd01baed3ba399f0c8fe70dfc57828824d49597b74c44fd65254bd88fe3557c40',
  transactionHash: '0xef9cbc0d32351954e2db0c979854cee75bbd784eaad8ebc35ade9b10318e15f0',
  logs: [],
  blockNumber: 8602524,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "7101990" },
  effectiveGasPrice: BigNumber { value: "7804138583" },
  status: 1,
  type: 2,
  byzantium: true,
  events: []
}
```

```
╭─    ~/Doc/P/solidity-bootcamp/packages/week-3    main !2 ?1 ─────── ✔    06:06:44 PM  ─╮
╰─ npm run cast-votes                                                                               ─╯

> week-3@1.0.0 cast-votes
> npx ts-node --files ./scripts/castVotes.ts 0x681782241a0664F8221e1C5D531D05D88A8Cc9a3 0 6

0x681782241a0664F8221e1C5D531D05D88A8Cc9a3
Connected to the wallet address 0x7ee2d338B038120a5b43a9755402A580fE06bFB9
Account 0x7ee2d338B038120a5b43a9755402A580fE06bFB9 has voted for proposal num: 0 with amount of 6 and h
as 4.0 of voting power left.
{
  to: '0x681782241a0664F8221e1C5D531D05D88A8Cc9a3',
  from: '0x7ee2d338B038120a5b43a9755402A580fE06bFB9',
  contractAddress: null,
  transactionIndex: 32,
  gasUsed: BigNumber { value: "66490" },
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000',
  blockHash: '0x262bf9c913796e05b30645cb439227b4954c6093bf4d0e195512caa617859555',
  transactionHash: '0x3177006da17eb386ed080119739211446119e3318855b29cb3782842a25368ab',
  logs: [],
  blockNumber: 8602536,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "6416415" },
  effectiveGasPrice: BigNumber { value: "5587701998" },
  status: 1,
  type: 2,
  byzantium: true,
  events: []
}
```

```
╭─    ~/Doc/P/solidity-bootcamp/p/week-3    main !2 ?1 ──── 1 ✘  3s     06:10:08 PM  ─╮
╰─ npm run cast-votes                                                                              ─╯

> week-3@1.0.0 cast-votes
> npx ts-node --files ./scripts/castVotes.ts 0x681782241a0664F8221e1C5D531D05D88A8Cc9a3 3 4

0x681782241a0664F8221e1C5D531D05D88A8Cc9a3
Connected to the wallet address 0x7ee2d338B038120a5b43a9755402A580fE06bFB9
Account 0x7ee2d338B038120a5b43a9755402A580fE06bFB9 has voted for proposal num: 3 with amount of 4 and
has 0.0 of voting power left.
{
  to: '0x681782241a0664F8221e1C5D531D05D88A8Cc9a3',
  from: '0x7ee2d338B038120a5b43a9755402A580fE06bFB9',
  contractAddress: null,
  transactionIndex: 16,
  gasUsed: BigNumber { value: "66502" },
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000',
  blockHash: '0x5eae61e619990be50c8754716dd4e1885b4b911a46348426a276a80d1aa73644',
  transactionHash: '0x435bfc7a80d737068fc672afa81d0903f048e85dea34353196029d3bae4b755c',
  logs: [],
  blockNumber: 8602544,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { value: "8009755" },
  effectiveGasPrice: BigNumber { value: "5424962645" },
  status: 1,
  type: 2,
  byzantium: true,
  events: []
}
```
