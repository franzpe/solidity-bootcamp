import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokensDTO } from './dtos/RequestTokensDTO';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token/contract-address')
  getTokenContractAddress(): string {
    return this.appService.getTokenContractAddress();
  }

  @Post('token/request-tokens')
  requestTokens(@Body() body: RequestTokensDTO): Promise<string> {
    return this.appService.requestTokens(body.address, body.amount);
  }

  @Get('ballot/contract-address')
  getBallotContractAddress(): string {
    return this.appService.getBallotContractAddress();
  }
}
