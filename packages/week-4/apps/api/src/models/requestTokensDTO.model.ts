import { ApiProperty } from '@nestjs/swagger';

export class RequestTokensDTO {
  @ApiProperty()
  address: string;

  @ApiProperty()
  amount: number;

  constructor(address: string, amount: number) {
    this.address = address;
    this.amount = amount;
  }
}
