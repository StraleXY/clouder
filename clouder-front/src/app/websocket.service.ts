import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    socket: any

  eventCallback: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  connect() {
      this.socket = new WebSocket('wss link here');

      this.socket.addEventListener('open', ( event: any ) => {
          console.log('WebSocket connection opened');
      });

      this.socket.addEventListener('message', ( event: any ) => {
          this.eventCallback.emit(event.data)
        //   console.log('Received message from server:', event.data);
      });

      this.socket.addEventListener('close', ( event: any ) => {
          console.log('WebSocket connection closed');
      });
  };

  disconnect() {
      this.socket.close();
  }
}
