import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MicrofrontendConfig } from './microfrontend.config';

@Component({
  selector: 'app-microfrontend-frame',
  standalone: true,
  template: `
    <section class="mfe-container">
      <h1>shell</h1>
      @if (remoteUrl) {
        <iframe
          class="mfe-frame"
          [src]="remoteUrl"
          title="ays-mfa-account"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      } @else {
        <p>Micro-frontend URL is not configured yet.</p>
      }
    </section>
  `,
  styles: `
    .mfe-container {
      display: grid;
      gap: 1rem;
      min-height: 100vh;
      padding: 1rem;
      box-sizing: border-box;
    }

    .mfe-frame {
      width: 100%;
      min-height: calc(100vh - 6rem);
      border: 0;
      border-radius: 0.5rem;
      background: #fff;
    }
  `
})
export class MicrofrontendFrameComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly remoteUrl: SafeResourceUrl | null = this.getSafeUrl();

  private getSafeUrl(): SafeResourceUrl | null {
    const config = this.route.snapshot.data['mfe'] as MicrofrontendConfig | undefined;
    if (!config?.remoteUrl || config.remoteUrl.includes('example.com')) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(config.remoteUrl);
  }
}
