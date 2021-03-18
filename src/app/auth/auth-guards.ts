import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';


import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.user !== undefined && this.auth.user !== null) {
      return this.auth.user.pipe(
        take(1),
        map((user) => !!user),
        tap((loggedIn) => {
          if (!loggedIn) {
            /* alert('access denied');
            this.notify.update('You must be logged in!', 'error'); */
            this.router.navigate(['auth/login']);
            return false;
          } else {
            return true;
          }
        })
      );
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
