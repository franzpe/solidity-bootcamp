# Final project - PvP Game

## Global Features

- [x] App project scaffolded by create-web3-dapp
- [x] Create player & authentication
- [ ] Validate jwt token from next-auth in nest application
- [x] Pull player info on Login
- [ ] Lobby
  - [x] Join
  - [x] Leave
  - [x] Websocket connnection invalidate queries
  - [x] Challenge
  - [x] Accept / reject challenge
  - [ ] Pickpocket ?
  - [ ] Rankings
- [ ] Character View
- [ ] Fight

  - [x] Layout
  - [x] Attack
  - [x] Combats
  - [x] End with winner
  - [ ] Message?
  - [ ] Receive rewards

- FE nextjs (typescript) - rainbowkit, wagmi
  - Authentication - next-auth, wagmi, siwe, @rainbow-me/rainbowkit-siwe-next-auth
  - UI - Tailwind, DaisUI
- BE - nestjs, mongodb

## Smart contract desired features (tests for every item):

- [ ] Implementation of ERC 1155 (mint FT: gold as currency, and NFT: 4 items - head, chest, legs, weapon)
- [ ] Implementation Game Contract (Note: ERC115Holder), which should have the structure of the Game (frontend/backend):
      mapping(address => User) users;
      mapping(sting => battle) battles;
      enum Seasons;
      struct Battle {
      NFT: ,
      gold_amount: ,
      }
      struct User {
      seasons_participated:
      battles_won:
      gold_amount:
      }
- [ ] Rewards (FT gold and NFT items) randomization for winner
- [ ] Season winner is decided based on number of wins
- [ ] Season takes X amount of time: set by admin
- [ ] Upgradability

Techs

- [ ] ERC1155 for FT and NFT's
- [ ] IPFS - store NFT image
- [ ] Websockets
- [ ] Use wallet connection, Wagmi, Rainbowkit?

## GameItems - ERC1155

https://docs.openzeppelin.com/contracts/3.x/erc1155
https://docs.openzeppelin.com/contracts/4.x/wizard

## Game attributes

- Currency: Gold
- Item slots: Head, chest, legs, weapon
- Spells: Normal Attack, Sinister Strike, Gouge, Evicserate
- Attributes: Health, Energy, Strength (Damage), Agility (Chance to critical hit)
- Fight ?
