import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, Wallet } from 'ethers';

@Injectable()
export class BaseService {
  protected provider: ethers.providers.Provider;
  protected tokenContract: ethers.Contract;
  protected ballotContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.provider = this.createProvider();

    this.buildTokenContract().then(
      (contract) => (this.tokenContract = contract),
    );

    this.buildBallotContract().then(
      (contract) => (this.ballotContract = contract),
    );
  }

  protected createSigner = (privateKey: string) => {
    return new Wallet(privateKey, this.provider);
  };

  protected createProvider = () => {
    return new ethers.providers.AlchemyProvider(
      'goerli',
      this.configService.get<string>('ALCHEMY_API_KEY'),
    );
  };

  protected async buildTokenContract(): Promise<ethers.Contract> {
    const signer = this.createSigner(
      this.configService.get<string>('PRIVATE_KEY'),
    );
    const tokenJson = await import(
      'contract/artifacts/contracts/ERC20Votes.sol/MyToken.json'
    );
    return new ethers.Contract(
      this.configService.get<string>('TOKEN_ADDRESS'),
      tokenJson.abi,
      signer,
    );
  }

  protected async buildBallotContract(): Promise<ethers.Contract> {
    const signer = this.createSigner(
      this.configService.get<string>('PRIVATE_KEY'),
    );
    const ballotJson = await import(
      'contract/artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json'
    );
    return new ethers.Contract(
      this.configService.get<string>('BALLOT_ADDRESS'),
      ballotJson.abi,
      signer,
    );
  }
}
