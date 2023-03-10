import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token/contract-address')
  getTokenContractAddress(): string {
    return this.appService.getTokenContractAddress();
  }

  @Get('ballot/contract-address')
  getBallotContractAddress(): string {
    return this.appService.getBallotContractAddress();
  }
}
