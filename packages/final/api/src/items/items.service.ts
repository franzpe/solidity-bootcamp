import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { Item, ItemDocument } from './schemas/item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) {}

  async create(itemDto: CreateItemDto): Promise<Item> {
    const item = await this.itemModel.create(itemDto);

    return item;
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    return this.itemModel.findOne({ _id: id }).exec();
  }

  async findOneByIpfsId(ipfsId: number): Promise<Item> {
    return this.itemModel.findOne({ ipfsId: ipfsId }).exec();
  }

  async delete(id: string) {
    const deleteItem = await this.itemModel
      .findByIdAndDelete({ _id: id })
      .exec();

    return deleteItem;
  }

  async deleteAll() {
    return this.itemModel.deleteMany({});
  }
}
