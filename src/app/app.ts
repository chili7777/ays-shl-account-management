import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MICROFRONTENDS } from './microfrontend.config';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;
  isSidebarOpen = signal(false);

  get mfes() {
    const role = this.authService.userRole();
    if (role === 'ADMIN') {
      return MICROFRONTENDS;
    }
    // Por defecto para USER o si no hay rol, ocultar Clientes
    return MICROFRONTENDS.filter(mfe => mfe.routePath !== 'clients');
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  getQueryParams(mfe: any) {
    const role = this.authService.userRole();
    if (mfe.routePath === 'accounts' && role !== 'ADMIN') {
      return { clientId: this.authService.getClientId() };
    }
    return {};
  }
}
