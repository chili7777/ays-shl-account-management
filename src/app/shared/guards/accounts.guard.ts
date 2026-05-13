import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const accountsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const role = authService.getUserRole();
  const storedClientId = authService.getClientId();
  const queryClientId = route.queryParams['clientId'];

  // ADMIN puede ver todo (con o sin clientId)
  if (role === 'ADMIN') {
    return true;
  }

  // USER DEBE tener su clientId
  if (queryClientId === storedClientId) {
    return true;
  }

  // Si es USER e intenta acceder a /accounts sin params o con param incorrecto, redirigir a su propia cuenta
  router.navigate(['/accounts'], { queryParams: { clientId: storedClientId } });
  return false;
};
