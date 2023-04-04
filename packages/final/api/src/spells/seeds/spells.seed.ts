import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SpellsService } from '../spells.service';
import { spells } from './spells';

@Injectable()
export class SpellsSeed {
  constructor(private readonly spellsService: SpellsService) {}

  @Command({
    command: 'create:spells',
    describe: 'create spells',
  })
  async create() {
    await Promise.all(spells.map((dto) => this.spellsService.create(dto)));

    console.log('Spells have been populated');
  }

  @Command({
    command: 'delete-all:spells',
    describe: 'delete all spells',
  })
  async deleteAll() {
    await this.spellsService.deleteAll();

    console.log('All spells have been deleted');
  }
}
