import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SpellDocument = HydratedDocument<Spell>;

@Schema()
export class Spell {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  requiredLevel: number;

  @Prop()
  baseDamage: number;
}

export const SpellSchema = SchemaFactory.createForClass(Spell);
