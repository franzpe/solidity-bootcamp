import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { RegisterPlayerDto } from './dtos/register-player';
import { Player, PlayerDocument } from './schemas/player.schema';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async create(dto: CreatePlayerDto): Promise<Player> {
    const player = await this.playerModel.create(dto);

    return player;
  }

  async register(dto: RegisterPlayerDto): Promise<Player> {
    const player = await this.create({
      ...dto,
      health: 50,
      level: 1,
      experience: 0,
      items: [],
    });
    return player;
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async findOne(address: string): Promise<Player> {
    return this.playerModel.findOne({ address }).exec();
  }

  async delete(id: string) {
    const Player = await this.playerModel.findByIdAndDelete({ _id: id }).exec();

    return Player;
  }

  async deleteAll() {
    return this.playerModel.deleteMany({});
  }

  async checkPlayer(address: string): Promise<boolean> {
    const player = await this.findOne(address);

    return !!player;
  }

  async addItem(id: string, itemId: string) {
    const player = await this.playerModel.findById(id);

    return await this.playerModel.findOneAndUpdate(
      { _id: id },
      {
        items: [...player.items, itemId],
      },
    );
  }

  async findPlayerItems(id: string) {
    const player = await this.playerModel.findById(id).populate('items');

    return player.items;
  }
}
