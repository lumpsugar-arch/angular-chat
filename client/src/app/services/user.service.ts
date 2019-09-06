import { Injectable } from "@angular/core";

import * as socketIo from 'socket.io-client'

import { SERVER_URL } from "../chat/helpers/helpers";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public setUser(data: object) {
    window.localStorage.setItem('user', JSON.stringify(data))
  }

  public getUser() {
    return window.localStorage.getItem('user')
  }
}
