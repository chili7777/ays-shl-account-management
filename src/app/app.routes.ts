import { Routes } from '@angular/router';

import { MicrofrontendFrameComponent } from './microfrontend-frame.component';
import { MICROFRONTENDS } from './microfrontend.config';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accounts',
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      ...MICROFRONTENDS.map(mfe => ({
        path: mfe.routePath,
        component: MicrofrontendFrameComponent,
        data: { mfe },
      }))
    ]
  },
  {
    path: '**',
    redirectTo: 'accounts',
  },
];
