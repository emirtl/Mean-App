import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authservice: AuthService, private router: Router) {}
  private isAuth = this.authservice.getisAuth();
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (!this.isAuth) {
      this.router.navigate(['/login']);
    }
    return this.isAuth;
  }
}
