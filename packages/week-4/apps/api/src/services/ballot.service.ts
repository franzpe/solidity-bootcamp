import { Injectable } from '@nestjs/common';
import { BaseService } from './abstract/BaseService';
import { IBallotService } from './interfaces/ballot.service.interface';

@Injectable()
export class BallotService extends BaseService implements IBallotService {
  getBallotContractAddress(): string {
    return this.ballotContract.address;
  }
}
