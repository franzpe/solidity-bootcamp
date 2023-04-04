import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from 'src/players/players.module';
import { GameEventsGateway } from './game-events.gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Battle, BattleSchema } from './schemas/battle.schema';
import { GameLobby, GameLobbySchema } from './schemas/lobby.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameLobby.name, schema: GameLobbySchema },
      { name: Battle.name, schema: BattleSchema },
    ]),
    PlayersModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameEventsGateway],
})
export class GameModule {}
