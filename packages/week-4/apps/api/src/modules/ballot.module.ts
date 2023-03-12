import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BallotController } from 'src/controllers/ballot.controller';
import { BallotService } from 'src/services/ballot.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BallotController],
  providers: [BallotService],
})
export class BallotModule {}
