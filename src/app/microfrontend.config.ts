declare global {
  interface Window {
    __APP_CONFIG__?: {
      AYS_MFA_ACCOUNT_URL?: string;
    };
  }
}

export interface MicrofrontendConfig {
  name: string;
  routePath: string;
  remoteUrl: string;
}

const runtimeMfaUrl = window.__APP_CONFIG__?.AYS_MFA_ACCOUNT_URL?.trim() ?? '';

export const AYS_MFA_ACCOUNT_CONFIG: MicrofrontendConfig = {
  name: 'ays-mfa-account',
  routePath: 'ays-mfa-account',
  remoteUrl: runtimeMfaUrl,
};
