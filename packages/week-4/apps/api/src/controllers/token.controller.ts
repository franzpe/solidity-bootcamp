import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequestTokensDTO } from 'src/models/requestTokensDTO.model';
import { TokenService } from 'src/services/token.service';
import { ITokenController } from './interfaces/token.controller.interface';

@Controller()
export class TokenController implements ITokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('contract-address')
  getTokenContractAddress(): string {
    return this.tokenService.getTokenContractAddress();
  }

  @Post('request-tokens')
  requestTokens(@Body() body: RequestTokensDTO): Promise<string> {
    return this.tokenService.requestTokens(body.address, body.amount);
  }
}
