import { Component, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MicrofrontendConfig } from './microfrontend.config';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-microfrontend-frame',
  standalone: true,
  template: `
    <section class="mfe-container">
      @if (remoteUrl) {
        <iframe
          #mfeFrame
          class="mfe-frame"
          [src]="remoteUrl"
          [title]="mfeName"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          (load)="onFrameLoad()"
        ></iframe>
      } @else {
        <div class="mfe-error">
          <span class="material-icons">error_outline</span>
          <p>La URL para {{ mfeLabel }} no está configurada.</p>
        </div>
      }
    </section>
  `,
  styles: `
    .mfe-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      background: transparent;
    }

    .mfe-frame {
      width: 100%;
      height: calc(100vh - 120px);
      border: none;
      background: transparent;
    }

    .mfe-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #90949c;
      gap: 1rem;

      .material-icons {
        font-size: 3rem;
      }
    }

    @media (max-width: 768px) {
      .mfe-frame {
        height: calc(100vh - 140px); // Ajuste para barra inferior
      }
    }
  `
})
export class MicrofrontendFrameComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly authService = inject(AuthService);

  @ViewChild('mfeFrame') mfeFrame?: ElementRef<HTMLIFrameElement>;

  mfeName = '';
  mfeLabel = '';
  remoteUrl: SafeResourceUrl | null = null;
  private currentConfig?: MicrofrontendConfig;

  constructor() {
    this.route.queryParams.subscribe(() => {
      this.remoteUrl = this.getSafeUrl();
    });
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    // Escuchar handshake de los MFE
    if (event.data?.type === 'MFE_READY') {
      console.log(`[Shell] MFE ${this.mfeName} reportó listo. Re-enviando datos.`);
      this.sendSessionData();
    }
  }

  onFrameLoad() {
    console.log(`[Shell] Iframe ${this.mfeName} cargado. Enviando datos iniciales.`);
    this.sendSessionData();
  }

  private sendSessionData() {
    if (!this.mfeFrame?.nativeElement.contentWindow || !this.currentConfig?.remoteUrl) return;

    const sessionData = {
      type: 'SHELL_SESSION_DATA',
      payload: {
        role: this.authService.getUserRole(),
        clientId: this.authService.getClientId(),
        userName: this.authService.getUserName()
      }
    };

    // Usamos el remoteUrl como targetOrigin para mayor seguridad
    const targetOrigin = new URL(this.currentConfig.remoteUrl).origin;
    this.mfeFrame.nativeElement.contentWindow.postMessage(sessionData, targetOrigin);
  }

  private getSafeUrl(): SafeResourceUrl | null {
    const config = this.route.snapshot.data['mfe'] as MicrofrontendConfig | undefined;
    if (!config) return null;

    this.currentConfig = config;
    this.mfeName = config.name;
    this.mfeLabel = config.label;

    if (!config.remoteUrl) {
      return null;
    }

    // Ya no propagamos datos sensibles por URL, solo queryParams de navegación si existen
    const queryParams = { ...this.route.snapshot.queryParams };

    // Eliminamos explícitamente clientId y role si venían en la URL de la Shell
    delete queryParams['clientId'];
    delete queryParams['role'];

    const queryString = new URLSearchParams(queryParams).toString();
    const internalPath = config.internalPath || '';
    const baseUrl = config.remoteUrl + internalPath;
    const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }
}
