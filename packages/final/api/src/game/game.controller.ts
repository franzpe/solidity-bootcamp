import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChallengeResponse } from './dtos/response-challenge.dto';
import { GameService } from './game.service';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/lobby/:id')
  async join(@Param('id') id: string) {
    return await this.gameService.joinLobby(id);
  }

  @Post('/challenge-response')
  async responseChallenge(@Body() dto: ChallengeResponse) {
    return this.gameService.responseChallenge(dto);
  }

  @Delete('/lobby/:id')
  async leave(@Param('id') id: string) {
    return await this.gameService.leaveLobby(id);
  }

  @Get('/lobby')
  async findAll(): Promise<any[]> {
    return this.gameService.findAllPlayersInLobby();
  }

  @Get('/rankings')
  async getRankings(): Promise<any[]> {
    return this.gameService.getRankings();
  }

  @Get('/battle/:id')
  async find(@Param('id') id: string) {
    return this.gameService.findBattle(id);
  }

  @Post('/battle/:id')
  async setWinner(@Param('id') id: string, @Body() body: { winner: string }) {
    return this.gameService.setWinner(id, body.winner);
  }
}
