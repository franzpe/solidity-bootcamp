import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, ethers } from 'ethers';
import { BaseService } from './abstract/BaseService';
import { IBallotService } from './interfaces/ballot.service.interface';

@Injectable()
export class BallotService extends BaseService implements IBallotService {
  constructor(configService: ConfigService) {
    super(configService);

    this.initWebsocket();
  }

  async initWebsocket() {
    const provider = new ethers.providers.WebSocketProvider(
      `wss://eth-goerli.g.alchemy.com/v2/${this.configService.get<string>(
        'ALCHEMY_WS_KEY',
      )}`,
    );

    const contract = await this.buildCustomBallotContract(provider);

    contract.on(
      'Vote',
      (address: string, proposal: BigNumber, amount: BigNumber) => {
        const info = { address, proposal, amount };
        console.info(JSON.stringify(info, null, 4));
      },
    );
  }

  getBallotContractAddress(): string {
    return this.ballotContract.address;
  }
}
