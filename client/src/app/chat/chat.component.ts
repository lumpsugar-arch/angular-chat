import {Component, OnInit, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {SocketService} from '../services/socket.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {Message} from '../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  user: User;
  messages: Message[] = [];
  messageContent: string;
  ioConnection: any;
  messageForm: FormGroup;

  @ViewChild('chatHistory', { static: false }) chatHistory: ElementRef;

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.messageContent = '';

    this.messageForm = this.formBuilder.group({
      message: '',
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(this.userService.getUser());

    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: any) => {
        if (message.msg.date) {
          message.date = this.getTime(+message.msg.date);
        }
        this.messages.push(message);
      });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  onSubmit(messageData): void {
    if (!messageData.message) {
      return;
    }
    const message = {
      userId: this.user.id,
      userName: this.user.name,
      msg: messageData.message,
      date: Date.now().toString()
    };

    this.socketService.sendMessage(message);
    this.messageForm.reset();
  }

  getTime(date) {
    const newDate = new Date(date);
    const hours = (newDate.getHours() < 10 ? '0' : '') + newDate.getHours();
    const minutes = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
    return `${hours}:${minutes}`;
  }

  scrollToBottom(): void {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch (err) { }
  }

  onSignOut(): void {
    this.userService.removeUser();
    this.router.navigateByUrl('/login');
  }
}
