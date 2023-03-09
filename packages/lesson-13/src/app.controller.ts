import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  AppService,
  FulfillPaymentOrderDTO,
  PaymentOrder,
  PaymentOrderDTO,
  RequestTokensDTO,
} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/contract-address')
  getContractAddress(): { address: string } {
    return { address: this.appService.getContractAddress() };
  }

  @Get('/total-supply')
  getTotalSupply(): Promise<number> {
    return this.appService.getTotalSupply();
  }

  @Get('/allowance')
  getAllowance(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<number> {
    return this.appService.getAllowance(from, to);
  }

  @Get('/transaction-status')
  getTransStatus(@Query('hash') hash: string): Promise<string> {
    return this.appService.getTransactionStatus(hash);
  }

  @Get('/payment-orders')
  getPaymentOrders(): PaymentOrder[] {
    return this.appService.listPaymentOrders();
  }

  @Post('/payment-order')
  paymentOrder(@Body() body: PaymentOrderDTO) {
    return this.appService.createPaymentOrder(body.value, body.secret);
  }

  @Post('/fulfill-payment')
  fulfillPaymentOrder(@Body() body: FulfillPaymentOrderDTO) {
    return this.appService.fulfillPaymentOrder(
      body.id,
      body.secret,
      body.address,
    );
  }

  @Post('/request-tokens')
  requestTokens(@Body() body: RequestTokensDTO) {
    return { result: this.appService.requestTokens(body.address, body.amount) };
  }
}
