import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { RegisterPlayerDto } from './dtos/register-player';
import { PlayersService } from './players.service';
import { Player } from './schemas/player.schema';

@Controller()
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  async create(@Body() dto: CreatePlayerDto) {
    await this.playerService.create(dto);
  }

  @Post('/register')
  async register(@Body() dto: RegisterPlayerDto): Promise<Player> {
    return this.playerService.register(dto);
  }

  @Get('/check/:address')
  async checkPlayer(@Param('address') address: string): Promise<boolean> {
    return this.playerService.checkPlayer(address);
  }

  @Get()
  async findAll(): Promise<Player[]> {
    return this.playerService.findAll();
  }

  @Get('/me/:address')
  async me(@Param('address') address: string): Promise<Player> {
    return this.playerService.findOne(address);
  }

  @Get(':address')
  async findOne(@Param('address') address: string): Promise<Player> {
    return this.playerService.findOne(address);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.playerService.delete(id);
  }

  @Get('/:id/items')
  async playerItems(@Param('id') id: string) {
    return this.playerService.findPlayerItems(id);
  }
}
