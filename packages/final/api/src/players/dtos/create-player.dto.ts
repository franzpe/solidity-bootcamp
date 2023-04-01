import { ApiProperty } from '@nestjs/swagger';
import { Item } from 'src/items/schemas/item.schema';

export class CreatePlayerDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imgUri: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  health: number;

  @ApiProperty()
  experience?: number;

  @ApiProperty()
  items: Item[];
}
