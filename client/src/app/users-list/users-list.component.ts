import {Component, OnInit} from '@angular/core';

import {User} from '../models/user';

import {SocketService} from '../services/socket.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less']
})
export class UsersListComponent implements OnInit {
  ioConnection: any;
  users: User[] = [];
  constructor(
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.ioConnection = this.socketService.onMessage()
      .subscribe((msg: any) => {
        if (msg.type === 'user') {
          this.users.push(msg);
        }
      });
  }
}
