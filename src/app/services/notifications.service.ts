import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  type: 'success' | 'danger';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string, duration = 3000) {
    this.pushNotification({ type: 'success', message }, duration);
  }

  showError(message: string, duration = 3000) {
    this.pushNotification({ type: 'danger', message }, duration);
  }

  private pushNotification(notification: Notification, duration: number) {
    this.notificationSubject.next(notification);

    if (duration > 0) {
      setTimeout(() => this.clear(), duration);
    }
  }

  clear() {
    this.notificationSubject.next(null);
  }
}
