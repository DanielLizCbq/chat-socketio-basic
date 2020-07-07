import { Message } from './message';
import { SocketIoService } from './socket-io.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  nickname: string;
  message: string;
  messages: Message[] = [];
  private subscriptionMessages: Subscription;
  private subscriptionList: Subscription;

  @ViewChild(MatList, { read: ElementRef, static: true }) list: ElementRef;
  @ViewChildren(MatListItem) listItems: QueryList<MatListItem>;

  constructor(private socketService: SocketIoService) {}

  ngOnInit(): void {
    this.subscriptionMessages = this.socketService
      .messages()
      .subscribe((m: Message) => {
        console.log(m);
        this.messages.push(m);
      });
  }

  ngOnDestroy(): void {
    this.subscriptionMessages.unsubscribe();
    this.subscriptionList.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subscriptionList = this.listItems.changes.subscribe((e) => {
      this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
    });
  }

  send(): void {
    this.socketService.send({
      from: this.nickname,
      message: this.message,
    });
    this.message = '';
  }
}
