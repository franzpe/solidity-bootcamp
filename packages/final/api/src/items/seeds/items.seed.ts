import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ItemsService } from '../items.service';
import { items } from './items';

@Injectable()
export class ItemsSeed {
  constructor(private readonly itemsService: ItemsService) {}

  @Command({
    command: 'create:items',
    describe: 'create items',
  })
  async create() {
    await Promise.all(items.map((dto) => this.itemsService.create(dto)));

    console.log('Items have been populated');
  }

  @Command({
    command: 'delete-all:items',
    describe: 'delete all items',
  })
  async deleteAll() {
    await this.itemsService.deleteAll();

    console.log('All items have been deleted');
  }
}
