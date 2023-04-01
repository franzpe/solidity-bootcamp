import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Item } from 'src/items/schemas/item.schema';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
  @Prop()
  address: string;

  // Profile props
  @Prop()
  name: string;

  @Prop()
  imageUri: string;

  // Character props
  @Prop()
  level: number;

  @Prop()
  health: number;

  @Prop()
  experience: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
  items: Item[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
