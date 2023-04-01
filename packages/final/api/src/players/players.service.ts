import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async create(dto: Player): Promise<Player> {
    const Player = await this.playerModel.create(dto);

    return Player;
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async findOne(id: string): Promise<Player> {
    return this.playerModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const Player = await this.playerModel.findByIdAndDelete({ _id: id }).exec();

    return Player;
  }

  async deleteAll() {
    return this.playerModel.deleteMany({});
  }
}
