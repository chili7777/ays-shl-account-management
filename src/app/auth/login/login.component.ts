import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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

  onSubmit() {
    if (!this.clientId || !this.password) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.clientId, this.password).subscribe({
      next: () => {
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu ID de cliente y contraseña.';
        } else if (err.status === 0) {
          this.errorMessage = 'Error de conexión. No se pudo contactar con el servidor.';
        } else if (err.status === 404) {
          this.errorMessage = 'Servicio de autenticación no encontrado.';
        } else {
          this.errorMessage = err.error?.message || 'Ocurrió un error inesperado. Intente más tarde.';
        }
      }
    });
  }
}
