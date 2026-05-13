import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  clientId = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdRef = inject(ChangeDetectorRef);

  onSubmit() {
    if (!this.clientId || !this.password) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.clientId, this.password)
      .subscribe({
        next: () => {
          this.isLoading = false;
          const role = this.authService.getUserRole();
          const clientId = this.authService.getClientId();

          if (role === 'ADMIN') {
            this.router.navigate(['/clients']);
          } else {
            // Si no es ADMIN, redirigir a cuentas filtradas por cliente
            this.router.navigate(['/accounts'], { queryParams: { client: clientId } });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;

          // Extraer mensaje del backend según la estructura observada
          let backendMessage = '';
          if (err.error) {
            backendMessage = err.error.detail || err.error.message || (typeof err.error === 'string' ? err.error : '');
          }

          if (err.status === 401) {
            this.errorMessage = backendMessage || 'Credenciales inválidas';
          } else if (err.status === 0) {
            this.errorMessage = 'Error de red: No se pudo conectar con el servidor';
          } else {
            this.errorMessage = backendMessage || `Error ${err.status}: Intente nuevamente`;
          }

          // Forzar la detección de cambios para asegurar que el mensaje se muestre y el botón se habilite
          this.cdRef.detectChanges();
        }
      });
  }
}
