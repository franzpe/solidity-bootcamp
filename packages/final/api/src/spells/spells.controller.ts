import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateSpellDto } from './dto/create-spell.dto';
import { Spell } from './schemas/spell.schema';
import { SpellsService } from './spells.service';

@Controller()
export class SpellsController {
  constructor(private readonly spellService: SpellsService) {}

  @Post()
  async create(@Body() createItemDto: CreateSpellDto) {
    await this.spellService.create(createItemDto);
  }

  @Get()
  async findAll(): Promise<Spell[]> {
    return this.spellService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Spell> {
    return this.spellService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.spellService.delete(id);
  }
}
