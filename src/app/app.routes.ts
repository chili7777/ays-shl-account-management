import { Routes } from '@angular/router';

import { MicrofrontendFrameComponent } from './microfrontend-frame.component';
import { AYS_MFA_ACCOUNT_CONFIG } from './microfrontend.config';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AYS_MFA_ACCOUNT_CONFIG.routePath,
  },
  {
    path: AYS_MFA_ACCOUNT_CONFIG.routePath,
    component: MicrofrontendFrameComponent,
    data: { mfe: AYS_MFA_ACCOUNT_CONFIG },
  },
  {
    path: '**',
    redirectTo: AYS_MFA_ACCOUNT_CONFIG.routePath,
  },
];
