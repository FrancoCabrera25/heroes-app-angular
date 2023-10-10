import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, take, tap } from 'rxjs';
import { inject } from '@angular/core';

const isAuthenticated = (): boolean | Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthentication().pipe(
    take(1),
    tap((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        router.navigate(['./']);
      }
    }),
    map((isAuthenticated) => !isAuthenticated)
  );
};
export const publicGuardCanActivate: CanActivateFn = isAuthenticated;
export const publicGuardCanMatch: CanMatchFn = isAuthenticated;
