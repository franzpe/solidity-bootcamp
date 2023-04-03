import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameLobby, GameLobbyDocument } from './schemas/lobby.schema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameLobby.name)
    private readonly lobbyModel: Model<GameLobbyDocument>,
  ) {}

  async joinLobby(id: string): Promise<string> {
    await this.lobbyModel.create({ player: id });

    return id;
  }

  async leaveLobby(id: string): Promise<string> {
    await this.lobbyModel.findOneAndDelete({ player: id }).exec();

    return id;
  }

  async findAllPlayersInLobby() {
    return await this.lobbyModel.find().populate('player').exec();
  }
}
