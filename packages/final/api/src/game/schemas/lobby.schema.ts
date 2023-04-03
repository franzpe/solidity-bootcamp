import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Player } from 'src/players/schemas/player.schema';

export type GameLobbyDocument = HydratedDocument<GameLobby>;

@Schema()
export class GameLobby {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Player' })
  player: Player;
}

export const GameLobbySchema = SchemaFactory.createForClass(GameLobby);
