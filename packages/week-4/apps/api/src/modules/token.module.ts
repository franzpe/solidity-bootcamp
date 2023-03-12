import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokenController } from 'src/controllers/token.controller';
import { TokenService } from 'src/services/token.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
