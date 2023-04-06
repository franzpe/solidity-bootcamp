import { ApiProperty } from '@nestjs/swagger';

export class MintBodyDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  nftId: number;
}
