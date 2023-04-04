import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Player } from 'src/players/schemas/player.schema';

export type BattleDocument = HydratedDocument<Battle>;

export type BattleStatus = 'running' | 'finished';

@Schema()
export class Battle {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Player' })
  player1: Player;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Player' })
  player2: Player;

  @Prop()
  status: BattleStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Player' })
  winner: Player;
}

export const BattleSchema = SchemaFactory.createForClass(Battle);
