import { Controller, Get } from '@nestjs/common';
import { BallotService } from 'src/services/ballot.service';
import { IBallotController } from './interfaces/ballot.controller.interface';

@Controller()
export class BallotController implements IBallotController {
  constructor(private ballotService: BallotService) {}

  @Get('contract-address')
  getBallotContractAddress(): string {
    return this.ballotService.getBallotContractAddress();
  }
}
