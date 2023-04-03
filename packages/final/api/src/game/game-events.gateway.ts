import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  async handleConnection(client: any, ..._args: any[]) {
    console.log(`client connected: ${client.id}`);
    this.wss.emit('receiveMessage', 'whatever');
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
}
