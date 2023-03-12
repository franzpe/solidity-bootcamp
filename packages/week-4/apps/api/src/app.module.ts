import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BallotModule } from './modules/ballot.module';
import { TokenModule } from './modules/token.module';

@Module({
  imports: [
    TokenModule,
    BallotModule,
    RouterModule.register([
      { path: 'token', module: TokenModule },
      { path: 'ballot', module: BallotModule },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
