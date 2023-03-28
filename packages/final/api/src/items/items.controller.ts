import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { Item } from './schemas/item.schema';

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    await this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.itemsService.delete(id);
  }
}
