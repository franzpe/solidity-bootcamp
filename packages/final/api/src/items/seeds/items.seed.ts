import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ItemsService } from '../items.service';
import { CreateItemDto } from '../dto/create-item.dto';

@Injectable()
export class ItemsSeed {
  constructor(private readonly itemsService: ItemsService) {}

  @Command({
    command: 'create:items',
    describe: 'create items',
  })
  async create() {
    const dtos: CreateItemDto[] = [
      {
        name: "Poorman's knife",
        damage: 2,
        slot: 'weapon',
        description: 'Super basic knife',
        level: 1,
        imgUri: '#',
      },
      {
        name: 'Layered Tunic',
        slot: 'chest',
        description: 'Well worn chest',
        level: 1,
        imgUri: '#',
      },
      {
        name: 'Gnarpline Leggins',
        slot: 'legs',
        description: 'Gnarpline Leggins',
        level: 1,
        imgUri: '#',
      },
      {
        name: 'Nightscape Headband',
        slot: 'head',
        description: 'Headband',
        level: 1,
        imgUri: '#',
      },
    ];

    await Promise.all(dtos.map((dto) => this.itemsService.create(dto)));

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
