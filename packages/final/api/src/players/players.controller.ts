import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Player } from './schemas/player.schema';
import { PlayersService } from './spells.service';

@Controller()
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  async create(@Body() dto: Player) {
    await this.playerService.create(dto);
  }

  @Get()
  async findAll(): Promise<Player[]> {
    return this.playerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Player> {
    return this.playerService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.playerService.delete(id);
  }
}
