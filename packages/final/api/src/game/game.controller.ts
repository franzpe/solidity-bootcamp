import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/lobby/:id')
  async join(@Param('id') id: string) {
    return await this.gameService.joinLobby(id);
  }

  @Delete('/lobby/:id')
  async leave(@Param('id') id: string) {
    return await this.gameService.leaveLobby(id);
  }

  @Get('/lobby/players')
  async findAll(): Promise<any[]> {
    return this.gameService.findAllPlayersInLobby();
  }
}
