import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MicrofrontendConfig } from './microfrontend.config';

@Component({
  selector: 'app-microfrontend-frame',
  standalone: true,
  template: `
    <section class="mfe-container">
      @if (remoteUrl) {
        <iframe
          class="mfe-frame"
          [src]="remoteUrl"
          [title]="mfeName"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
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

  mfeName = '';
  mfeLabel = '';
  remoteUrl: SafeResourceUrl | null = null;

  constructor() {
    this.route.queryParams.subscribe(() => {
      this.remoteUrl = this.getSafeUrl();
    });
  }

  private getSafeUrl(): SafeResourceUrl | null {
    const config = this.route.snapshot.data['mfe'] as MicrofrontendConfig | undefined;
    if (!config) return null;

    this.mfeName = config.name;
    this.mfeLabel = config.label;

    if (!config.remoteUrl) {
      return null;
    }

    // Propagar query params al iframe
    const queryParams = this.route.snapshot.queryParams;
    const queryString = new URLSearchParams(queryParams).toString();
    const internalPath = config.internalPath || '';
    const baseUrl = config.remoteUrl + internalPath;
    const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }
}
