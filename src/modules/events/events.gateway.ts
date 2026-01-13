import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('patient:moved')
  handlePatientMoved(client: Socket, data: any) {
    this.server.emit('patient:moved', data);
    return { event: 'patient:moved', data };
  }

  @SubscribeMessage('equipment:moved')
  handleEquipmentMoved(client: Socket, data: any) {
    this.server.emit('equipment:moved', data);
    return { event: 'equipment:moved', data };
  }

  @SubscribeMessage('alert:triggered')
  handleAlertTriggered(client: Socket, data: any) {
    this.server.emit('alert:triggered', data);
    return { event: 'alert:triggered', data };
  }
}
