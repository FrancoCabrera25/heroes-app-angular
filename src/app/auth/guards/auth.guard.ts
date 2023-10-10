import {
  CanActivate,
  CanActivateFn,
  CanMatchFn,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, take, tap } from 'rxjs';
import { inject } from '@angular/core';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

const isAuthenticated = (): boolean | Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthentication().pipe(
    take(1),
    tap((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        router.navigate(['./auth/login']);
      }
    })
  );
};

export const authGuardCanActivate: CanActivateFn = isAuthenticated;
export const authGuardCanMatch: CanMatchFn = isAuthenticated;
