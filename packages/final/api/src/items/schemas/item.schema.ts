import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

export type ItemSlot = 'head' | 'chest' | 'legs' | 'weapon';

@Schema()
export class Item {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  ipfsId: number;

  @Prop()
  imgUri: string;

  @Prop()
  slot: ItemSlot;

  @Prop()
  strength?: number;

  @Prop()
  agility?: number;

  @Prop()
  damage?: number;

  @Prop()
  level: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
