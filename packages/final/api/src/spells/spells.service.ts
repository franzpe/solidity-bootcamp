import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Spell, SpellDocument } from './schemas/spell.schema';

@Injectable()
export class SpellsService {
  constructor(
    @InjectModel(Spell.name) private readonly spellModel: Model<SpellDocument>,
  ) {}

  async create(itemDto: Spell): Promise<Spell> {
    const spell = await this.spellModel.create(itemDto);

    return spell;
  }

  async findAll(): Promise<Spell[]> {
    return this.spellModel.find().exec();
  }

  async findOne(id: string): Promise<Spell> {
    return this.spellModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const Spell = await this.spellModel.findByIdAndDelete({ _id: id }).exec();

    return Spell;
  }

  async deleteAll() {
    return this.spellModel.deleteMany({});
  }
}
