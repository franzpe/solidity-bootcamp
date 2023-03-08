import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

const CONTRACT_ADDRESS = '0x15545Ed1515c1c7Fe216465F61F4d3Ca2F076AF5';

export class PaymentOrder {
  id: number;
  secret: string;
  value: number;
}

export class FulfillPaymentOrderDTO {
  id: number;
  secret: string;
  address: string;
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

  constructor(private configService: ConfigService) {
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

  async fulfillPaymentOrder(id: number, secret: string, address: string) {
    const paymentOrder = this.paymentOrders.find((p) => p.id === id);

    if (!paymentOrder) {
      throw new NotFoundException('Payment order not found');
    }

    if (paymentOrder.secret !== secret) {
      throw new ForbiddenException('Invalid secret');
    }

    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    if (!privateKey) {
      throw new InternalServerErrorException('Wrong server configuration');
    }

    const signer = new ethers.Wallet(privateKey, this.provider);

    const tx = await this.contract
      .connect(signer)
      .mint(address, ethers.utils.parseEther(paymentOrder.value.toString()));

    const txReceipt = await tx.wait();

    console.log(txReceipt);
  }
}
