import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, Wallet } from 'ethers';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('goerli');

    import('contract/artifacts/contracts/ERC20Votes.sol/MyToken.json').then(
      (tokenJson) => {
        this.tokenContract = new ethers.Contract(
          this.configService.get<string>('TOKEN_ADDRESS'),
          tokenJson.abi,
          this.provider,
        );
      },
    );

    import(
      'contract/artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json'
    ).then((tokenJson) => {
      this.ballotContract = new ethers.Contract(
        this.configService.get<string>('BALLOT_ADDRESS'),
        tokenJson.abi,
        this.provider,
      );
    });
  }

  getTokenContractAddress(): string {
    return this.tokenContract.address;
  }

  getBallotContractAddress(): string {
    return this.ballotContract.address;
  }

  async requestTokens(address: string, amount: number): Promise<string> {
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    if (!privateKey) {
      throw new InternalServerErrorException('Wrong server configuration');
    }

    const signer = new Wallet(
      this.configService.get<string>('PRIVATE_KEY'),
      this.provider,
    );

    const tx = await this.tokenContract
      .connect(signer)
      .mint(address, ethers.utils.parseEther(amount.toString()));
    const txReceipt = await tx.wait();

    return txReceipt.hash;
  }
}
