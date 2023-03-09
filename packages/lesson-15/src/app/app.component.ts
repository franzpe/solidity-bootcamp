import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Contract, ethers, utils, Wallet } from 'ethers';
import tokenJson from '../assets/MyToken.json';

const API_URL = 'http://localhost:3000';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-test-app';
  name = 'frank';
  provider: ethers.providers.BaseProvider;
  blockNumber: number = 0;
  transactions: string[] | undefined;

  // From lesson 16
  userWallet: Wallet | undefined;
  userEthBalance: number | undefined;
  userTokenBalance: number | undefined;
  tokenContractAddress: string | undefined;
  tokenContract: Contract | undefined;
  totalSupply: number | undefined;

  constructor(private http: HttpClient) {
    this.provider = ethers.getDefaultProvider('goerli');

    this.provider.getBlock('latest').then(block => (this.blockNumber = block.number));
  }

  getTokenAddress() {
    return this.http.get<{ address: string }>(API_URL + '/contract-address');
  }

  updateTokenInfo() {
    if (!this.tokenContractAddress) return;

    this.tokenContract = new Contract(this.tokenContractAddress, tokenJson.abi, this.userWallet ?? this.provider);
    this.tokenContract['totalSupply']().then((totalSupplyBN: ethers.BigNumber) => {
      this.totalSupply = parseFloat(utils.formatEther(totalSupplyBN));
    });
  }

  requestTokens(amount: string) {
    const body = { address: this.userWallet?.address, amount };
    this.http.post<{ result: string }>(API_URL + '/request-tokens', body).subscribe(result => {
      console.log('requested tokens:', amount);
      console.log(result);
    });
  }

  syncBlock() {
    this.provider.getBlock('latest').then(block => {
      this.blockNumber = block.number;
      this.transactions = block.transactions;
    });
    this.getTokenAddress().subscribe(response => {
      this.tokenContractAddress = response.address;
      this.updateTokenInfo();
    });
  }

  clear() {
    this.blockNumber = 0;
  }

  createWallet() {
    this.userWallet = Wallet.createRandom().connect(this.provider);
    this.userWallet.getBalance().then(balanceBN => {
      const balanceStr = utils.formatEther(balanceBN);
      this.userEthBalance = parseFloat(balanceStr);
    });
  }
}
