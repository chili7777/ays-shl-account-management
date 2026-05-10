export interface MicrofrontendConfig {
  name: string;
  routePath: string;
  remoteUrl: string;
}

export const AYS_MFA_ACCOUNT_CONFIG: MicrofrontendConfig = {
  name: 'ays-mfa-account',
  routePath: 'ays-mfa-account',
  // Replace this with the real deployed frontend URL.
  remoteUrl: 'https://ays-mfa-account.example.com'
};
