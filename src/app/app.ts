import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
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
  private router = inject(Router);
  isLoggedIn = this.authService.isLoggedIn;
  isSidebarOpen = signal(false);

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    const { type, payload } = event.data || {};
    if (type === 'MFE_NAVIGATE') {
      const { path, queryParams } = payload;
      console.log('[Shell] Recibida solicitud de navegación:', { path, queryParams });
      this.router.navigate([path], { queryParams });
    }
  }

  get mfes() {
    const role = (this.authService.userRole() || 'USER').toString().toUpperCase();
    if (role === 'ADMIN') {
      return MICROFRONTENDS;
    }

    return MICROFRONTENDS.map(mfe => {
      if (mfe.routePath === 'clients') {
        const clientId = this.authService.getClientId();
        return {
          ...mfe,
          label: 'Mi Perfil',
          internalPath: role !== 'ADMIN' && clientId ? `/customers/detail/${clientId}` : ''
        };
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
    return {};
  }
}
