import { Injectable } from '@angular/core';
import { AppConfig } from './app-config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _config!: AppConfig;

  get config(): AppConfig {
    if (!this._config) {
      throw new Error('Configurazione non ancora inizializzata.');
    }
    return this._config;
  }

  get apiBaseUrl(): string {
    return this._config?.apiBaseUrl || '';
  }

  get agentApiUrl(): string {
    return this._config?.agentApiUrl || '';
  }

  async loadConfig(): Promise<AppConfig> {
    try {
      const timestamp = new Date().getTime();
      // Prova /assets/config.json (se in src/assets), altrimenti /config.json (se in public)
      let response = await fetch(`/assets/config.json?v=${timestamp}`);
      if (!response.ok) {
        response = await fetch(`/config.json?v=${timestamp}`);
      }
      if (!response.ok) {
        throw new Error(`Impossibile trovare config.json (status: ${response.status})`);
      }
      this._config = await response.json();
      return this._config;
    } catch (err) {
      console.error('Errore critico durante il caricamento di config.json:', err);
      throw err;
    }
  }
}