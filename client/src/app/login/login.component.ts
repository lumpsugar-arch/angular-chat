import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'

import { SocketService } from '../services/socket.service'
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  user;
  loginForm;

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.user = '';

    this.loginForm = this.formBuilder.group({
      username: ''
    })
  }

  onSubmit(userData) {
    const loggedTime = new Date().getTime();
    // const loggedTime = Date.now();

    const user = {
      id: `user_${loggedTime}`,
      name: userData.username
    };

    this.user = this.socketService.joinChat(user);
    this.userService.setUser(user);
    this.router.navigate(['/chat'])
  }

  ngOnInit() {
  }

}
