declare global {
  interface Window {
    __APP_CONFIG__?: {
      AYS_MFA_CLIENT_URL?: string;
      AYS_MFA_ACCOUNT_URL?: string;
      AYS_MFA_MOVEMENT_URL?: string;
    };
  }
}

export interface MicrofrontendConfig {
  name: string;
  routePath: string;
  remoteUrl: string;
  icon: string;
  label: string;
}

const config = window.__APP_CONFIG__;

export const MICROFRONTENDS: MicrofrontendConfig[] = [
  {
    name: 'ays-mfa-client',
    label: 'Clientes',
    routePath: 'clients',
    remoteUrl: config?.AYS_MFA_CLIENT_URL?.trim() ?? '',
    icon: 'person'
  },
  {
    name: 'ays-mfa-account',
    label: 'Cuentas',
    routePath: 'accounts',
    remoteUrl: config?.AYS_MFA_ACCOUNT_URL?.trim() ?? '',
    icon: 'account_balance'
  },
  {
    name: 'ays-mfa-movement',
    label: 'Movimientos',
    routePath: 'movements',
    remoteUrl: config?.AYS_MFA_MOVEMENT_URL?.trim() ?? '',
    icon: 'swap_horiz'
  }
];
