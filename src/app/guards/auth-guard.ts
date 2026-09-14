import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { map, of, skipWhile, take } from 'rxjs';
import { inject } from '@angular/core';

const waitForInit = (authService: AuthService) => {
  return of(authService.isInitializing()).pipe(
    skipWhile((isInit) => isInit === true),
    take(1),
  );
};

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isInitializing()) {
    return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
  }

  return authService.checkSession().pipe(
    map(user => !!user ? true : router.createUrlTree(['/login']))
  );
};


export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isInitializing()) {
    return authService.isAuthenticated() ? router.createUrlTree(['/admin']) : true;
  }

  return authService
    .checkSession()
    .pipe(map((user) => (!!user ? router.createUrlTree(['/admin']) : true)));
}

