export interface ITokenService {
  getTokenContractAddress(): string;
  requestTokens(address: string, amount: number): Promise<string>;
}
