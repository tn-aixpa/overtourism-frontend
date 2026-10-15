import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from './app-config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _config!: AppConfig;
  private http: HttpClient;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  get config(): AppConfig {
    return this._config;
  }

  get apiBaseUrl(): string {
    return this._config?.apiBaseUrl || '';
  }

  get agentApiUrl(): string {
    return this._config?.agentApiUrl || '';
  }

  get cartoApiKey(): string {
    return this._config?.cartoApiKey || '';
  }

  get versionInfo() {
    return this._config?.version || {
      version: 'dev',
      releaseUrl: 'https://github.com/smartcommunitylab/overtourism-frontend'
    };
  }

  async loadConfig(): Promise<AppConfig> {
    try {
      this._config = await firstValueFrom(
        this.http.get<AppConfig>('/assets/config.json')
      );

      try {
        const localConfig = await firstValueFrom(
          this.http.get<Partial<AppConfig>>('/assets/config.local.json')
        );
        if (localConfig) {
          this._config = { ...this._config, ...localConfig };
        }
      } catch {
        // config.local.json 
      }

      return this._config;
    } catch (error) {
      console.error('Impossibile caricare la configurazione dell\'applicazione:', error);
      throw error;
    }
  }
}