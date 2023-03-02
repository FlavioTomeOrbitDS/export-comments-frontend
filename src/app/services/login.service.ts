import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private user = ['@orbitdatascience'];
  private passwrd = ['psswd@0123'];

  private userLogged = false;
  private setUserLogged(value: boolean) {
    this.userLogged = value;
  }

  public getUserLogged() {
    return this.userLogged;
  }

  constructor() {}

  public login(user: string, password: string) {
    if (this.user.indexOf(user) > -1 && this.passwrd.indexOf(password)) {
      this.setUserLogged(true);
      return true
    } else {
      this.setUserLogged(false);
      return false
    }
  }

  public logout(){
    this.setUserLogged(false)
  }
}
