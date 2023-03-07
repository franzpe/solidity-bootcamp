import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

const CONTRACT_ADDRESS = '0xF87E4c0d83f54e51FE5e911FaF4ce9D4D8e05310';

export class PaymentOrder {
  id: number;
  secret: string;
  value: number;
}

export class PaymentOrderDTO {
  value: number;
  secret: string;
}

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  paymentOrders: PaymentOrder[];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.paymentOrders = new Array<PaymentOrder>();

    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      tokenJson.abi,
      this.provider,
    );
  }

  async getTransactionStatus(hash: string) {
    return (await (await this.provider.getTransaction(hash)).wait()).status == 1
      ? 'Completed'
      : 'Reverted';
  }

  async getAllowance(from: string, to: string): Promise<number> {
    const allowanceBN = await this.contract.allowance(from, to);

    const allowanceString = ethers.utils.formatEther(allowanceBN);

    return parseFloat(allowanceString);
  }

  async getTotalSupply(): Promise<number> {
    const totalSupplyBN = await this.contract.totalSupply();

    const totalSupplyString = ethers.utils.formatEther(totalSupplyBN);

    return parseFloat(totalSupplyString);
  }

  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }

  listPaymentOrders() {
    return this.paymentOrders;
  }

  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.id = this.paymentOrders.length;
    newPaymentOrder.secret = secret;
    newPaymentOrder.value = value;
    this.paymentOrders.push(newPaymentOrder);
  }
}
