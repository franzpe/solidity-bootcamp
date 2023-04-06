import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers, Wallet } from 'ethers';
import { Model } from 'mongoose';
import { ItemsService } from 'src/items/items.service';
import { PlayersService } from 'src/players/players.service';
import { Player } from 'src/players/schemas/player.schema';
const gameTokensAbi = require('../assets/gameTokensAbi.json');
import { ChallengeResponse } from './dtos/response-challenge.dto';
import { GameEventsGateway } from './game-events.gateway';
import { Battle, BattleDocument } from './schemas/battle.schema';
import { GameLobby, GameLobbyDocument } from './schemas/lobby.schema';

@Injectable()
export class GameService {
  protected provider: ethers.providers.Provider;
  protected gamesContract: ethers.Contract;

  constructor(
    @InjectModel(GameLobby.name)
    private readonly lobbyModel: Model<GameLobbyDocument>,
    @InjectModel(Battle.name)
    private readonly battleModel: Model<BattleDocument>, //
    private readonly gameGtw: GameEventsGateway,
    private readonly configService: ConfigService,
    private readonly itemsService: ItemsService,
    private readonly playerService: PlayersService,
  ) {
    const alchemy = new Alchemy({
      apiKey: this.configService.get<string>('ALCHEMY_API_KEY') || '',
      network: Network.ETH_SEPOLIA,
    });

    alchemy.config.getProvider().then((provider) => {
      this.provider = provider;

      const signer = new Wallet(
        this.configService.get<string>('GAME_MANAGER_PRIVATE_KEY'),
        this.provider,
      );

      this.gamesContract = new ethers.Contract(
        this.configService.get<string>('GAME_TOKENS_CONTRACT_ADDRESS'),
        gameTokensAbi.abi,
        signer,
      );
    });
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

  async calculateReward(id: string, winnerId: string) {
    const battle = await this.findBattle(id);

    if ((battle.winner as any)._id.toString() !== winnerId) {
      throw new Error('Not the winner');
    }

    const random = Math.round(Math.random() * 3) + 1;

    const item = await this.itemsService.findOneByIpfsId(random);

    return item;
  }

  async mintNft(address: string, nftId: number) {
    const mintTx = await this.gamesContract.mint(address, nftId, 1, '0x');
    const tx = await mintTx.wait();

    const [player, item] = await Promise.all([
      this.playerService.findOne(address),
      this.itemsService.findOneByIpfsId(nftId),
    ]);

    await this.playerService.addItem((player as any)._id, (item as any)._id);

    return tx.transactionHash;
  }
}
