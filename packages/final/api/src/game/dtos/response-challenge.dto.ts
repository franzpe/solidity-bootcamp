import { ApiProperty } from '@nestjs/swagger';

export class ChallengeResponse {
  @ApiProperty()
  challengedById: string;

  @ApiProperty()
  challengedTo: string;

  @ApiProperty()
  response: boolean;
}
