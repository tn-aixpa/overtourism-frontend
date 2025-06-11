// src/app/services/session.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly STORAGE_KEY = 'session_data';
  private readonly EXPIRATION_DAYS = 7;

  constructor() {
    this.ensureSession();
  }

  private generateSessionId(): string {
    return crypto.randomUUID(); // oppure qualsiasi metodo UUID
  }

  private isExpired(dateString: string): boolean {
    const lastDate = new Date(dateString);
    const now = new Date();
    const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
    return diffDays > this.EXPIRATION_DAYS;
  }

  private ensureSession(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    let sessionId = '';
    let createdAt = '';

    if (data) {
      const parsed = JSON.parse(data);
      sessionId = parsed.sessionId;
      createdAt = parsed.createdAt;

      if (this.isExpired(createdAt)) {
        sessionId = this.generateSessionId();
        createdAt = new Date().toISOString();
      }
    } else {
      sessionId = this.generateSessionId();
      createdAt = new Date().toISOString();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      sessionId,
      createdAt
    }));
  }

  public getSessionId(): string {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data).sessionId : '';
  }
}
