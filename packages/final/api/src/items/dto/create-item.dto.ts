import { ApiProperty } from '@nestjs/swagger';
import { ItemSlot } from '../schemas/item.schema';

export class CreateItemDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  ipfsId: number;

  @ApiProperty()
  imgUri: string;

  @ApiProperty()
  slot: ItemSlot;

  @ApiProperty()
  level: number;

  @ApiProperty()
  strength?: number;

  @ApiProperty()
  agility?: number;

  @ApiProperty()
  damage?: number;
}
