import { Injectable } from '@nestjs/common';

import myTokenJson from 'contract/artifacts/contracts/ERC20Votes.sol/MyToken.json';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    console.log(
      await import('contract/artifacts/contracts/ERC20Votes.sol/MyToken.json'),
    );

    return JSON.stringify(myTokenJson.abi);
  }
}
