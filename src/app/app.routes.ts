import { Routes } from '@angular/router';

import { MicrofrontendFrameComponent } from './microfrontend-frame.component';
import { MICROFRONTENDS } from './microfrontend.config';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: MICROFRONTENDS[0].routePath,
  },
  ...MICROFRONTENDS.map(mfe => ({
    path: mfe.routePath,
    component: MicrofrontendFrameComponent,
    data: { mfe },
  })),
  {
    path: '**',
    redirectTo: MICROFRONTENDS[0].routePath,
  },
];
