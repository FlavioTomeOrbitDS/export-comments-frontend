import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // check if the user is authenticated
    const isAuthenticated = this.loginService.getUserLogged(); // replace this with your authentication logic

    if (!isAuthenticated) {
      // redirect the user to the login page
      this.router.navigateByUrl('/login')
      return false;
    }

    return true;
  }

  constructor(private loginService: LoginService, private router: Router) {}
}
