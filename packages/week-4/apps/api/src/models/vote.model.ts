import { ApiProperty } from '@nestjs/swagger';
import { BigNumber } from 'ethers';

export class Vote {
  @ApiProperty()
  proposalNumber: BigNumber;

  @ApiProperty()
  votesAmount: BigNumber;

  constructor(proposalNumber: BigNumber, votesAmount: BigNumber) {
    this.proposalNumber = proposalNumber;
    this.votesAmount = votesAmount;
  }
}
