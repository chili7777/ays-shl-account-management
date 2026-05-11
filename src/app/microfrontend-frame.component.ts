import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MicrofrontendConfig } from './microfrontend.config';

@Component({
  selector: 'app-microfrontend-frame',
  standalone: true,
  template: `
    <section class="mfe-container">
      <h1>Módulo de Cuentas</h1>
      @if (remoteUrl) {
        <iframe
          class="mfe-frame"
          [src]="remoteUrl"
          title="ays-mfa-account"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      } @else {
        <p>Set AYS_MFA_ACCOUNT_URL in DigitalOcean app environment variables.</p>
      }
    </section>
  `,
  styles: `
    .mfe-container {
      display: grid;
      gap: 1rem;
      min-height: calc(100vh - 120px);
      padding: 1rem;
      box-sizing: border-box;
      color: #e0e0e0;
    }

    .mfe-frame {
      width: 100%;
      min-height: calc(100vh - 200px);
      border: 0;
      border-radius: 1rem;
      background: #1e1e26;
      box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.04);
    }
  `
})
export class MicrofrontendFrameComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly remoteUrl: SafeResourceUrl | null = this.getSafeUrl();

  private getSafeUrl(): SafeResourceUrl | null {
    const config = this.route.snapshot.data['mfe'] as MicrofrontendConfig | undefined;
    if (!config?.remoteUrl) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(config.remoteUrl);
  }
}
