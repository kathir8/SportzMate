import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

    return new Promise<boolean>((resolve) => {
    if (auth.isLoggedIn()) {
      resolve(true);
    } else {
      router.navigateByUrl('/login', { replaceUrl: true });
      resolve(false);
    }
  });
};
