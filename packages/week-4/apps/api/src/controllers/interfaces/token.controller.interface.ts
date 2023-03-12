import { RequestTokensDTO } from 'src/models/requestTokensDTO.model';

export interface ITokenController {
  getTokenContractAddress(): string;
  requestTokens(body: RequestTokensDTO): Promise<string>;
}
