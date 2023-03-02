import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private loginService: LoginService, private router :Router) {}

  user: string = '';
  password: string = '';

  ngOnInit(): void {}

  login() {
   if (this.loginService.login(this.user, this.password))
    this.router.navigateByUrl('/')
  else
    console.log('login error')
  }
}
