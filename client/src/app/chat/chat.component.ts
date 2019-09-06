import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { SocketService } from '../services/socket.service';
import { UserService } from "../services/user.service";
import { User } from '../models/user';
import { Message } from '../models/message'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {
  user: User;
  messages: Message[] = [];
  messageContent;
  ioConnection: any;
  messageForm;

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.messageContent = '';

    this.messageForm = this.formBuilder.group({
      message: '',
    })
  }

  ngOnInit() {
    this.user = JSON.parse(this.userService.getUser());

    console.log(this.user);
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        console.log(message);
        this.messages.push(message)
      })
  }

  onSubmit(messageData) {
    const message = {
      userId: this.user.id,
      userName: this.user.name,
      msg: messageData.message,
      date: new Date().getTime()
    };

    console.log(message);
    // this.messages.push(message);
    console.log(this.messages);

    this.messageContent = this.socketService.sendMessage(message)
  }
}
