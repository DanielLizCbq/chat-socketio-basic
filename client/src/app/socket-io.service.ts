import { Message } from './message';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

import * as socketio from 'socket.io-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private url = environment.urlSocketIo;
  private socket = socketio(this.url);
  private subjMessages$: Subject<Message> = new Subject<Message>();

  constructor() {
    this.socket.on('message', (m: Message) => {
      this.subjMessages$.next(m);
    });
  }

  send(msg: Message): void {
    this.socket.emit('message', msg);
  }

  messages(): Observable<Message> {
    return this.subjMessages$.asObservable();
  }
}
