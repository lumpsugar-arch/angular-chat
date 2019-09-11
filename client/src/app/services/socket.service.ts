import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Message } from '../models/message';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
  private readonly socket;

  constructor(
  ) {
    if (!this.socket) {
      this.socket = socketIo(SERVER_URL);
    }

    return this;
  }

  public joinChat(user: User): void {
    const userData = JSON.stringify(user);
    this.socket.emit('join', userData);
  }

  public sendMessage(message: Message): void {
    const messageData = JSON.stringify(message);
    this.socket.emit('message', messageData);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: string) => {
        observer.next(JSON.parse(data));
      });
    });
  }
}
