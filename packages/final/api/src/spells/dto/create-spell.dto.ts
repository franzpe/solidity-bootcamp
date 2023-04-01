import { ApiProperty } from '@nestjs/swagger';

export class CreateSpellDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  requiredLevel: number;

  @ApiProperty()
  baseDamage: number;

  @ApiProperty()
  imageUri: string;
}
