import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from 'src/players/players.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameLobby, GameLobbySchema } from './schemas/lobby.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameLobby.name, schema: GameLobbySchema },
    ]),
    PlayersModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}