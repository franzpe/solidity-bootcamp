import { ApiProperty } from '@nestjs/swagger';

export class RegisterPlayerDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imgUri: string;
}
