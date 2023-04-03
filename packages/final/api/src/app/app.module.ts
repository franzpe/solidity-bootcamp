import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from 'src/game/game.module';
import { ItemsModule } from 'src/items/items.module';
import { PlayersModule } from 'src/players/players.module';
import { SeedsModule } from 'src/seeds/seeds.module';
import { SpellsModule } from 'src/spells/spells.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/rogue'),
    ItemsModule,
    SpellsModule,
    PlayersModule,
    GameModule,
    SeedsModule,
    RouterModule.register([
      { path: 'items', module: ItemsModule },
      { path: 'spells', module: SpellsModule },
      { path: 'players', module: PlayersModule },
      { path: 'game', module: GameModule },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
