import { InjectionToken } from '@angular/core';

export interface AppAuthConfig {
  issuer: string;
  clientId: string;
  responseType: string;
  scope: string;
  redirectUri: string;
}

export interface AppConfig {
  apiBaseUrl: string;
  agentApiUrl: string;
  auth: AppAuthConfig;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');