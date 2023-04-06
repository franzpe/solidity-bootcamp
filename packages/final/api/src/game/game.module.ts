import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsService } from 'src/items/items.service';
import { Item, ItemSchema } from 'src/items/schemas/item.schema';
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
      { name: Item.name, schema: ItemSchema },
    ]),
    PlayersModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameEventsGateway, ConfigService, ItemsService],
})
export class GameModule {}
