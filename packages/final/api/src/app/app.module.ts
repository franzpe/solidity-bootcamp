import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ItemsModule } from 'src/items/items.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ItemsModule,
    RouterModule.register([{ path: 'items', module: ItemsModule }]),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
