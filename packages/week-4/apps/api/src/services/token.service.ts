import { ethers } from 'ethers';
import { BaseService } from './abstract/BaseService';
import { ITokenService } from './interfaces/token.service.interface';

export class TokenService extends BaseService implements ITokenService {
  getTokenContractAddress(): string {
    return this.tokenContract.address;
  }

  async requestTokens(address: string, amount: number): Promise<string> {
    const tx = await this.tokenContract.mint(
      address,
      ethers.utils.parseEther(amount.toString()),
    );
    await tx.wait();
    return tx.hash;
  }
}
