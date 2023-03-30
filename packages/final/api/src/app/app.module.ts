import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from 'src/items/items.module';
import { SeedsModule } from 'src/seeds/seeds.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/rogue'),
    ItemsModule,
    SeedsModule,
    RouterModule.register([{ path: 'items', module: ItemsModule }]),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
