import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {UserService} from "../services/user.service";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSignOut(): void {
    this.userService.removeUser();
    this.router.navigate(['/login']);
  }

}
