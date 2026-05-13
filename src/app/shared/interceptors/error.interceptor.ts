import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ErrorModelDto } from '../models/error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado.';
      const errorData = error.error as ErrorModelDto;

      switch (error.status) {
        case 400:
          errorMessage = errorData?.detail || 'Solicitud incorrecta.';
          // Si hay errores de validación específicos, el componente los manejará si los necesita,
          // pero el interceptor muestra el mensaje general.
          notificationService.error(errorMessage);
          break;

        case 401:
          errorMessage = 'Sesión expirada o no autorizada. Redirigiendo al login...';
          notificationService.error(errorMessage);
          authService.logout();
          router.navigate(['/login']);
          break;

        case 404:
          errorMessage = 'El registro solicitado no existe.';
          notificationService.error(errorMessage);
          break;

        case 500:
          errorMessage = 'Hubo un problema en el servidor. Nuestro equipo técnico ha sido notificado.';
          notificationService.error(errorMessage);
          break;

        default:
          errorMessage = errorData?.detail || `Error ${error.status}: ${error.statusText}`;
          notificationService.error(errorMessage);
          break;
      }

      return throwError(() => error);
    })
  );
};
