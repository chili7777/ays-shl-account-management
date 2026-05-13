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
    const role = (this.authService.userRole() || 'USER').toString().toUpperCase();
    if (role === 'ADMIN') {
      return MICROFRONTENDS;
    }

    return MICROFRONTENDS.map(mfe => {
      if (mfe.routePath === 'clients') {
        return { ...mfe, label: 'Mi Perfil' };
      }
      return mfe;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  getQueryParams(mfe: any) {
    const role = (this.authService.userRole() || 'USER').toString().toUpperCase();
    if (role !== 'ADMIN') {
      const clientId = this.authService.getClientId();
      if (mfe.routePath === 'accounts' || mfe.routePath === 'clients' || mfe.routePath === 'movements') {
        return { client: clientId };
      }
    }
    return {};
  }
}
