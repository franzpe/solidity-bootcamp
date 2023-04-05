import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Player, PlayerDocument } from 'src/players/schemas/player.schema';
import { ChallengeResponse } from './dtos/response-challenge.dto';
import { GameEventsGateway } from './game-events.gateway';
import { Battle, BattleDocument } from './schemas/battle.schema';
import { GameLobby, GameLobbyDocument } from './schemas/lobby.schema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameLobby.name)
    private readonly lobbyModel: Model<GameLobbyDocument>,
    @InjectModel(Battle.name)
    private readonly battleModel: Model<BattleDocument>, //
    private readonly gameGtw: GameEventsGateway,
  ) {
    console.log(gameGtw);
  }

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

  async getRankings(): Promise<{ player: Player; wins: number }[]> {
    let rankings: Record<string, { player: Player; wins: number }> = {};

    const finishedBattles = await this.battleModel
      .find({ status: 'finished' })
      .populate('winner')
      .exec();

    finishedBattles.forEach((f) => {
      rankings[f.winner.address] = {
        ...rankings[f.winner.address],
        player: f.winner,
        wins: rankings[f.winner.address]?.wins
          ? rankings[f.winner.address].wins + 1
          : 1,
      };
    });

    return Object.values(rankings).sort((a, b) => b.wins - a.wins);
  }

  async responseChallenge(dto: ChallengeResponse) {
    let id: string = '';

    if (dto.response) {
      const res = await this.battleModel.create({
        player1: dto.challengedById,
        player2: dto.challengedTo,
        status: 'running',
      });

      id = res._id.toString();
    }

    await this.gameGtw.handleChallengeResponse({ ...dto, battleId: id });

    return id;
  }

  findBattle(id: string) {
    return this.battleModel
      .findOne({ _id: id })
      .populate(['player1', 'player2', 'winner']);
  }

  setWinner(id: string, winner: string) {
    return this.battleModel
      .findByIdAndUpdate(id, {
        winner,
        status: 'finished',
      })
      .populate('winner');
  }
}
