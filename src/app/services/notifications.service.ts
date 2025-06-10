import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  showError(message: string) {
    this.errorSubject.next(message);
  }

  clear() {
    this.errorSubject.next(null);
  }
}
