import { Component } from '@angular/core';
import { ethers } from 'ethers';

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

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');

    this.provider
      .getBlock('latest')
      .then((block) => (this.blockNumber = block.number));
  }

  syncBlock() {
    this.provider.getBlock('latest').then((block) => {
      this.blockNumber = block.number;
      this.transactions = block.transactions;
    });
  }

  clear() {
    this.blockNumber = 0;
  }
}
