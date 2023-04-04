import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChallengeResponse } from './dtos/response-challenge.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameEventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss: Server;

  afterInit(_server: any) {
    console.log('Initialized');
  }

  async handleConnection(client: Socket, ..._args: any[]) {
    console.log(`client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendInvalidateQuery')
  async handleInvalidateQuery(
    _client: Socket,
    payload: string[],
  ): Promise<void> {
    this.wss.emit('receiveInvalidateQuery', payload);
  }

  @SubscribeMessage('challenge')
  async handleChallenge(
    _client: Socket,
    payload: {
      challengedBy: { _id: string; name: string; level: number };
      challengeTo: string;
    },
  ): Promise<void> {
    this.wss.emit('receiveChallenge', payload);
  }

  async handleChallengeResponse(
    payload: ChallengeResponse & { battleId?: string },
  ): Promise<void> {
    this.wss.emit('challengeResponse', payload);
  }

  @SubscribeMessage('attack')
  async handleAttack(
    _client: Socket,
    payload: {
      battleId: string;
      from: string;
      fromName: string;
      to: string;
      toName: string;
      spell: string;
      damage: number;
      isCritical: boolean;
    },
  ): Promise<void> {
    this.wss.emit('receiveHit', payload);
  }
}
