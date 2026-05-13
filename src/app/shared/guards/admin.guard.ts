import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getUserRole() === 'ADMIN') {
    return true;
  }

  // Si no es admin, redirigir a accounts con su propio clientId
  const clientId = authService.getClientId();
  router.navigate(['/accounts'], { queryParams: { clientId } });
  return false;
};
